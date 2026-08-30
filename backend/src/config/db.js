import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Ensures Neon PostgreSQL connection strings include ?pgbouncer=true when connecting via Neon's connection pooler.
 */
export function getFormattedDatabaseUrl(urlStr) {
  if (!urlStr) return urlStr;
  try {
    const url = new URL(urlStr);
    if (!url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true');
    }
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'verify-full');
    }
    return url.toString();
  } catch (e) {
    return urlStr;
  }
}

function createPrismaInstance() {
  const rawUrl = process.env.DATABASE_URL;
  const connectionString = getFormattedDatabaseUrl(rawUrl);

  const options = {};
  if (connectionString) {
    const pool = new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);
    options.adapter = adapter;
  }

  if (process.env.NODE_ENV !== 'production') {
    options.log = ['warn'];
  }
  return new PrismaClient(options);
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
      currentPrisma = createPrismaInstance();
      lastResetTimestamp = Date.now();

      if (oldPrisma) {
        try {
          await oldPrisma.$disconnect();
        } catch (err) {
          // Ignore errors when disconnecting an already crashed client
        }
      }
      return currentPrisma;
    } finally {
      resetPromise = null;
    }
  })();

  return resetPromise;
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
            resetPrismaClient(err).catch(() => {});
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
                  resetPrismaClient(err).catch(() => {});
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
