import express from 'express';
import { getEbooks, getEbookById, createEbook, updateEbook, deleteEbook, enrollInEbook, getEbookEnrollments, getMyEbooks, createEbookReview } from '../controllers/ebookController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/enrollments/all').get(protect, isAdmin, getEbookEnrollments);
router.route('/my-ebooks').get(protect, getMyEbooks);

router.route('/').get(getEbooks).post(protect, isAdmin, createEbook);
router.route('/:id').get(getEbookById).put(protect, isAdmin, updateEbook).delete(protect, isAdmin, deleteEbook);
router.route('/:id/enroll').post(protect, enrollInEbook);
router.route('/:id/reviews').post(protect, createEbookReview);

export default router;
