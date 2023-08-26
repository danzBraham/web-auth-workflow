import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  if (err.constraint === 'users_username_key') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = 'username already in use';
  }

  if (err.constraint === 'users_email_key') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = 'email already in use';
  }

  return res.status(customError.statusCode).json({ status: 'fail', message: customError.msg });
};

export default errorHandlerMiddleware;
