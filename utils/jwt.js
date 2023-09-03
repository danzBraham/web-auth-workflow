import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../errors/index.js';

export const createJWT = ({ payload }) => jwt.sign(payload, process.env.JWT_SECRET);

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError('Authentication failed: Invalid token');
  }
};

export const attachCookiesToResponse = ({ res, userPayload, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { ...userPayload } });
  const refreshTokenJWT = createJWT({ payload: { ...userPayload, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneMonth),
  });
};
