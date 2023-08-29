import Joi from 'joi';

const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please provide old password',
      'any.required': 'Old password is required',
    }),
  newPassword: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{4,})/)
    .min(8)
    .required()
    .messages({
      'string.empty': 'Please provide new password',
      'string.pattern.base':
        'New password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
      'string.min': 'New password must be at least {#limit} characters long',
      'any.required': 'New password is required',
    }),
});

export default updatePasswordSchema;
