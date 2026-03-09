import express from 'express';
import { getGuidedAudios, getGuidedAudioById, createGuidedAudio, updateGuidedAudio, deleteGuidedAudio, createGuidedAudioReview, purchaseGuidedAudio, getMyGuidedAudios, getGuidedAudioEnrollments } from '../controllers/guidedAudioController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/enrollments/all').get(protect, isAdmin, getGuidedAudioEnrollments);
router.route('/my-audios').get(protect, getMyGuidedAudios);
router.route('/').get(getGuidedAudios).post(protect, isAdmin, createGuidedAudio);
router.route('/:id').get(getGuidedAudioById).put(protect, isAdmin, updateGuidedAudio).delete(protect, isAdmin, deleteGuidedAudio);
router.route('/:id/reviews').post(protect, createGuidedAudioReview);
router.route('/:id/purchase').post(protect, purchaseGuidedAudio);

export default router;
