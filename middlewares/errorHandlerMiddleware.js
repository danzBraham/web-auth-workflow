import { StatusCodes } from 'http-status-codes';

const errorHandler = (err, req, res) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }

  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.msg = `No job with ID ${err.value}`;
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `${err.keyValue.email} is already in use. Please choose a different email address.`;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandler;
