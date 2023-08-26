import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { attachCookiesToResponse } from '../utils/index.js';
import { BadRequestError, UnauthorizedError } from '../errors/index.js';
import pool from '../db/connectDB.js';

const isFirstAccount = async () => {
  const { rowCount } = await pool.query('SELECT * FROM users');
  return rowCount === 0;
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const role = (await isFirstAccount()) ? 'admin' : 'user';

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const query = {
    text: `INSERT INTO users (username, email, password, role)
              VALUES ($1, $2, $3, $4)
              RETURNING user_id`,
    values: [username, email, hashedPassword, role],
  };
  const { rows } = await pool.query(query);

  const userPayload = { userId: rows[0].user_id, username, role };
  attachCookiesToResponse({ res, userPayload });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'success adding user',
    data: { ...userPayload },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new BadRequestError('Please provide email and password');

  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };
  const { rows, rowCount } = await pool.query(query);

  if (rowCount === 0) throw new UnauthorizedError('Invalid credentials');
  const { user_id: userId, username, password: hashedPassword, role } = rows[0];

  const checkPassword = await bcrypt.compare(password, hashedPassword);
  if (!checkPassword) throw new UnauthorizedError('Invalid password');

  const userPayload = { userId, username, role };
  attachCookiesToResponse({ res, userPayload });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'successfully logged in',
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
    message: 'successfully logged out',
  });
};
