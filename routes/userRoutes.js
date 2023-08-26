import express from 'express';
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/:id').get(getSingleUser);

export default router;
