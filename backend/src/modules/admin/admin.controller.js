import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../../config/db.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import {
  adminLoginSchema,
  productSchema,
  categorySchema,
  heroSlideSchema,
  promoMessageSchema,
  discountCodeSchema,
  storeSettingsSchema,
} from './admin.schema.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@suranginaar.com';

    let isAdminValid = false;
    let userPayload = null;

    // Check database admin user first
    const adminUser = await prisma.user.findUnique({ where: { email } });
    if (adminUser && adminUser.role === 'admin' && adminUser.passwordHash) {
      isAdminValid = await bcrypt.compare(password, adminUser.passwordHash);
      if (isAdminValid) {
        userPayload = {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name || 'Admin User',
          role: 'admin',
        };
      }
    } else if (email === adminEmail && process.env.ADMIN_PASSWORD_HASH) {
      isAdminValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
      if (isAdminValid) {
        userPayload = {
          id: 'admin-root-id',
          email: adminEmail,
          name: 'Admin User',
          role: 'admin',
        };
      }
    }

    if (!isAdminValid || !userPayload) {
      return sendError(res, 401, 'Invalid admin credentials');
    }

    const token = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    return sendSuccess(res, 200, { token, refreshToken, user: userPayload }, 'Admin authenticated successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 500, error.message);
  }
};

// --- Products Admin CRUD ---
export const createProduct = async (req, res) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const product = await prisma.product.create({ data: validatedData });
    return sendSuccess(res, 201, { product }, 'Product created successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = productSchema.partial().parse(req.body);
    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });
    return sendSuccess(res, 200, { product }, 'Product updated successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return sendSuccess(res, 200, {}, 'Product deleted successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Categories Admin CRUD ---
export const createCategory = async (req, res) => {
  try {
    const validatedData = categorySchema.parse(req.body);
    const category = await prisma.category.create({ data: validatedData });
    return sendSuccess(res, 201, { category }, 'Category created successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = categorySchema.partial().parse(req.body);
    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    });
    return sendSuccess(res, 200, { category }, 'Category updated successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    return sendSuccess(res, 200, {}, 'Category deleted successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Hero Slides Admin CRUD ---
export const addHeroSlide = async (req, res) => {
  try {
    const validatedData = heroSlideSchema.parse(req.body);
    const count = await prisma.heroSlide.count();
    const slide = await prisma.heroSlide.create({
      data: {
        ...validatedData,
        order: validatedData.order || count + 1,
      },
    });
    return sendSuccess(res, 201, { slide }, 'Hero slide added successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const updateHeroSlides = async (req, res) => {
  try {
    const { slides } = req.body;
    if (!Array.isArray(slides)) {
      return sendError(res, 400, 'Slides must be an array');
    }
    const validatedSlides = z.array(heroSlideSchema.partial()).parse(slides);
    for (const s of validatedSlides) {
      if (s.id) {
        await prisma.heroSlide.update({
          where: { id: Number(s.id) },
          data: {
            subtitle: s.subtitle,
            title: s.title,
            description: s.description,
            cta: s.cta,
            categorySlug: s.categorySlug,
            image: s.image,
            order: s.order || 0,
          },
        });
      }
    }
    const updated = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
    return sendSuccess(res, 200, { slides: updated }, 'Hero slides updated successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.heroSlide.delete({ where: { id: Number(id) } });
    return sendSuccess(res, 200, {}, 'Hero slide deleted successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Promo Messages Admin CRUD ---
export const addPromoMessage = async (req, res) => {
  try {
    const validatedData = promoMessageSchema.parse(req.body);
    const count = await prisma.promoMessage.count();
    const promo = await prisma.promoMessage.create({
      data: {
        message: validatedData.message,
        order: validatedData.order || count + 1,
      },
    });
    return sendSuccess(res, 201, { promo }, 'Promo message added');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const updatePromoMessages = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return sendError(res, 400, 'Messages must be an array');
    }
    const promoArraySchema = z.array(z.union([z.string().min(1, 'Message text is required'), promoMessageSchema]));
    const validatedMessages = promoArraySchema.parse(messages);

    await prisma.promoMessage.deleteMany({});
    for (let i = 0; i < validatedMessages.length; i++) {
      const msg = typeof validatedMessages[i] === 'string' ? validatedMessages[i] : validatedMessages[i].message;
      await prisma.promoMessage.create({
        data: {
          message: msg,
          order: i + 1,
        },
      });
    }
    const updated = await prisma.promoMessage.findMany({ orderBy: { order: 'asc' } });
    return sendSuccess(res, 200, { messages: updated }, 'Promo messages updated');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deletePromoMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.promoMessage.delete({ where: { id: Number(id) } });
    return sendSuccess(res, 200, {}, 'Promo message deleted');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Orders Admin Operations ---
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 200, { orders }, 'Orders fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = z.object({ status: z.string().min(1, 'Status is required') }).parse(req.body);
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return sendSuccess(res, 200, { order }, 'Order status updated');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

// --- Discount Codes Admin CRUD ---
export const addDiscountCode = async (req, res) => {
  try {
    const validatedData = discountCodeSchema.parse(req.body);
    const discount = await prisma.discountCode.create({ data: validatedData });
    return sendSuccess(res, 201, { discount }, 'Discount code created');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const updateDiscountCode = async (req, res) => {
  try {
    const { code } = req.params;
    const validatedData = discountCodeSchema.partial().parse(req.body);
    const discount = await prisma.discountCode.update({
      where: { code },
      data: validatedData,
    });
    return sendSuccess(res, 200, { discount }, 'Discount code updated');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deleteDiscountCode = async (req, res) => {
  try {
    const { code } = req.params;
    await prisma.discountCode.delete({ where: { code } });
    return sendSuccess(res, 200, {}, 'Discount code deleted');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Store Settings Admin Update ---
export const updateStoreSettings = async (req, res) => {
  try {
    const validatedData = storeSettingsSchema.partial().parse(req.body);
    const settings = await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: validatedData,
      create: { id: 1, ...validatedData },
    });
    return sendSuccess(res, 200, { settings }, 'Store settings updated');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const verifyAdmin = async (req, res) => {
  return sendSuccess(res, 200, { valid: true, user: req.user }, 'Admin token verified');
};

