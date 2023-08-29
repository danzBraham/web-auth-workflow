import Joi from 'joi';

const updateUserSchema = Joi.object({
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
});

export default updateUserSchema;
