import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { attachCookiesToResponse } from '../utils/index.js';
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
  res.send('ok');
};

export const logout = async (req, res) => {
  res.send('logout user');
};
