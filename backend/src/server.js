import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma, { closeDatabasePool } from './config/db.js';

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
  const timeoutMs = 10000;
  const delayBetweenAttemptsMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let timer;
    try {
      const queryPromise = prisma.$queryRaw`SELECT 1`.catch(() => 'FAILED_QUERY');
      const timeoutPromise = new Promise((resolve) => {
        timer = setTimeout(() => resolve('TIMEOUT'), timeoutMs);
      });

      const result = await Promise.race([queryPromise, timeoutPromise]);
      if (timer) clearTimeout(timer);

      if (result !== 'TIMEOUT' && result !== 'FAILED_QUERY') {
        console.log(`✅ Database connectivity confirmed at startup (attempt ${attempt}/${maxAttempts})`);
        return;
      }

      const reason = result === 'TIMEOUT' ? `timed out after ${timeoutMs / 1000}s` : 'query execution failed';
      if (attempt < maxAttempts) {
        console.warn(`⚠️ Warm-up attempt ${attempt}/${maxAttempts} failed (${reason}), retrying in ${delayBetweenAttemptsMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayBetweenAttemptsMs));
      } else {
        console.error(`❌ Database connectivity FAILED at startup after ${maxAttempts} attempts (${reason}) (server will continue running)`);
      }
    } catch (err) {
      if (timer) clearTimeout(timer);
      const reason = err?.message || err;
      if (attempt < maxAttempts) {
        console.warn(`⚠️ Warm-up attempt ${attempt}/${maxAttempts} failed (${reason}), retrying in ${delayBetweenAttemptsMs / 1000}s...`);
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
