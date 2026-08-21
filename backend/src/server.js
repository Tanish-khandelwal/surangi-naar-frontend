import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

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

import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Cross-Origin Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://surangi-naar.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Surangi Naar Backend API',
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

// Centralized Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Surangi Naar Backend running on port ${PORT}`);
  });
}

export default app;
