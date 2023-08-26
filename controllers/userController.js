import pool from '../db/connectDB.js';

export const getAllUsers = async (req, res) => {
  res.send('Get All Users');
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
