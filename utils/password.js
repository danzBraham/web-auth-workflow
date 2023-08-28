import bcrypt from 'bcryptjs';
import { AuthenticationError } from '../errors/index.js';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password, hashedPassword) => {
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  if (!isPasswordCorrect) throw new AuthenticationError('Invalid password');
  return isPasswordCorrect;
};
