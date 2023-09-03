import Joi from 'joi';

const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Please provide email address',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
});

export default forgetPasswordSchema;
