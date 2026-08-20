import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getProducts = async (req, res) => {
  try {
    const { categorySlug, minPrice, maxPrice, size, search, page = 1, limit = 50 } = req.query;

    const where = {};

    if (categorySlug && categorySlug !== 'all') {
      where.categorySlug = categorySlug;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (size) {
      where.sizes = {
        has: size,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fabric: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return sendSuccess(res, 200, {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    }, 'Products fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    return sendSuccess(res, 200, { product }, 'Product details fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
