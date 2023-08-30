import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong try again later',
  };

  if (err.details && err.details[0].context.label === 'id') {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = 'User not found';
  }

  customError.message = customError.message.replace(/"/g, '');
  return res.status(customError.statusCode).json({ status: 'fail', message: customError.message });
};

export default errorHandlerMiddleware;
