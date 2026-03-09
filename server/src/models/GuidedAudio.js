import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const guidedAudioSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        audioUrl: { type: String, required: true },
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        enrolledStudents: { type: Number, default: 0 },
        reviews: [reviewSchema],
        audioIncludes: [String],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const GuidedAudio = mongoose.model('GuidedAudio', guidedAudioSchema);

export default GuidedAudio;
