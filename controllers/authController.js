import { StatusCodes } from 'http-status-codes';
import { AuthenticationError, BadRequestError } from '../errors/index.js';
import pool from '../db/connectDB.js';
import {
  validateRegisterPayload,
  validateLoginPayload,
  validateForgetPasswordPayload,
} from '../validators/auth/index.js';
import {
  attachCookiesToResponse,
  hashPassword,
  verifyPassword,
  sendVerificationEmail,
  sendResetPasswordEmail,
} from '../utils/index.js';

const crypto = await import('node:crypto');

const isFirstAccount = async () => {
  const { rowCount } = await pool.query('SELECT * FROM users');
  return rowCount === 0;
};

const verifyUsername = async (username) => {
  const query = {
    text: 'SELECT username from users WHERE username = $1',
    values: [username],
  };
  const { rowCount } = await pool.query(query);

  if (rowCount > 0) throw new BadRequestError('Username already in use');
};

const verifyEmail = async (email) => {
  const query = {
    text: 'SELECT email from users WHERE email = $1',
    values: [email],
  };
  const { rowCount } = await pool.query(query);

  if (rowCount > 0) throw new BadRequestError('Email already in use');
};

export const register = async (req, res) => {
  await validateRegisterPayload(req.body);

  const { username, email, password } = req.body;
  await verifyUsername(username);
  await verifyEmail(email);

  const role = (await isFirstAccount()) ? 'admin' : 'user';
  const hashedPassword = await hashPassword(password);
  const verificationToken = crypto.randomBytes(40).toString('hex');

  const query = {
    text: `INSERT INTO users (username, email, password, role, verification_token)
              VALUES ($1, $2, $3, $4, $5)`,
    values: [username, email, hashedPassword, role, verificationToken],
  };
  await pool.query(query);

  // origin is front-end app url or domain
  // http://localhost:3000 just for testing
  const origin = 'http://localhost:3000';
  await sendVerificationEmail({
    name: username,
    email,
    verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Success! Please check your email to verify account',
  });
};

export const verifyEmailToken = async (req, res) => {
  const { email, verificationToken } = req.body;

  const queryEmail = {
    text: 'SELECT verification_token FROM users WHERE email = $1',
    values: [email],
  };
  const { rows, rowCount } = await pool.query(queryEmail);

  if (rowCount === 0) throw new AuthenticationError('Verification failed');
  if (rows[0].verification_token !== verificationToken) {
    throw new AuthenticationError('Verification failed');
  }

  const queryUpdate = {
    text: `UPDATE users
            SET is_verified = TRUE,
              verification_token = '',
              verified = CURRENT_TIMESTAMP
            WHERE email = $1`,
    values: [email],
  };
  await pool.query(queryUpdate);

  res.status(StatusCodes.OK).json({ status: 'success', message: 'Email verified' });
};

export const login = async (req, res) => {
  await validateLoginPayload(req.body);

  const { email, password } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };
    const { rows, rowCount } = await client.query(query);

    if (rowCount === 0) throw new AuthenticationError('Invalid credentials');
    const {
      user_id: userId,
      username,
      password: hashedPassword,
      role,
      is_verified: isVerified,
    } = rows[0];

    const isPasswordCorrect = await verifyPassword(password, hashedPassword);
    if (!isPasswordCorrect) throw new AuthenticationError('Invalid password');
    if (!isVerified) throw new AuthenticationError('Please verify your email');

    const userPayload = { userId, username, role };

    const queryRefreshToken = {
      text: `SELECT refresh_token, is_valid FROM tokens
            WHERE user_id = $1 FOR UPDATE`,
      values: [userId],
    };
    const { rows: rowsToken, rowCount: rowCountToken } = await client.query(queryRefreshToken);

    let refreshToken = '';

    if (rowCountToken !== 0) {
      const { refresh_token: refreshTokenDb, is_valid: isValid } = rowsToken[0];
      if (!isValid) throw new AuthenticationError('Please verify your email');
      refreshToken = refreshTokenDb;
    } else {
      refreshToken = crypto.randomBytes(40).toString('hex');
      const userAgent = req.headers['user-agent'];
      const { ip } = req;

      const queryToken = {
        text: `INSERT INTO tokens (user_id, refresh_token, ip, user_agent)
              VALUES ($1, $2, $3, $4)`,
        values: [userId, refreshToken, ip, userAgent],
      };
      await client.query(queryToken);
    }

    await client.query('COMMIT');
    attachCookiesToResponse({ res, userPayload, refreshToken });

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Successfully logged in',
      data: { ...userPayload },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const forgotPassword = async (req, res) => {
  await validateForgetPasswordPayload(req.body);

  const { email } = req.body;

  const query = {
    text: 'SELECT user_id, username FROM users WHERE email = $1',
    values: [email],
  };
  const { rows, rowCount } = await pool.query(query);

  if (rowCount === 1) {
    const { user_id: userId, username } = rows[0];
    const passwordToken = crypto.randomBytes(70).toString('hex');

    // origin is front-end app url or domain
    // http://localhost:3000 just for testing
    const origin = 'http://localhost:3000';
    await sendResetPasswordEmail({
      name: username,
      email,
      token: passwordToken,
      origin,
    });

    const queryUpdate = {
      text: `UPDATE users
              SET password_token = $1,
                password_token_expiration_date = CURRENT_TIMESTAMP + INTERVAL '10 minutes'
              WHERE user_id = $2`,
      values: [passwordToken, userId],
    };
    await pool.query(queryUpdate);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Please check your email for reset password link',
  });
};

export const resetPassword = async (req, res) => {
  res.send('reset password');
};

export const logout = async (req, res) => {
  const query = {
    text: 'DELETE FROM tokens WHERE user_id = $1',
    values: [req.user.userId],
  };
  await pool.query(query);

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Successfully logged out',
  });
};
