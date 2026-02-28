import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Simple string representation for now, or ObjectId if you implement users
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
    code: { type: String, required: true },
    language: { type: String, required: true },
    verdict: {
        type: String,
        enum: ['Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
        default: 'Pending'
    },
    timeTaken: { type: Number }, // Execution time in ms
    timestamp: { type: Date, default: Date.now }
});

export const Submission = mongoose.model('Submission', submissionSchema);
