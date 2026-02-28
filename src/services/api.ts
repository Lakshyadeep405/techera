const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface SubmissionPayload {
    userId: string;
    problemId: string;
    contestId: string;
    code: string;
    language: string;
    version?: string;
}

interface SubmissionResult {
    success: boolean;
    submissionId?: string;
    verdict?: string;
    timeTaken?: number;
    error?: string;
}

interface LeaderboardEntry {
    userId: string;
    problemsSolved: number;
    totalTime: number;
}

interface ContestData {
    _id: string;
    title: string;
    startTime: string;
    endTime: string;
    status: 'upcoming' | 'live' | 'ended';
}

interface ProblemData {
    _id: string;
    title: string;
    description: string;
    expectedOutput?: string;
    timeLimit: number;
    contestId: string;
}

// Submit code for judging
export async function submitCode(payload: SubmissionPayload): Promise<SubmissionResult> {
    const res = await fetch(`${API_BASE_URL}/submission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return res.json();
}

// Get leaderboard for a contest
export async function fetchLeaderboard(contestId: string): Promise<{ success: boolean; leaderboard: LeaderboardEntry[] }> {
    const res = await fetch(`${API_BASE_URL}/leaderboard/${contestId}`);
    return res.json();
}

// Fetch all contests
export async function fetchContests(): Promise<{ success: boolean; data: ContestData[] }> {
    const res = await fetch(`${API_BASE_URL}/contests`);
    return res.json();
}

// Fetch problems for a contest
export async function fetchProblems(contestId: string): Promise<{ success: boolean; data: ProblemData[] }> {
    const res = await fetch(`${API_BASE_URL}/problems/${contestId}`);
    return res.json();
}

// Fetch user submissions
export async function fetchSubmissions(
    userId: string,
    contestId?: string
): Promise<{ success: boolean; data: any[] }> {
    let url = `${API_BASE_URL}/submissions?userId=${userId}`;
    if (contestId) url += `&contestId=${contestId}`;
    const res = await fetch(url);
    return res.json();
}

export type { SubmissionPayload, SubmissionResult, LeaderboardEntry, ContestData, ProblemData };
