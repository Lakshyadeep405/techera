import { Problem } from '../models/Problem.js';

export const getProblems = async (req, res) => {
    try {
        const { contestId } = req.params;
        const problems = await Problem.find({ contestId });

        // Hide actual outputs for hidden test cases
        const sanitized = problems.map(p => {
            const prob = p.toObject();
            prob.testCases = prob.testCases.map(tc => {
                if (tc.isHidden) {
                    return { input: '[Hidden]', output: '[Hidden]', isHidden: true };
                }
                return tc;
            });
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
        const { title, description, inputFormat, outputFormat, testCases, timeLimit, contestId } = req.body;
        const problem = new Problem({ title, description, inputFormat, outputFormat, testCases, timeLimit, contestId });
        await problem.save();
        res.status(201).json({ success: true, data: problem });
    } catch (error) {
        console.error('Create Problem Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
