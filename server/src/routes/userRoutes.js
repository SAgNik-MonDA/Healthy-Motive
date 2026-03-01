import express from 'express';
import { authUser, registerUser, updateUserProfile, authGoogle } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', authGoogle);
router.put('/profile', protect, updateUserProfile);

export default router;
