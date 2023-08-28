import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { BadRequestError, NotFoundError, AuthenticationError } from '../errors/index.js';
import pool from '../db/connectDB.js';

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
  res.send('Update User');
};

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) throw new BadRequestError('Please provide both values');

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
