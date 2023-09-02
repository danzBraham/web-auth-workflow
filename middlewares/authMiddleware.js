import { AuthenticationError, AuthorizationError } from '../errors/index.js';
import { verifyToken, attachCookiesToResponse } from '../utils/index.js';
import pool from '../db/connectDB.js';

export const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const { userId, username, role } = verifyToken(accessToken);
      req.user = { userId, username, role };
    } else if (refreshToken) {
      const {
        userId,
        username,
        role,
        refreshToken: payloadRefreshToken,
      } = verifyToken(refreshToken);

      const query = {
        text: `SELECT is_valid FROM tokens
                WHERE user_id = $1 AND refresh_token = $2`,
        values: [userId, payloadRefreshToken],
      };
      const { rows } = await pool.query(query);
      const tokenExist = rows[0];

      if (!tokenExist || !tokenExist?.is_valid) {
        throw new AuthenticationError('Authentication failed: Invalid token');
      }

      const userPayload = { userId, username, role };
      attachCookiesToResponse({ res, userPayload, refreshToken: payloadRefreshToken });
      req.user = userPayload;
    } else {
      throw new AuthenticationError('Authentication failed: No token provided');
    }

    next();
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};

export const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError('Unauthorized to access this route');
    }
    next();
  };
};
