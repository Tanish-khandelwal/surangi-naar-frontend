import { registerSchema, loginSchema, googleAuthSchema } from './auth.schema.js';
import * as authService from './auth.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);
    return sendSuccess(res, 201, result, 'User registered successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      return sendError(res, 400, 'Validation Error', error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);
    return sendSuccess(res, 200, result, 'Logged in successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      return sendError(res, 400, 'Validation Error', error.errors);
    }
    return sendError(res, 401, error.message);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = googleAuthSchema.parse(req.body);
    const result = await authService.googleAuth(credential);
    return sendSuccess(res, 200, result, 'Google login successful');
  } catch (error) {
    if (error.name === 'ZodError') {
      return sendError(res, 400, 'Validation Error', error.errors);
    }
    return sendError(res, 401, error.message);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
    if (!refreshToken) {
      return sendError(res, 400, 'Refresh token required');
    }
    const result = await authService.refreshTokens(refreshToken);
    return sendSuccess(res, 200, result, 'Token refreshed successfully');
  } catch (error) {
    return sendError(res, 401, error.message || 'Invalid refresh token');
  }
};

export const logout = async (req, res) => {
  return sendSuccess(res, 200, {}, 'Logged out successfully');
};

export const me = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, 200, { user }, 'User details fetched');
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};
