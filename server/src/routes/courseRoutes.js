import express from 'express';
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, createCourseReview, enrollInCourse, getEnrollments, getMyCourses } from '../controllers/courseController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/enrollments/all').get(protect, isAdmin, getEnrollments);
router.route('/my-courses').get(protect, getMyCourses);

router.route('/').get(getCourses).post(protect, isAdmin, createCourse);
router.route('/:id').get(getCourseById).put(protect, isAdmin, updateCourse).delete(protect, isAdmin, deleteCourse);
router.route('/:id/reviews').post(protect, createCourseReview);
router.route('/:id/enroll').post(protect, enrollInCourse);

export default router;
