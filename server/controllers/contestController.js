import { Contest } from '../models/Contest.js';

export const getContests = async (req, res) => {
    try {
        const contests = await Contest.find().sort({ startTime: -1 });

        // Auto-update statuses
        const now = new Date();
        for (const contest of contests) {
            let newStatus = 'upcoming';
            if (now >= contest.startTime && now <= contest.endTime) newStatus = 'live';
            if (now > contest.endTime) newStatus = 'ended';
            if (contest.status !== newStatus) {
                contest.status = newStatus;
                await contest.save();
            }
        }

        res.json({ success: true, data: contests });
    } catch (error) {
        console.error('Get Contests Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error', details: error });
    }
};

export const createContest = async (req, res) => {
    try {
        const { title, startTime, endTime } = req.body;
        const contest = new Contest({ title, startTime, endTime });
        await contest.save();
        res.status(201).json({ success: true, data: contest });
    } catch (error) {
        console.error('Create Contest Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error', details: error });
    }
};
