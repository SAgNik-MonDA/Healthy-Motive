import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    },
    { timestamps: true }
);

const freeResourceSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        fileUrl: { type: String, required: true },
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        enrolledStudents: { type: Number, default: 0 },
        reviews: [reviewSchema],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const FreeResource = mongoose.model('FreeResource', freeResourceSchema);
export default FreeResource;
