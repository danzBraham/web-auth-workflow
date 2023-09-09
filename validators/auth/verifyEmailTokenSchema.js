import Joi from 'joi';

const verifyEmailTokenSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Please provide email address',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  verificationToken: Joi.string()
    .pattern(/^[0-9a-f]{80}$/)
    .required()
    .messages({
      'string.empty': 'Please provide verification token',
      'string.pattern.base': 'Verification token is not valid',
      'any.required': 'Verification token is required',
    }),
});

export default verifyEmailTokenSchema;
