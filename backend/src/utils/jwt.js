import jwt from 'jsonwebtoken';

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET || 'surangi_naar_jwt_access_secret_key_2026_super_secure';
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || 'surangi_naar_jwt_refresh_secret_key_2026_super_secure';

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || 'customer',
      name: user.name,
    },
    getAccessSecret(),
    { expiresIn: '7d' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    getRefreshSecret(),
    { expiresIn: '30d' }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, getAccessSecret());
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshSecret());
};
