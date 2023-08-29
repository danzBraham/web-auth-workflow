import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong try again later',
  };

  if (err.constraint === 'users_username_key') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = 'Username already in use';
  }

  if (err.constraint === 'users_email_key') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = 'Email already in use';
  }

  if (err.code === '22P02') {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = 'User not found';
  }

  customError.message = customError.message.replace(/"/g, '');
  return res.status(customError.statusCode).json({ status: 'fail', message: customError.message });
};

export default errorHandlerMiddleware;
