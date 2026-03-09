import GuidedAudio from '../models/GuidedAudio.js';

export const getGuidedAudios = async (req, res, next) => {
    try {
        const audios = await GuidedAudio.find({ isDeleted: { $ne: true } });
        res.json(audios);
    } catch (error) {
        next(error);
    }
};

export const getGuidedAudioById = async (req, res, next) => {
    try {
        const audio = await GuidedAudio.findById(req.params.id);
        if (audio) {
            res.json(audio);
        } else {
            res.status(404);
            throw new Error('Guided Audio not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createGuidedAudio = async (req, res, next) => {
    try {
        const audio = new GuidedAudio({
            title: req.body.title || 'New Audio',
            description: req.body.description || 'Audio description',
            price: req.body.price || 0,
            imageUrl: req.body.imageUrl || '/images/sample-audio.jpg',
            audioUrl: req.body.audioUrl || '/files/sample.mp3',
            audioIncludes: req.body.audioIncludes || [],
        });
        const createdAudio = await audio.save();
        res.status(201).json(createdAudio);
    } catch (error) {
        next(error);
    }
};

export const updateGuidedAudio = async (req, res, next) => {
    try {
        const audio = await GuidedAudio.findById(req.params.id);
        if (audio) {
            audio.title = req.body.title || audio.title;
            audio.description = req.body.description || audio.description;
            audio.price = req.body.price !== undefined ? req.body.price : audio.price;
            audio.imageUrl = req.body.imageUrl || audio.imageUrl;
            audio.audioUrl = req.body.audioUrl || audio.audioUrl;
            if (req.body.audioIncludes !== undefined) audio.audioIncludes = req.body.audioIncludes;

            const updatedAudio = await audio.save();
            res.json(updatedAudio);
        } else {
            res.status(404);
            throw new Error('Guided Audio not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteGuidedAudio = async (req, res, next) => {
    try {
        const audio = await GuidedAudio.findById(req.params.id);
        if (audio) {
            // Soft delete — enrolled users retain access
            audio.isDeleted = true;
            await audio.save();
            res.json({ message: 'Guided Audio removed from public listing. Enrolled users retain access.' });
        } else {
            res.status(404);
            throw new Error('Guided Audio not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createGuidedAudioReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const audio = await GuidedAudio.findById(req.params.id);
        if (!audio) {
            res.status(404);
            throw new Error('Guided Audio not found');
        }
        const alreadyReviewed = audio.reviews.find(r => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('You have already reviewed this audio');
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        audio.reviews.push(review);
        audio.numReviews = audio.reviews.length;
        audio.rating = audio.reviews.reduce((acc, r) => acc + r.rating, 0) / audio.reviews.length;
        await audio.save();
        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        next(error);
    }
};

export const purchaseGuidedAudio = async (req, res, next) => {
    try {
        const { paymentScreenshot } = req.body;
        const audioId = req.params.id;

        if (!paymentScreenshot) {
            res.status(400);
            throw new Error('Payment screenshot is required.');
        }

        const audio = await GuidedAudio.findById(audioId);
        if (!audio) {
            res.status(404);
            throw new Error('Guided Audio not found');
        }

        const { default: GuidedAudioEnrollment } = await import('../models/GuidedAudioEnrollment.js');

        const enrollment = new GuidedAudioEnrollment({
            user: req.user._id,
            guidedAudio: audioId,
            paymentScreenshot,
            status: 'Approved',
        });
        await enrollment.save();

        // Increment enrolled students count
        audio.enrolledStudents = (audio.enrolledStudents || 0) + 1;
        await audio.save();

        res.status(201).json({
            message: 'Payment submitted successfully. Access granted.',
            enrollment,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyGuidedAudios = async (req, res, next) => {
    try {
        const { default: GuidedAudioEnrollment } = await import('../models/GuidedAudioEnrollment.js');
        const enrollments = await GuidedAudioEnrollment.find({ user: req.user._id })
            .populate('guidedAudio')
            .sort({ createdAt: -1 });
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

export const getGuidedAudioEnrollments = async (req, res, next) => {
    try {
        const { default: GuidedAudioEnrollment } = await import('../models/GuidedAudioEnrollment.js');
        const enrollments = await GuidedAudioEnrollment.find({})
            .populate('user', 'name lastName email')
            .populate('guidedAudio', 'title')
            .sort({ createdAt: -1 });
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};
