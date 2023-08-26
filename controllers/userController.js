import { StatusCodes } from 'http-status-codes';
import { attachCookiesToResponse } from '../utils/index.js';
import { BadRequestError, UnauthorizedError } from '../errors/index.js';
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
    message: 'success getting all users',
    data: rows,
  });
};

export const getSingleUser = async (req, res) => {
  res.send('Get Single User');
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
