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
router.route('/:id').get(authenticateUser, getSingleUser);

export default router;
