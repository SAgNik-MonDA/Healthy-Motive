import express from 'express';
import { authUser, registerUser, updateUserProfile, authGoogle, getUsers, promoteUser, demoteUser } from '../controllers/userController.js';
import { protect, admin, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/promote/:id').put(protect, isAdmin, promoteUser);
router.route('/demote/:id').put(protect, isAdmin, demoteUser);

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', authGoogle);
router.put('/profile', protect, updateUserProfile);

export default router;
