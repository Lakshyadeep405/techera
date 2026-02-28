import { Problem } from '../models/Problem.js';

export const getProblems = async (req, res) => {
    try {
        const { contestId } = req.params;
        const problems = await Problem.find({ contestId });

        // Mask expected output in the response just to be safe
        const sanitized = problems.map(p => {
            const prob = p.toObject();
            prob.expectedOutput = undefined; // Don't send the answer to the client!
            return prob;
        });

        res.json({ success: true, data: sanitized });
    } catch (error) {
        console.error('Get Problems Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createProblem = async (req, res) => {
    try {
        const { title, description, expectedOutput, timeLimit, contestId } = req.body;
        const problem = new Problem({ title, description, expectedOutput, timeLimit, contestId });
        await problem.save();
        res.status(201).json({ success: true, data: problem });
    } catch (error) {
        console.error('Create Problem Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
