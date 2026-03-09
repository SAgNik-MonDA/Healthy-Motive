import Ebook from '../models/Ebook.js';

export const getEbooks = async (req, res, next) => {
    try {
        // Exclude soft-deleted ebooks from public listing
        const ebooks = await Ebook.find({ isDeleted: { $ne: true } });
        res.json(ebooks);
    } catch (error) {
        next(error);
    }
};

export const getEbookById = async (req, res, next) => {
    try {
        const ebook = await Ebook.findById(req.params.id);
        if (ebook) {
            res.json(ebook);
        } else {
            res.status(404);
            throw new Error('E-Book not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createEbook = async (req, res, next) => {
    try {
        const ebook = new Ebook({
            title: req.body.title || 'New E-Book',
            description: req.body.description || 'E-Book description',
            price: req.body.price || 0,
            imageUrl: req.body.imageUrl || '/images/sample-ebook.jpg',
            fileUrl: req.body.fileUrl || '/files/sample.pdf',
            formatIncludes: req.body.formatIncludes || [],
        });
        const createdEbook = await ebook.save();
        res.status(201).json(createdEbook);
    } catch (error) {
        next(error);
    }
};

export const updateEbook = async (req, res, next) => {
    try {
        const ebook = await Ebook.findById(req.params.id);
        if (ebook) {
            ebook.title = req.body.title || ebook.title;
            ebook.description = req.body.description || ebook.description;
            ebook.price = req.body.price !== undefined ? req.body.price : ebook.price;
            ebook.imageUrl = req.body.imageUrl || ebook.imageUrl;
            ebook.fileUrl = req.body.fileUrl || ebook.fileUrl;
            if (req.body.formatIncludes !== undefined) ebook.formatIncludes = req.body.formatIncludes;

            const updatedEbook = await ebook.save();
            res.json(updatedEbook);
        } else {
            res.status(404);
            throw new Error('E-Book not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteEbook = async (req, res, next) => {
    try {
        const ebook = await Ebook.findById(req.params.id);
        if (ebook) {
            // Soft delete — keeps access for users who already purchased it
            ebook.isDeleted = true;
            await ebook.save();
            res.json({ message: 'E-Book removed from public listing. Enrolled users retain access.' });
        } else {
            res.status(404);
            throw new Error('E-Book not found');
        }
    } catch (error) {
        next(error);
    }
};

export const enrollInEbook = async (req, res, next) => {
    try {
        const { paymentScreenshot } = req.body;
        const ebookId = req.params.id;

        if (!paymentScreenshot) {
            res.status(400);
            throw new Error('Payment screenshot is required.');
        }

        const ebook = await Ebook.findById(ebookId);
        if (!ebook) {
            res.status(404);
            throw new Error('Ebook not found');
        }

        const { default: EbookEnrollment } = await import('../models/EbookEnrollment.js');

        const enrollment = new EbookEnrollment({
            user: req.user._id,
            ebook: ebookId,
            paymentScreenshot,
            status: 'Approved',
        });

        await enrollment.save();

        if (!req.user.enrolledEbooks) req.user.enrolledEbooks = [];
        if (!req.user.enrolledEbooks.includes(ebook._id)) {
            req.user.enrolledEbooks.push(ebook._id);
            await req.user.save();
        }

        ebook.enrolledStudents = (ebook.enrolledStudents || 0) + 1;
        await ebook.save();

        res.status(201).json({
            message: 'Payment picture uploaded successfully.',
            enrollment,
        });
    } catch (error) {
        next(error);
    }
};

export const getEbookEnrollments = async (req, res, next) => {
    try {
        const { default: EbookEnrollment } = await import('../models/EbookEnrollment.js');
        const enrollments = await EbookEnrollment.find({}).populate('user', 'name lastName email').populate('ebook', 'title');
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

export const getMyEbooks = async (req, res, next) => {
    try {
        const { default: EbookEnrollment } = await import('../models/EbookEnrollment.js');
        const enrollments = await EbookEnrollment.find({ user: req.user._id })
            .populate('ebook')
            .sort({ createdAt: -1 });
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

export const createEbookReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        const ebook = await Ebook.findById(req.params.id);

        if (ebook) {
            const alreadyReviewed = ebook.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400);
                throw new Error('E-Book already reviewed');
            }

            const review = {
                name: `${req.user.name} ${req.user.lastName || ''}`.trim(),
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            ebook.reviews.push(review);

            ebook.numReviews = ebook.reviews.length;

            ebook.rating =
                ebook.reviews.reduce((acc, item) => item.rating + acc, 0) /
                ebook.reviews.length;

            await ebook.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404);
            throw new Error('E-Book not found');
        }
    } catch (error) {
        next(error);
    }
};
