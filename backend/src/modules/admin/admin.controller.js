import bcrypt from 'bcryptjs';
import prisma from '../../config/db.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password, pin } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@suranginaar.com';

    let isAdminValid = false;

    // PIN fallback (matches frontend default '1234')
    if (pin === '1234') {
      isAdminValid = true;
    } else if (email && password) {
      // Check database admin user first
      const adminUser = await prisma.user.findUnique({ where: { email } });
      if (adminUser && adminUser.role === 'admin' && adminUser.passwordHash) {
        isAdminValid = await bcrypt.compare(password, adminUser.passwordHash);
      } else if (email === adminEmail && process.env.ADMIN_PASSWORD_HASH) {
        isAdminValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
      }
    }

    if (!isAdminValid) {
      return sendError(res, 401, 'Invalid admin credentials or PIN');
    }

    const payload = {
      id: 'admin-root-id',
      email: adminEmail,
      name: 'Admin User',
      role: 'admin',
    };

    const token = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return sendSuccess(res, 200, { token, refreshToken, user: payload }, 'Admin authenticated successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// --- Products Admin CRUD ---
export const createProduct = async (req, res) => {
  try {
    const product = await prisma.product.create({ data: req.body });
    return sendSuccess(res, 201, { product }, 'Product created successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, 200, { product }, 'Product updated successfully');
  } catch (error) {
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
    const category = await prisma.category.create({ data: req.body });
    return sendSuccess(res, 201, { category }, 'Category created successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, 200, { category }, 'Category updated successfully');
  } catch (error) {
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
    const count = await prisma.heroSlide.count();
    const slide = await prisma.heroSlide.create({
      data: {
        ...req.body,
        order: req.body.order || count + 1,
      },
    });
    return sendSuccess(res, 201, { slide }, 'Hero slide added successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const updateHeroSlides = async (req, res) => {
  try {
    const { slides } = req.body;
    if (Array.isArray(slides)) {
      for (const s of slides) {
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
    }
    const updated = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
    return sendSuccess(res, 200, { slides: updated }, 'Hero slides updated successfully');
  } catch (error) {
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
    const count = await prisma.promoMessage.count();
    const promo = await prisma.promoMessage.create({
      data: {
        message: req.body.message,
        order: count + 1,
      },
    });
    return sendSuccess(res, 201, { promo }, 'Promo message added');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const updatePromoMessages = async (req, res) => {
  try {
    const { messages } = req.body;
    if (Array.isArray(messages)) {
      await prisma.promoMessage.deleteMany({});
      for (let i = 0; i < messages.length; i++) {
        const msg = typeof messages[i] === 'string' ? messages[i] : messages[i].message;
        await prisma.promoMessage.create({
          data: {
            message: msg,
            order: i + 1,
          },
        });
      }
    }
    const updated = await prisma.promoMessage.findMany({ orderBy: { order: 'asc' } });
    return sendSuccess(res, 200, { messages: updated }, 'Promo messages updated');
  } catch (error) {
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
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return sendSuccess(res, 200, { order }, 'Order status updated');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Discount Codes Admin CRUD ---
export const addDiscountCode = async (req, res) => {
  try {
    const discount = await prisma.discountCode.create({ data: req.body });
    return sendSuccess(res, 201, { discount }, 'Discount code created');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const updateDiscountCode = async (req, res) => {
  try {
    const { code } = req.params;
    const discount = await prisma.discountCode.update({
      where: { code },
      data: req.body,
    });
    return sendSuccess(res, 200, { discount }, 'Discount code updated');
  } catch (error) {
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
    const settings = await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: req.body,
      create: { id: 1, ...req.body },
    });
    return sendSuccess(res, 200, { settings }, 'Store settings updated');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};
