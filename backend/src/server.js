import dns from 'node:dns';
import net from 'node:net';
dns.setDefaultResultOrder('ipv4first');

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma, { closeDatabasePool, getFormattedDatabaseUrl } from './config/db.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import heroRoutes from './modules/hero/hero.routes.js';
import promoRoutes from './modules/promo/promo.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';
import addressesRoutes from './modules/addresses/addresses.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import couponsRoutes from './modules/coupons/coupons.routes.js';
import sitemapRoutes from './modules/sitemap/sitemap.routes.js';
import { getSitemapXml } from './modules/sitemap/sitemap.controller.js';

import { errorHandler } from './middleware/errorHandler.js';

// Process-level error and exit handlers to log process events without crashing Node
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('exit', (code) => {
  console.log(`⚠️ PROCESS EXITING with code ${code}`);
});

let isShuttingDown = false;

const handleGracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`⚠️ Received ${signal} signal (platform shutdown/restart request)`);
  try {
    await closeDatabasePool();
  } catch (err) {
    console.error(`Error during ${signal} graceful shutdown:`, err?.message || err);
  } finally {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL environment variable is required');
}

// Security & Cross-Origin Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const allowedOrigins = [
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '',
  'https://suranghinaar.com',
  'https://www.suranghinaar.com',
  'https://api.suranghinaar.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.includes(cleanOrigin) ||
                      /^https:\/\/(.*\.)?suranghinaar\.com$/.test(cleanOrigin) ||
                      /^http:\/\/localhost:\d+$/.test(cleanOrigin);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));

