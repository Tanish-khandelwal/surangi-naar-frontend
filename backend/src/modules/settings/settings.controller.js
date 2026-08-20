import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getStoreSettings = async (req, res) => {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.storeSettings.findFirst();
    }

    return sendSuccess(res, 200, { settings }, 'Store settings fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
