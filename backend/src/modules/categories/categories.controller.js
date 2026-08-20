import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return sendSuccess(res, 200, { categories }, 'Categories fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
