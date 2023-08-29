import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Please provide email address',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please provide password',
      'any.required': 'Password is required',
    }),
});

export default loginSchema;
