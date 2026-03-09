import FreeResource from '../models/FreeResource.js';

export const getFreeResources = async (req, res, next) => {
    try {
        const resources = await FreeResource.find({ isDeleted: { $ne: true } });
        res.json(resources);
    } catch (error) { next(error); }
};

export const getFreeResourceById = async (req, res, next) => {
    try {
        const resource = await FreeResource.findById(req.params.id);
        if (resource) { res.json(resource); }
        else { res.status(404); throw new Error('Free Resource not found'); }
    } catch (error) { next(error); }
};

export const createFreeResource = async (req, res, next) => {
    try {
        const resource = new FreeResource({
            title: req.body.title || 'New Resource',
            description: req.body.description || 'Resource description',
            imageUrl: req.body.imageUrl || '/images/sample-resource.jpg',
            fileUrl: req.body.fileUrl || '/files/sample.pdf',
        });
        const createdResource = await resource.save();
        res.status(201).json(createdResource);
    } catch (error) { next(error); }
};

export const updateFreeResource = async (req, res, next) => {
    try {
        const resource = await FreeResource.findById(req.params.id);
        if (resource) {
            resource.title = req.body.title || resource.title;
            resource.description = req.body.description || resource.description;
            resource.imageUrl = req.body.imageUrl || resource.imageUrl;
            resource.fileUrl = req.body.fileUrl || resource.fileUrl;
            const updatedResource = await resource.save();
            res.json(updatedResource);
        } else {
            res.status(404);
            throw new Error('Free Resource not found');
        }
    } catch (error) { next(error); }
};

export const deleteFreeResource = async (req, res, next) => {
    try {
        const resource = await FreeResource.findById(req.params.id);
        if (resource) {
            resource.isDeleted = true;
            await resource.save();
            res.json({ message: 'Free Resource removed from public listing.' });
        } else {
            res.status(404);
            throw new Error('Free Resource not found');
        }
    } catch (error) { next(error); }
};

export const downloadFreeResource = async (req, res, next) => {
    try {
        const resource = await FreeResource.findById(req.params.id);
        if (!resource) { res.status(404); throw new Error('Free Resource not found'); }

        const { default: FreeResourceEnrollment } = await import('../models/FreeResourceEnrollment.js');

        // Record download (allow duplicate downloads)
        await FreeResourceEnrollment.create({ user: req.user._id, freeResource: resource._id });

        // Increment enrolled/download count
        resource.enrolledStudents = (resource.enrolledStudents || 0) + 1;
        await resource.save();

        res.json({ fileUrl: resource.fileUrl, message: 'Download recorded.' });
    } catch (error) { next(error); }
};

export const createFreeResourceReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const resource = await FreeResource.findById(req.params.id);
        if (!resource) { res.status(404); throw new Error('Free Resource not found'); }

        const alreadyReviewed = resource.reviews.find(r => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) { res.status(400); throw new Error('You have already reviewed this resource'); }

        resource.reviews.push({ name: req.user.name, rating: Number(rating), comment, user: req.user._id });
        resource.numReviews = resource.reviews.length;
        resource.rating = resource.reviews.reduce((acc, r) => acc + r.rating, 0) / resource.reviews.length;
        await resource.save();
        res.status(201).json({ message: 'Review added' });
    } catch (error) { next(error); }
};

export const getFreeResourceEnrollments = async (req, res, next) => {
    try {
        const { default: FreeResourceEnrollment } = await import('../models/FreeResourceEnrollment.js');
        const enrollments = await FreeResourceEnrollment.find({})
            .populate('user', 'name lastName email')
            .populate('freeResource', 'title')
            .sort({ createdAt: -1 });
        res.json(enrollments);
    } catch (error) { next(error); }
};

export const getMyFreeResources = async (req, res, next) => {
    try {
        const { default: FreeResourceEnrollment } = await import('../models/FreeResourceEnrollment.js');
        const enrollments = await FreeResourceEnrollment.find({ user: req.user._id })
            .populate('freeResource')
            .sort({ createdAt: -1 });
        res.json(enrollments);
    } catch (error) { next(error); }
};
