import jwt from 'jsonwebtoken';

export const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
  return token;
};

export const verifyToken = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

export const attachCookiesToResponse = ({ res, userPayload, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { userPayload } });
  const refreshTokenJWT = createJWT({ payload: { userPayload, refreshToken } });

  const twoWeeks = 1000 * 60 * 60 * 24 * 14;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: 1000,
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + twoWeeks),
  });
};
