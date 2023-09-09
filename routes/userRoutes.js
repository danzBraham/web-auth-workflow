import express from 'express';
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from '../controllers/userController.js';
import { authenticateUser, authorizePermission } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(authenticateUser, authorizePermission('admin'), getAllUsers);
router.route('/show-me').get(authenticateUser, showCurrentUser);
router.route('/update-user').patch(authenticateUser, updateUser);
router.route('/update-user-password').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);

export default router;
