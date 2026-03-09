import express from 'express';
import { getFreeResources, getFreeResourceById, createFreeResource, updateFreeResource, deleteFreeResource, downloadFreeResource, createFreeResourceReview, getFreeResourceEnrollments, getMyFreeResources } from '../controllers/freeResourceController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/enrollments/all').get(protect, isAdmin, getFreeResourceEnrollments);
router.route('/my-resources').get(protect, getMyFreeResources);
router.route('/').get(getFreeResources).post(protect, isAdmin, createFreeResource);
router.route('/:id').get(getFreeResourceById).put(protect, isAdmin, updateFreeResource).delete(protect, isAdmin, deleteFreeResource);
router.route('/:id/download').post(protect, downloadFreeResource);
router.route('/:id/reviews').post(protect, createFreeResourceReview);

export default router;
