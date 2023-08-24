import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/index.js';

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication invalid');
  }

  const token = authorization.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === '64dd9132dab803627af2d7d1';
    req.user = { userId: payload.userId, name: payload.name, testUser };
    next();
  } catch (error) {
    throw new UnauthorizedError('Authentication invalid');
  }
};

export default auth;
