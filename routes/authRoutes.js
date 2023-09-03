import express from 'express';
import { register, login, logout, verifyEmailToken } from '../controllers/authController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmailToken);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);

export default router;