// Sanitize URL whitespace & newline breaks (e.g. copied Postman URLs ending in %0A / \n)
app.use((req, res, next) => {
  if (req.url) {
    req.url = req.url.trim().replace(/(%0A|%0D|\r|\n)+$/gi, '');
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & API Info Check
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Suranghi Naar Backend API',
    message: 'Suranghi Naar API Server is operational',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      heroSlides: '/api/hero-slides',
      storeSettings: '/api/store-settings',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Suranghi Naar Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Diagnostic route for live database connection inspection
app.get('/api/test-connection', async (req, res) => {
  const results = {};
  const host = 'ep-square-mouse-azh9s2y4-pooler.c-3.ap-southeast-1.aws.neon.tech';
  const formattedUrl = getFormattedDatabaseUrl(process.env.DATABASE_URL);

  results.os_info = {
    platform: process.platform,
    arch: process.arch,
    node: process.version,
    openssl: process.versions.openssl,
  };

  const runWithTimeout = (promise, ms, label) => {
    let t;
    const timeout = new Promise((_, reject) => {
      t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
  };

  const tasks = [
    // 1. DNS Resolution
    (async () => {
      try {
        results.dns = await new Promise((resolve, reject) => {
          dns.lookup(host, { all: true }, (err, addresses) => err ? reject(err) : resolve(addresses));
        });
      } catch (err) {
        results.dns_error = err.message;
      }
    })(),

    // 2. Outbound TCP to port 5432
    (async () => {
      try {
        const start = Date.now();
        results.tcp_5432 = await new Promise((resolve) => {
          const socket = net.createConnection({ host, port: 5432, timeout: 2500 });
          socket.on('connect', () => {
            const time = Date.now() - start;
            socket.destroy();
            resolve(`SUCCESS in ${time}ms`);
          });
          socket.on('timeout', () => {
            socket.destroy();
            resolve('TIMED_OUT after 2500ms');
          });
          socket.on('error', (err) => {
            resolve(`FAILED: ${err.message}`);
          });
        });
      } catch (err) {
        results.tcp_5432_error = err.message;
      }
    })(),

    // 3. raw pg.Client query to Category table
    (async () => {
      try {
        const pg = (await import('pg')).default;
        const start = Date.now();
        const client = new pg.Client({
          connectionString: formattedUrl,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 3500,
        });
        await runWithTimeout(client.connect(), 3500, 'pg.connect');
        const pgRes = await runWithTimeout(client.query('SELECT count(*) as count FROM "Category"'), 3500, 'pg.query');
        await client.end().catch(() => {});
        results.raw_pg_category_count = {
          status: 'SUCCESS',
          count: pgRes.rows[0]?.count,
          time_ms: Date.now() - start,
        };
      } catch (err) {
        results.raw_pg_error = err.message;
      }
    })(),

    // 4. raw pg.Pool query to Category table
    (async () => {
      try {
        const pg = (await import('pg')).default;
        const start = Date.now();
        const pool = new pg.Pool({
          connectionString: formattedUrl,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 3500,
        });
        const pgRes = await runWithTimeout(pool.query('SELECT count(*) as count FROM "Category"'), 3500, 'pool.query');
        await pool.end().catch(() => {});
        results.raw_pool_category_count = {
          status: 'SUCCESS',
          count: pgRes.rows[0]?.count,
          time_ms: Date.now() - start,
        };
      } catch (err) {
        results.raw_pool_error = err.message;
      }
    })(),

    // 5. Main App Prisma Query (with pure-JS ClientEngine)
    (async () => {
      try {
        const start = Date.now();
        const cats = await runWithTimeout(prisma.category.findMany({ take: 2 }), 3500, 'main app prisma query');
        results.main_app_prisma = {
          status: 'SUCCESS',
          time_ms: Date.now() - start,
          count: cats.length,
        };
      } catch (err) {
        results.main_app_prisma_error = `${err.message} (${err.name || ''})`;
      }
    })(),
  ];

  await Promise.allSettled(tasks);

  results.env = {
    NODE_ENV: process.env.NODE_ENV,
    has_DATABASE_URL: Boolean(process.env.DATABASE_URL),
    db_host: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).host : 'NOT_SET',
    db_user: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).username : 'NOT_SET',
    db_params: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).search : 'NOT_SET',
  };

  return res.status(200).json(results);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/hero-slides', heroRoutes);
app.use('/api/promo-messages', promoRoutes);
app.use('/api/store-settings', settingsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/sitemap.xml', sitemapRoutes);
app.get('/sitemap.xml', getSitemapXml);

// Centralized Error Handler
app.use(errorHandler);

async function testDatabaseConnection() {
  const maxAttempts = 3;
  const timeoutMs = 20000;
  const delayBetweenAttemptsMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const startTime = Date.now();
    let timer;
    try {
      const queryPromise = prisma.$queryRaw`SELECT 1`.catch(() => 'FAILED_QUERY');
      const timeoutPromise = new Promise((resolve) => {
        timer = setTimeout(() => resolve('TIMEOUT'), timeoutMs);
      });

      const result = await Promise.race([queryPromise, timeoutPromise]);
      if (timer) clearTimeout(timer);

      const elapsedMs = Date.now() - startTime;
      if (result !== 'TIMEOUT' && result !== 'FAILED_QUERY') {
        console.log(`✅ Database connectivity confirmed at startup in ${elapsedMs}ms (attempt ${attempt}/${maxAttempts})`);
        return;
      }

      const reason = result === 'TIMEOUT' ? `timed out after ${timeoutMs / 1000}s` : 'query execution failed';
      if (attempt < maxAttempts) {
        console.warn(`⚠️ Warm-up attempt ${attempt}/${maxAttempts} failed in ${elapsedMs}ms (${reason}), retrying in ${delayBetweenAttemptsMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayBetweenAttemptsMs));
      } else {
        console.error(`❌ Database connectivity FAILED at startup after ${maxAttempts} attempts (${reason}) (server will continue running)`);
      }
    } catch (err) {
      if (timer) clearTimeout(timer);
      const elapsedMs = Date.now() - startTime;
      const reason = err?.message || err;
      if (attempt < maxAttempts) {
        console.warn(`⚠️ Warm-up attempt ${attempt}/${maxAttempts} failed in ${elapsedMs}ms (${reason}), retrying in ${delayBetweenAttemptsMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayBetweenAttemptsMs));
      } else {
        console.error(`❌ Database connectivity FAILED at startup after ${maxAttempts} attempts (${reason}) (server will continue running)`);
      }
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Suranghi Naar Backend running on port ${PORT}`);
    testDatabaseConnection();
  });
}

export default app;
