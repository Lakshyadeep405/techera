import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    timeLimit: { type: Number, default: 2000 }, // Time limit in milliseconds
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }
}, { timestamps: true });

export const Problem = mongoose.model('Problem', problemSchema);
