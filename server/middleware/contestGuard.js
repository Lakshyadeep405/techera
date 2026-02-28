import { Contest } from '../models/Contest.js';

export const requireActiveContest = async (req, res, next) => {
    try {
        // contestId might be in body or params or query
        const contestId = req.body.contestId || req.params.contestId || req.query.contestId;

        if (!contestId) {
            return res.status(400).json({ error: 'contestId is required' });
        }

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        const now = new Date();
        if (now < contest.startTime) {
            return res.status(403).json({ error: 'Contest has not started yet' });
        }

        if (now > contest.endTime) {
            return res.status(403).json({ error: 'Contest has ended. Submissions locked.' });
        }

        // Attach to request for later use
        req.contest = contest;

        next();
    } catch (error) {
        console.error('Contest Guard Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
