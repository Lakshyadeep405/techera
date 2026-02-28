import express from 'express';
import { submitCode, getSubmissions } from '../controllers/submissionController.js';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { getContests, createContest } from '../controllers/contestController.js';
import { getProblems, createProblem } from '../controllers/problemController.js';

import { requireActiveContest } from '../middleware/contestGuard.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Contest Routes
router.get('/contests', getContests);
router.post('/contests', createContest);

// Problem Routes
router.get('/problems/:contestId', getProblems);
router.post('/problems', createProblem);

// Submission Routes
router.post('/submission', submissionLimiter, requireActiveContest, submitCode);
router.get('/submissions', getSubmissions);

// Leaderboard Route
router.get('/leaderboard/:contestId', getLeaderboard);

export default router;
