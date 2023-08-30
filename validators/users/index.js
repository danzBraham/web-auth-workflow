import { BadRequestError, NotFoundError } from '../../errors/index.js';
import userIdSchema from './userIdSchema.js';
import updateUserSchema from './updateUserSchema.js';
import updatePasswordSchema from './updatePasswordSchema.js';

export const validateUserId = async (payload) => {
  const { error } = await userIdSchema.validateAsync(payload);
  if (error) throw new NotFoundError(error.message);
};

export const validateUpdateUserPayload = async (payload) => {
  const { error } = await updateUserSchema.validateAsync(payload, { abortEarly: false });
  if (error) throw new BadRequestError(error.message);
};

export const validateUpdatePasswordPayload = async (payload) => {
  const { error } = await updatePasswordSchema.validateAsync(payload, { abortEarly: false });
  if (error) throw new BadRequestError(error.message);
};
