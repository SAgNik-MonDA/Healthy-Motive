import mongoose from 'mongoose';

const guidedAudioEnrollmentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        guidedAudio: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'GuidedAudio',
        },
        paymentScreenshot: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Approved',
        },
    },
    {
        timestamps: true,
    }
);

const GuidedAudioEnrollment = mongoose.model('GuidedAudioEnrollment', guidedAudioEnrollmentSchema);

export default GuidedAudioEnrollment;
