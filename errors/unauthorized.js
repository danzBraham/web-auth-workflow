import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customError.js';

export default class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
