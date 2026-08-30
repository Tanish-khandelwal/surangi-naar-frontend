import { PrismaClient } from '@prisma/client';

/**
 * Ensures Neon PostgreSQL connection strings include ?pgbouncer=true when connecting via Neon's connection pooler.
 * 
 * ARCHITECTURE NOTE FOR PERSISTENT SERVERS:
 * Do NOT set `connection_limit=1` here. A `connection_limit=1` parameter is intended strictly for
 * ephemeral serverless environments (e.g. Vercel Functions / AWS Lambda) handling 1 invocation per container.
 * This Node/Express application runs as a persistent long-running server on Hostinger and requires Prisma's
 * default multi-connection pool size to serve concurrent API requests without queue starvation.
 */
export function getFormattedDatabaseUrl(urlStr) {
  if (!urlStr) return urlStr;
  try {
    const url = new URL(urlStr);
    if (!url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true');
    }
    return url.toString();
  } catch (e) {
    return urlStr;
  }
}

function createPrismaInstance() {
  const rawUrl = process.env.DATABASE_URL;
  const formattedUrl = getFormattedDatabaseUrl(rawUrl);

  const options = {};
  if (formattedUrl) {
    options.datasources = {
      db: {
        url: formattedUrl,
      },
    };
  }
  if (process.env.NODE_ENV !== 'production') {
    options.log = ['warn'];
  }
  return new PrismaClient(options);
}

let currentPrisma = createPrismaInstance();
let resetPromise = null;
let lastResetTimestamp = 0;
const RESET_COOLDOWN_MS = 5000; // Minimum 5 seconds between client reinstantiations

export async function resetPrismaClient(triggerError) {
  const now = Date.now();
  
  // If a reset is already in progress, wait for it to complete instead of spawning parallel clients
  if (resetPromise) {
    return resetPromise;
  }

  // If client was reset very recently (< 5s ago), skip reinstantiation to prevent thundering herd
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

/**
 * Identifies genuine, unrecoverable database engine panics or connection termination errors.
 * 
 * NOTE ON ERROR CODES:
 * P2024 ("Timed out waiting for a connection from the pool") is intentionally EXCLUDED.
 * P2024 is a capacity/load signal indicating pool wait timeout under heavy traffic — NOT an engine crash.
 */
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
                // Auto-retry operation once on the fresh PrismaClient instance
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
                      // Auto-retry model query once on the fresh PrismaClient instance
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
