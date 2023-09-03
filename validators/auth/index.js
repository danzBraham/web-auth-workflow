import { BadRequestError } from '../../errors/index.js';
import registerSchema from './registerSchema.js';
import loginSchema from './loginSchema.js';
import forgetPasswordSchema from './forgetPasswordSchema.js';
import resetPasswordSchema from './resetPasswordSchema.js';

export const validateRegisterPayload = async (payload) => {
  const { error } = await registerSchema.validateAsync(payload, { abortEarly: false });
  if (error) throw new BadRequestError(error.message);
};

export const validateLoginPayload = async (payload) => {
  const { error } = await loginSchema.validateAsync(payload, { abortEarly: false });
  if (error) throw new BadRequestError(error.message);
};

export const validateForgetPasswordPayload = async (payload) => {
  const { error } = await forgetPasswordSchema.validateAsync(payload, { abortEarly: false });
  if (error) throw new BadRequestError(error.message);
};

export const validateResetPasswordPayload = async (payload) => {
  const { error } = await resetPasswordSchema.validateAsync(payload, { abortEarly: false });
  if (error) throw new BadRequestError(error.message);
};
