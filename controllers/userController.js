import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import pool from '../db/connectDB.js';
import { attachCookiesToResponse, checkPermissions } from '../utils/index.js';
import { NotFoundError, AuthenticationError } from '../errors/index.js';
import {
  validateUpdateUserPayload,
  validateUpdatePasswordPayload,
} from '../validators/users/index.js';

export const getAllUsers = async (req, res) => {
  const query = {
    text: `SELECT user_id, username, email, role, created_at, updated_at
            FROM users
            WHERE role = $1`,
    values: ['user'],
  };
  const { rows } = await pool.query(query);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'successfully getting all users',
    data: rows,
  });
};

export const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;

  const query = {
    text: `SELECT user_id, username, email, role, created_at, updated_at
            FROM users
            WHERE user_id = $1
              AND role = $2`,
    values: [userId, 'user'],
  };
  const { rows, rowCount } = await pool.query(query);

  if (rowCount === 0) throw new NotFoundError('user not found');
  checkPermissions(req.user, userId);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'successfully getting user',
    data: rows[0],
  });
};

export const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req, res) => {
  await validateUpdateUserPayload(req.body);

  const { username, email } = req.body;
  const { userId, role } = req.user;

  const queryUpdate = {
    text: `UPDATE users
            SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $3`,
    values: [username, email, userId],
  };
  await pool.query(queryUpdate);

  const userPayload = { userId, username, role };
  attachCookiesToResponse({ res, userPayload });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'successfully update user',
    data: { ...userPayload },
  });
};

export const updateUserPassword = async (req, res) => {
  await validateUpdatePasswordPayload(req.body);

  // if (!oldPassword || !newPassword) throw new BadRequestError('Please provide both values');
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user;

  const queryPassword = {
    text: 'SELECT password FROM users WHERE user_id = $1',
    values: [userId],
  };
  const { rows } = await pool.query(queryPassword);

  const verifyPassword = await bcrypt.compare(oldPassword, rows[0].password);
  if (!verifyPassword) throw new AuthenticationError('Wrong password');

  const salt = await bcrypt.genSalt(10);
  const newHashedPassword = await bcrypt.hash(newPassword, salt);

  const queryUpdate = {
    text: 'UPDATE users SET password = $1 WHERE user_id = $2',
    values: [newHashedPassword, userId],
  };
  await pool.query(queryUpdate);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'successfully update password',
  });
};
