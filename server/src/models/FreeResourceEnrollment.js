import mongoose from 'mongoose';

const freeResourceEnrollmentSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        freeResource: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'FreeResource' },
        status: { type: String, enum: ['Downloaded'], default: 'Downloaded' },
    },
    { timestamps: true }
);

const FreeResourceEnrollment = mongoose.model('FreeResourceEnrollment', freeResourceEnrollmentSchema);
export default FreeResourceEnrollment;
