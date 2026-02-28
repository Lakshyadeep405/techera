import { Submission } from '../models/Submission.js';
import { Problem } from '../models/Problem.js';
import { executeCode } from '../utils/executor.js';

export const submitCode = async (req, res) => {
    try {
        const { userId, problemId, code, language, version = "*", contestId } = req.body;

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Initialize submission
        const submission = new Submission({
            userId,
            problemId,
            contestId,
            code,
            language,
            verdict: 'Pending'
        });
        await submission.save();

        let finalVerdict = 'Accepted';

        // Execute code via Piston with NO standard input
        const startTime = Date.now();
        const execResult = await executeCode(language, version, code, "", problem.timeLimit);
        const timeTaken = Date.now() - startTime;

        if (!execResult.success) {
            finalVerdict = 'Runtime Error';
        } else {
            const runResult = execResult.data.run;
            const compileResult = execResult.data.compile;

            if (compileResult && compileResult.code !== 0) {
                finalVerdict = 'Compilation Error';
            } else if (runResult.signal === 'SIGKILL' || timeTaken >= problem.timeLimit) {
                finalVerdict = 'Time Limit Exceeded';
            } else if (runResult.code !== 0) {
                finalVerdict = 'Runtime Error';
            } else {
                // Compare Output
                const actualOutput = runResult.stdout.trim();
                const expectedOutput = problem.expectedOutput.trim();

                if (actualOutput !== expectedOutput) {
                    finalVerdict = 'Wrong Answer';
                }
            }
        }

        // Update submission tracking
        submission.verdict = finalVerdict;
        submission.timeTaken = timeTaken;
        await submission.save();

        return res.json({
            success: true,
            submissionId: submission._id,
            verdict: finalVerdict,
            timeTaken: timeTaken
        });

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getSubmissions = async (req, res) => {
    try {
        const { userId, problemId, contestId } = req.query;
        let query = {};
        if (userId) query.userId = userId;
        if (problemId) query.problemId = problemId;
        if (contestId) query.contestId = contestId;

        const submissions = await Submission.find(query).sort({ timestamp: -1 });
        res.json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
