import dns from 'node:dns';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Sanitizes and prepares Neon PostgreSQL connection strings for node-postgres.
 */
export function getFormattedDatabaseUrl(urlStr) {
  if (!urlStr) return urlStr;
  try {
    const url = new URL(urlStr);
    if (!url.searchParams.has('sslmode') || url.searchParams.get('sslmode') === 'verify-full') {
      url.searchParams.set('sslmode', 'require');
    }
    if (url.searchParams.has('pgbouncer')) {
      url.searchParams.delete('pgbouncer');
    }
    if (url.searchParams.has('channel_binding')) {
      url.searchParams.delete('channel_binding');
    }
    return url.toString();
  } catch (e) {
    return urlStr;
  }
}

let currentPool = null;

function createPrismaInstance() {
  const rawUrl = process.env.DATABASE_URL;
  const connectionString = getFormattedDatabaseUrl(rawUrl);

  const options = {};
  if (connectionString) {
    const pool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      lookup: (hostname, opts, cb) => {
        dns.lookup(hostname, { family: 4 }, cb);
      },
    });

    pool.on('error', (err) => {
      console.error('🔥 PG POOL ERROR:', err?.message || err);
    });

    pool.on('connect', () => {
      console.log('✅ PG POOL CONNECTED TO DATABASE');
    });

    currentPool = pool;
    const adapter = new PrismaPg(pool);
    options.adapter = adapter;
  }

  if (process.env.NODE_ENV !== 'production') {
    options.log = ['warn'];
  }
  return new PrismaClient(options);
}

function runSingleTimeout(promiseOrFn, ms, label) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error(`${label} timeout after ${ms / 1000}s`);
      err.isTimeout = true;
      console.error(`🔥 TIMEOUT EXCEEDED: ${label} timed out after ${ms / 1000}s`);
      reject(err);
    }, ms);
  });

  const p = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;
  return Promise.race([p, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export async function withQueryTimeout(promiseOrFn, ms = 15000, label = 'Database query', maxRetries = 2) {
  if (typeof ms === 'string') {
    maxRetries = typeof label === 'number' ? label : 2;
    label = ms;
    ms = 15000;
  }
  let attempt = 0;
  while (true) {
    attempt++;
    const attemptLabel = attempt === 1 ? label : `${label} (retry ${attempt - 1})`;
    try {
      return await runSingleTimeout(promiseOrFn, ms, attemptLabel);
    } catch (err) {
      const isTimeout = err && (err.isTimeout || err.message?.includes('timeout'));
      const canRetry = attempt <= maxRetries;

      if (isTimeout) {
        resetPrismaClient(err).catch(() => { });
        if (canRetry) {
          const backoffMs = 1000 * Math.pow(2, attempt - 1);
          console.warn(
            `⚠️ ${label} attempt ${attempt} timed out after ${ms / 1000}s. Resetting connection pool and retrying in ${backoffMs / 1000}s (retry ${attempt}/${maxRetries})...`
          );
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }
  }
}

let currentPrisma = createPrismaInstance();
let resetPromise = null;
let lastResetTimestamp = 0;
const RESET_COOLDOWN_MS = 5000;

export async function resetPrismaClient(triggerError) {
  const now = Date.now();

  if (resetPromise) {
    return resetPromise;
  }

  if (now - lastResetTimestamp < RESET_COOLDOWN_MS) {
    return currentPrisma;
  }

  resetPromise = (async () => {
    try {
      const errDetail = triggerError ? `[${triggerError.name || 'Error'}${triggerError.code ? ' / ' + triggerError.code : ''}]: ${triggerError.message || triggerError}` : '';
      console.warn(`🔄 Prisma connection error detected ${errDetail}. Resetting PrismaClient instance...`);

      const oldPrisma = currentPrisma;
      const oldPool = currentPool;
      currentPrisma = createPrismaInstance();
      lastResetTimestamp = Date.now();

      if (oldPrisma) {
        try {
          await oldPrisma.$disconnect();
        } catch (err) {
          // Ignore errors when disconnecting an already crashed client
        }
      }
      if (oldPool) {
        try {
          await oldPool.end();
        } catch (err) {
          // Ignore
        }
      }
      return currentPrisma;
    } finally {
      resetPromise = null;
    }
  })();

  return resetPromise;
}

export async function closeDatabasePool() {
  try {
    if (currentPrisma) {
      await currentPrisma.$disconnect();
    }
    if (currentPool) {
      await currentPool.end();
    }
    console.log('✅ Gracefully closed database connection on shutdown');
  } catch (err) {
    console.error('Error closing database connection on shutdown:', err?.message || err);
  }
}

export function isPrismaFatalError(error) {
  if (!error) return false;
  const name = error.name || '';
  const message = typeof error === 'string' ? error : (error.message || '');
  const code = error.code || '';

  return (
    name === 'PrismaClientRustPanicError' ||
    name === 'PrismaClientInitializationError' ||
    name === 'PrismaClientUnknownRequestError' ||
    (name === 'PrismaClientKnownRequestError' && ['P1001', 'P1002', 'P1017'].includes(code)) ||
    message.includes('timer has gone away') ||
    message.includes('Engine has already exited') ||
    message.includes('Connection reset by peer') ||
    message.includes("Can't reach database server") ||
    message.includes('Response from the Engine was empty')
  );
}

const prismaProxy = new Proxy(currentPrisma, {
  get(target, prop) {
    if (prop === '$resetClient') {
      return resetPrismaClient;
    }

    const activeTarget = currentPrisma;
    const val = Reflect.get(activeTarget, prop, activeTarget);

    if (typeof val === 'function') {
      return function (...args) {
        try {
          const result = val.apply(currentPrisma, args);
          if (result && typeof result.then === 'function') {
            return result.catch(async (err) => {
              if (isPrismaFatalError(err)) {
                await resetPrismaClient(err);
                try {
                  const retryVal = Reflect.get(currentPrisma, prop, currentPrisma);
                  if (typeof retryVal === 'function') {
                    return await retryVal.apply(currentPrisma, args);
                  }
                } catch (retryErr) {
                  throw retryErr;
                }
              }
              throw err;
            });
          }
          return result;
        } catch (err) {
          if (isPrismaFatalError(err)) {
            resetPrismaClient(err).catch(() => { });
          }
          throw err;
        }
      };
    }

    if (val && typeof val === 'object') {
      return new Proxy(val, {
        get(modelTarget, modelProp) {
          const activeModelTarget = currentPrisma[prop] || modelTarget;
          const modelVal = Reflect.get(activeModelTarget, modelProp, activeModelTarget);

          if (typeof modelVal === 'function') {
            return function (...args) {
              try {
                const latestModelTarget = currentPrisma[prop] || modelTarget;
                const result = modelVal.apply(latestModelTarget, args);
                if (result && typeof result.then === 'function') {
                  return result.catch(async (err) => {
                    if (isPrismaFatalError(err)) {
                      await resetPrismaClient(err);
                      try {
                        const freshModel = currentPrisma[prop];
                        if (freshModel && typeof freshModel[modelProp] === 'function') {
                          return await freshModel[modelProp].apply(freshModel, args);
                        }
                      } catch (retryErr) {
                        throw retryErr;
                      }
                    }
                    throw err;
                  });
                }
                return result;
              } catch (err) {
                if (isPrismaFatalError(err)) {
                  resetPrismaClient(err).catch(() => { });
                }
                throw err;
              }
            };
          }
          return modelVal;
        },
      });
    }

    return val;
  },
});

export default prismaProxy;
