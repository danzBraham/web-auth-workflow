import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  googleAuth,
  logout,
  verifyEmailToken,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmailToken);
router.post('/login', login);
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/redirect', passport.authenticate('google'), googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.delete('/logout', authenticateUser, logout);

export default router;
