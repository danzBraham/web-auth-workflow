import { AuthenticationError, AuthorizationError } from '../errors/index.js';
import { verifyToken } from '../utils/jwt.js';

export const authenticateUser = async (req, res, next) => {
  const { token } = req.signedCookies;
  if (!token) throw new AuthenticationError('Authentication failed: Missing token');

  try {
    const { userId, username, role } = verifyToken({ token });
    req.user = { userId, username, role };
    next();
  } catch (error) {
    throw new AuthenticationError('Authentication failed: Invalid token');
  }
};

// eslint-disable-next-line arrow-body-style
export const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError('Unauthorized to access this route');
    }
    next();
  };
};
