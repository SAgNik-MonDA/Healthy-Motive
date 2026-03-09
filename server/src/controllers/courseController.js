import Course from '../models/Course.js';

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
    try {
        // Exclude soft-deleted courses from public listing
        const courses = await Course.find({ isDeleted: { $ne: true } });
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            res.json(course);
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res, next) => {
    try {
        const { title, description, price, imageUrl, benefits, rating, numReviews, enrolledStudents, courseIncludes } = req.body;
        const course = new Course({
            title: title || 'New Course',
            description: description || 'Course description',
            price: price || 0,
            imageUrl: imageUrl || '/images/sample.jpg',
            benefits: benefits || [],
            courseIncludes: courseIncludes || [],
            rating: rating || 0,
            numReviews: numReviews || 0,
            enrolledStudents: enrolledStudents || 0,
        });
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res, next) => {
    try {
        const { title, description, price, imageUrl, benefits, rating, numReviews, enrolledStudents, courseIncludes } = req.body;
        const course = await Course.findById(req.params.id);

        if (course) {
            course.title = title || course.title;
            course.description = description || course.description;
            course.price = price !== undefined ? price : course.price;
            course.imageUrl = imageUrl || course.imageUrl;
            course.benefits = benefits || course.benefits;
            course.courseIncludes = courseIncludes || course.courseIncludes;
            course.rating = rating !== undefined ? rating : course.rating;
            course.numReviews = numReviews !== undefined ? numReviews : course.numReviews;
            course.enrolledStudents = enrolledStudents !== undefined ? enrolledStudents : course.enrolledStudents;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            // Soft delete — keeps enrollment access for existing students
            course.isDeleted = true;
            await course.save();
            res.json({ message: 'Course removed from public listing. Enrolled students retain access.' });
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create new review
// @route   POST /api/courses/:id/reviews
// @access  Private
const createCourseReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        const course = await Course.findById(req.params.id);

        if (course) {
            const alreadyReviewed = course.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400);
                throw new Error('Course already reviewed');
            }

            const review = {
                name: `${req.user.name} ${req.user.lastName || ''}`.trim(),
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            course.reviews.push(review);

            course.numReviews = course.reviews.length;

            course.rating =
                course.reviews.reduce((acc, item) => item.rating + acc, 0) /
                course.reviews.length;

            await course.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollInCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        const user = req.user;
        const { paymentScreenshot } = req.body;

        if (!paymentScreenshot) {
            res.status(400);
            throw new Error('Payment screenshot is required to enroll');
        }

        if (course) {
            // Create Enrollment Record with snapshot of course data at purchase time
            const { default: Enrollment } = await import('../models/Enrollment.js');
            await Enrollment.create({
                user: user._id,
                course: course._id,
                courseSnapshot: {
                    title: course.title,
                    imageUrl: course.imageUrl || '',
                    description: course.description || '',
                },
                paymentScreenshot,
                status: 'Approved' // Setting to approved as per auto-enroll request, or 'Pending' if we don't grant access yet.
            });

            // Add course to user if not already there
            if (!user.enrolledCourses) user.enrolledCourses = [];
            if (!user.enrolledCourses.includes(course._id)) {
                user.enrolledCourses.push(course._id);
            }
            await user.save();

            // Increment course enrolled count
            course.enrolledStudents = (course.enrolledStudents || 0) + 1;
            await course.save();

            res.status(200).json({ message: 'Successfully enrolled. Payment under review.' });
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all enrollments
// @route   GET /api/courses/enrollments/all
// @access  Private/Admin
const getEnrollments = async (req, res, next) => {
    try {
        const { default: Enrollment } = await import('../models/Enrollment.js');
        const enrollments = await Enrollment.find({}).populate('user', 'name lastName email').populate('course', 'title');
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user's enrolled courses
// @route   GET /api/courses/my-courses
// @access  Private
const getMyCourses = async (req, res, next) => {
    try {
        const { default: Enrollment } = await import('../models/Enrollment.js');
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate('course')
            .sort({ createdAt: -1 });
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

export { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, createCourseReview, enrollInCourse, getEnrollments, getMyCourses };
