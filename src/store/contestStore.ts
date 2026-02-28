import { create } from 'zustand';
import type { ContestData, ProblemData, LeaderboardEntry } from '@/services/api';

interface ContestStore {
    // Active contest
    activeContest: ContestData | null;
    setActiveContest: (contest: ContestData | null) => void;

    // Problems
    problems: ProblemData[];
    setProblems: (problems: ProblemData[]) => void;
    selectedProblem: ProblemData | null;
    setSelectedProblem: (problem: ProblemData | null) => void;

    // Code editor state
    code: string;
    setCode: (code: string) => void;
    language: string;
    setLanguage: (lang: string) => void;

    // Submission state
    isSubmitting: boolean;
    setIsSubmitting: (val: boolean) => void;
    lastVerdict: string | null;
    setLastVerdict: (verdict: string | null) => void;

    // Leaderboard
    leaderboard: LeaderboardEntry[];
    setLeaderboard: (entries: LeaderboardEntry[]) => void;

    // Contest timer
    contestTimeRemaining: number; // in seconds
    setContestTimeRemaining: (seconds: number) => void;
    decrementContestTime: () => void;

    // Reset
    resetContest: () => void;
}

export const useContestStore = create<ContestStore>()((set) => ({
    activeContest: null,
    setActiveContest: (contest) => set({ activeContest: contest }),

    problems: [],
    setProblems: (problems) => set({ problems }),
    selectedProblem: null,
    setSelectedProblem: (problem) => set({ selectedProblem: problem }),

    code: '// Write your solution here\n',
    setCode: (code) => set({ code }),
    language: 'python',
    setLanguage: (language) => set({ language }),

    isSubmitting: false,
    setIsSubmitting: (val) => set({ isSubmitting: val }),
    lastVerdict: null,
    setLastVerdict: (verdict) => set({ lastVerdict: verdict }),

    leaderboard: [],
    setLeaderboard: (entries) => set({ leaderboard: entries }),

    contestTimeRemaining: 0,
    setContestTimeRemaining: (seconds) => set({ contestTimeRemaining: seconds }),
    decrementContestTime: () =>
        set((state) => ({
            contestTimeRemaining: Math.max(0, state.contestTimeRemaining - 1),
        })),

    resetContest: () =>
        set({
            activeContest: null,
            problems: [],
            selectedProblem: null,
            code: '// Write your solution here\n',
            language: 'python',
            isSubmitting: false,
            lastVerdict: null,
            leaderboard: [],
            contestTimeRemaining: 0,
        }),
}));
