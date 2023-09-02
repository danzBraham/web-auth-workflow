import { StatusCodes } from 'http-status-codes';
import { attachCookiesToResponse, hashPassword, verifyPassword } from '../utils/index.js';
import { AuthenticationError, BadRequestError } from '../errors/index.js';
import { validateRegisterPayload, validateLoginPayload } from '../validators/auth/index.js';
import pool from '../db/connectDB.js';

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
  const verificationToken = 'fake token';

  const query = {
    text: `INSERT INTO users (username, email, password, role, verification_token)
              VALUES ($1, $2, $3, $4, $5)`,
    values: [username, email, hashedPassword, role, verificationToken],
  };
  await pool.query(query);

  // Send verification token back only while testing in postman!!!
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Success! Please check your email to verify account',
    data: { verificationToken },
  });
};

export const login = async (req, res) => {
  await validateLoginPayload(req.body);

  const { email, password } = req.body;

  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };
  const { rows, rowCount } = await pool.query(query);

  if (rowCount === 0) throw new AuthenticationError('Invalid credentials');
  const { user_id: userId, username, password: hashedPassword, role } = rows[0];

  const isPasswordCorrect = await verifyPassword(password, hashedPassword);
  if (!isPasswordCorrect) throw new AuthenticationError('Invalid password');

  const userPayload = { userId, username, role };
  attachCookiesToResponse({ res, userPayload });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Successfully logged in',
    data: { ...userPayload },
  });
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Successfully logged out',
  });
};
