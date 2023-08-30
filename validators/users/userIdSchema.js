import Joi from 'joi';

const userIdSchema = Joi.object({ id: Joi.string().uuid().required() });

export default userIdSchema;
