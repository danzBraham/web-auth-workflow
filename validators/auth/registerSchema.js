import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9_.]+$/)
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.empty': 'Please provide username',
      'string.pattern.base': 'Username can only contain letters, digits, underscores, and periods',
      'string.min': 'Username must be at least {#limit} characters long',
      'string.max': 'Username cannot exceed {#limit} characters',
      'any.required': 'Username is required',
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu'] } })
    .max(40)
    .required()
    .messages({
      'string.empty': 'Please provide email address',
      'string.email': 'Please enter a valid email address',
      'string.max': 'Email cannot exceed {#limit} characters',
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

export default registerSchema;
