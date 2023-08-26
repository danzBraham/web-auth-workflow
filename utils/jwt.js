import jwt from 'jsonwebtoken';

export const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
  return token;
};

export const verifyToken = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

export const attachCookiesToResponse = ({ res, userPayload }) => {
  const token = createJWT({ payload: userPayload });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};
