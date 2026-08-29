import { PrismaClient } from '@prisma/client';

/**
 * Ensures Neon PostgreSQL pooled connection strings include ?pgbouncer=true&connection_limit=1
 * as recommended by Prisma documentation to prevent stale connection engine crashes.
 */
export function getFormattedDatabaseUrl(urlStr) {
  if (!urlStr) return urlStr;
  try {
    const url = new URL(urlStr);
    if (!url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true');
    }
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '1');
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

export async function resetPrismaClient() {
  console.warn('🔄 Prisma engine error or connection panic detected. Resetting PrismaClient instance...');
  const oldPrisma = currentPrisma;
  currentPrisma = createPrismaInstance();
  if (oldPrisma) {
    try {
      await oldPrisma.$disconnect();
    } catch (err) {
      // Ignore errors when disconnecting an already crashed client
    }
  }
  return currentPrisma;
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
    (name === 'PrismaClientKnownRequestError' && ['P1001', 'P1002', 'P1017', 'P2024'].includes(code)) ||
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
          const result = val.apply(activeTarget, args);
          if (result && typeof result.then === 'function') {
            return result.catch(async (err) => {
              if (isPrismaFatalError(err)) {
                await resetPrismaClient();
              }
              throw err;
            });
          }
          return result;
        } catch (err) {
          if (isPrismaFatalError(err)) {
            resetPrismaClient().catch(() => {});
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
                      await resetPrismaClient();
                    }
                    throw err;
                  });
                }
                return result;
              } catch (err) {
                if (isPrismaFatalError(err)) {
                  resetPrismaClient().catch(() => {});
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
