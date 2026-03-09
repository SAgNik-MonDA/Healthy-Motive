import mongoose from 'mongoose';

const enrollmentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        },
        // Snapshot saved at purchase time — survives course deletion
        courseSnapshot: {
            title: { type: String },
            imageUrl: { type: String },
            description: { type: String },
        },
        paymentScreenshot: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
