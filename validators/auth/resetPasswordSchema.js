import Joi from 'joi';

const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .pattern(/^[0-9a-f]{140}$/)
    .required()
    .messages({
      'string.empty': 'Please provide token',
      'string.pattern.base': 'Token is not valid',
      'any.required': 'Token is required',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Please provide email address',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{4,})/)
    .min(8)
    .required()
    .messages({
      'string.empty': 'Please provide password',
      'string.pattern.base':
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
      'string.min': 'Password must be at least {#limit} characters long',
      'any.required': 'Password is required',
    }),
});

export default resetPasswordSchema;
