import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    inputFormat: { type: String, required: true },
    outputFormat: { type: String, required: true },
    testCases: [{
        input: { type: String, required: true },
        output: { type: String, required: true },
        isHidden: { type: Boolean, default: false }
    }],
    timeLimit: { type: Number, default: 2000 }, // Time limit in milliseconds
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }
}, { timestamps: true });

export const Problem = mongoose.model('Problem', problemSchema);
