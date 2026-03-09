import mongoose from 'mongoose';

const ebookEnrollmentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        ebook: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Ebook',
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

const EbookEnrollment = mongoose.model('EbookEnrollment', ebookEnrollmentSchema);

export default EbookEnrollment;
