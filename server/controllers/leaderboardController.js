import { Submission } from '../models/Submission.js';

export const getLeaderboard = async (req, res) => {
    try {
        const { contestId } = req.params;

        if (!contestId) {
            return res.status(400).json({ error: 'contestId is required' });
        }

        // Aggregate submissions to rank users
        const leaderboard = await Submission.aggregate([
            // Match only the accepted submissions for this contest
            {
                $match: {
                    contestId: contestId,
                    verdict: 'Accepted'
                }
            },
            // Sort by timestamp so we process earliest accepted submissions first per problem
            { $sort: { timestamp: 1 } },
            // Group by User and Problem to get only the first accepted submission per problem
            {
                $group: {
                    _id: { userId: '$userId', problemId: '$problemId' },
                    timeTakenForProblem: { $first: '$timeTaken' },
                    timeSubmitted: { $first: '$timestamp' }
                }
            },
            // Group by User to aggregate total constraints
            {
                $group: {
                    _id: '$_id.userId',
                    problemsSolved: { $sum: 1 },
                    totalTime: { $sum: '$timeTakenForProblem' }
                }
            },
            // Add custom projection details
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    problemsSolved: 1,
                    totalTime: 1
                }
            },
            // Sort Leaderboard logic: Descending Problems Solved, Ascending Total Time 
            {
                $sort: { problemsSolved: -1, totalTime: 1 }
            }
        ]);

        res.json({ success: true, leaderboard });
    } catch (error) {
        console.error('Leaderboard Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
