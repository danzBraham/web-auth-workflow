import { AuthorizationError } from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId) return;
  throw new AuthorizationError('Not authorized to access this route');
};

export default checkPermissions;
