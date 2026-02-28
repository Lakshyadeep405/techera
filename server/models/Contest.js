import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'ended'],
        default: 'upcoming'
    }
}, { timestamps: true });

// Pre-validate hook to calculate status based on current time
contestSchema.pre('validate', function () {
    const now = new Date();
    if (now < this.startTime) {
        this.status = 'upcoming';
    } else if (now >= this.startTime && now <= this.endTime) {
        this.status = 'live';
    } else {
        this.status = 'ended';
    }
});

export const Contest = mongoose.model('Contest', contestSchema);
