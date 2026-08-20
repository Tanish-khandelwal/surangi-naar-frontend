import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getHeroSlides = async (req, res) => {
  try {
    const heroSlides = await prisma.heroSlide.findMany({
      orderBy: { order: 'asc' },
    });
    return sendSuccess(res, 200, { heroSlides }, 'Hero slides fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
