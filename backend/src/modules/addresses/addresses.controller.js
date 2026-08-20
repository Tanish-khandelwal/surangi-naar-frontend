import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await prisma.address.findMany({
      where: { userId },
    });
    return sendSuccess(res, 200, { addresses }, 'Addresses fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, street, city, state, pincode, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        street,
        city,
        state,
        pincode,
        isDefault: !!isDefault,
      },
    });

    return sendSuccess(res, 201, { address }, 'Address added successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { fullName, phone, street, city, state, pincode, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        fullName,
        phone,
        street,
        city,
        state,
        pincode,
        isDefault,
      },
    });

    return sendSuccess(res, 200, { address }, 'Address updated successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.address.delete({ where: { id } });
    return sendSuccess(res, 200, {}, 'Address deleted');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};
