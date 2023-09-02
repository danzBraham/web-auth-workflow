import express from 'express';
import { register, login, logout, verifyEmailToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/verifyEmail', verifyEmailToken);
router.post('/login', login);
router.get('/logout', logout);

export default router;
