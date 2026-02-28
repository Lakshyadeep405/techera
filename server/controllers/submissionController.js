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
        let maxTimeTaken = 0;

        // Verify across all test cases
        for (let i = 0; i < problem.testCases.length; i++) {
            const testCase = problem.testCases[i];

            // Execute code via Piston
            const startTime = Date.now();
            const execResult = await executeCode(language, version, code, testCase.input, problem.timeLimit);
            const timeTaken = Date.now() - startTime;

            maxTimeTaken = Math.max(maxTimeTaken, timeTaken);

            if (!execResult.success) {
                finalVerdict = 'Runtime Error';
                break;
            }

            const runResult = execResult.data.run;
            const compileResult = execResult.data.compile;

            if (compileResult && compileResult.code !== 0) {
                finalVerdict = 'Compilation Error';
                break;
            }

            if (runResult.signal === 'SIGKILL' || timeTaken >= problem.timeLimit) {
                finalVerdict = 'Time Limit Exceeded';
                break;
            }

            if (runResult.code !== 0) {
                finalVerdict = 'Runtime Error';
                break;
            }

            // Compare Output
            const actualOutput = runResult.stdout.trim();
            const expectedOutput = testCase.output.trim();

            if (actualOutput !== expectedOutput) {
                finalVerdict = 'Wrong Answer';
                break;
            }
        }

        // Update submission tracking
        submission.verdict = finalVerdict;
        submission.timeTaken = maxTimeTaken;
        await submission.save();

        return res.json({
            success: true,
            submissionId: submission._id,
            verdict: finalVerdict,
            timeTaken: maxTimeTaken
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
