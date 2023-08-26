import { StatusCodes } from 'http-status-codes';
import { attachCookiesToResponse } from '../utils/index.js';
import { NotFoundError } from '../errors/index.js';
import pool from '../db/connectDB.js';

export const getAllUsers = async (req, res) => {
  const query = {
    text: `SELECT user_id, username, email, role, created_at, updated_at
            FROM users
            WHERE role = $1`,
    values: ['user'],
  };
  const { rows } = await pool.query(query);

  res.json({
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

  res.json({
    status: 'success',
    message: 'successfully getting user',
    data: rows[0],
  });
};

export const showCurrentUser = async (req, res) => {
  res.send('Show Current User');
};

export const updateUser = async (req, res) => {
  res.send('Update User');
};

export const updateUserPassword = async (req, res) => {
  res.send('Update User Password');
};
