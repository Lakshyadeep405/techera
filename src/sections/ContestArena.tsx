import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Send,
    Code2,
    FileText,
    Trophy,
    ChevronDown,
    Timer,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContestStore } from '@/store/contestStore';
import { useQuizStore } from '@/store/quizStore';
import { submitCode, fetchLeaderboard, fetchContests, fetchProblems } from '@/services/api';

const LANGUAGES = [
    { value: 'python', label: 'Python 3', version: '3.10.0' },
    { value: 'javascript', label: 'JavaScript', version: '18.15.0' },
    { value: 'cpp', label: 'C++', version: '10.2.0' },
    { value: 'c', label: 'C', version: '10.2.0' },
    { value: 'java', label: 'Java', version: '15.0.2' },
    { value: 'typescript', label: 'TypeScript', version: '5.0.3' },
    { value: 'go', label: 'Go', version: '1.16.2' },
    { value: 'rust', label: 'Rust', version: '1.68.2' },
];

const BOILERPLATE: Record<string, string> = {
    python: '# Write your solution here\nimport sys\ninput_data = sys.stdin.read().split()\n\n',
    javascript: '// Write your solution here\nconst input = require("fs").readFileSync("/dev/stdin", "utf8").trim().split("\\n");\n\n',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    \n    return 0;\n}\n',
    c: '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    \n    return 0;\n}\n',
    java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n',
    typescript: '// Write your solution here\nconst input = require("fs").readFileSync("/dev/stdin", "utf8").trim().split("\\n");\n\n',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n    fmt.Println("Hello")\n}\n',
    rust: 'use std::io;\n\nfn main() {\n    // Write your solution here\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n}\n',
};

// Verdict badge colors
function getVerdictStyle(verdict: string) {
    switch (verdict) {
        case 'Accepted':
            return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', icon: CheckCircle2 };
        case 'Wrong Answer':
            return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', icon: XCircle };
        case 'Time Limit Exceeded':
            return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', icon: Clock };
        case 'Runtime Error':
        case 'Compilation Error':
            return { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', icon: AlertTriangle };
        default:
            return { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400', icon: Loader2 };
    }
}

export default function ContestArena() {
    const { currentUser, setCurrentView } = useQuizStore();
    const {
        activeContest,
        setActiveContest,
        problems,
        setProblems,
        selectedProblem,
        setSelectedProblem,
        code,
        setCode,
        language,
        setLanguage,
        isSubmitting,
        setIsSubmitting,
        lastVerdict,
        setLastVerdict,
        leaderboard,
        setLeaderboard,
        contestTimeRemaining,
        setContestTimeRemaining,
        decrementContestTime,
    } = useContestStore();

    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [submissionHistory, setSubmissionHistory] = useState<
        { verdict: string; timeTaken: number; timestamp: Date }[]
    >([]);
    const [activeTab, setActiveTab] = useState<'problem' | 'submissions' | 'leaderboard'>('problem');
    const [isLoading, setIsLoading] = useState(true);

    // Auto-fetch live contest and its problems on mount
    useEffect(() => {
        const loadContest = async () => {
            try {
                const res = await fetchContests();
                if (res.success && res.data) {
                    // Find the first live contest
                    const liveContest = res.data.find((c: any) => c.status === 'live');
                    if (liveContest) {
                        setActiveContest(liveContest);
                        // Fetch problems for this contest
                        const probRes = await fetchProblems(liveContest._id);
                        if (probRes.success && probRes.data) {
                            setProblems(probRes.data);
                        }
                    }
                }
            } catch {
                /* silently fail */
            }
            setIsLoading(false);
        };
        loadContest();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Contest countdown timer
    useEffect(() => {
        if (!activeContest) return;

        const endTime = new Date(activeContest.endTime).getTime();
        const updateTimer = () => {
            const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setContestTimeRemaining(remaining);
        };
        updateTimer();

        const interval = setInterval(() => {
            decrementContestTime();
        }, 1000);

        return () => clearInterval(interval);
    }, [activeContest, setContestTimeRemaining, decrementContestTime]);

    // Set boilerplate when language changes
    useEffect(() => {
        setCode(BOILERPLATE[language] || '// Write your solution here\n');
    }, [language, setCode]);

    // Select first problem by default
    useEffect(() => {
        if (problems.length > 0 && !selectedProblem) {
            setSelectedProblem(problems[0]);
        }
    }, [problems, selectedProblem, setSelectedProblem]);

    // Fetch leaderboard periodically
    useEffect(() => {
        if (!activeContest) return;
        const loadLeaderboard = async () => {
            try {
                const res = await fetchLeaderboard(activeContest._id);
                if (res.success) setLeaderboard(res.leaderboard);
            } catch (_) {
                /* silently fail */
            }
        };
        loadLeaderboard();
        const interval = setInterval(loadLeaderboard, 10000); // every 10s
        return () => clearInterval(interval);
    }, [activeContest, setLeaderboard]);

    // Handle code submission
    const handleSubmit = useCallback(async () => {
        if (!currentUser || !selectedProblem || !activeContest || isSubmitting) return;

        setIsSubmitting(true);
        setLastVerdict(null);

        try {
            const selectedLang = LANGUAGES.find((l) => l.value === language);
            const result = await submitCode({
                userId: currentUser.id,
                problemId: selectedProblem._id,
                contestId: activeContest._id,
                code,
                language,
                version: selectedLang?.version || '*',
            });

            if (result.success && result.verdict) {
                setLastVerdict(result.verdict);
                setSubmissionHistory((prev) => [
                    { verdict: result.verdict!, timeTaken: result.timeTaken || 0, timestamp: new Date() },
                    ...prev,
                ]);
                // Refresh leaderboard
                const lb = await fetchLeaderboard(activeContest._id);
                if (lb.success) setLeaderboard(lb.leaderboard);
            } else {
                setLastVerdict('Error');
            }
        } catch (err) {
            setLastVerdict('Error');
        } finally {
            setIsSubmitting(false);
        }
    }, [
        currentUser,
        selectedProblem,
        activeContest,
        code,
        language,
        isSubmitting,
        setIsSubmitting,
        setLastVerdict,
        setLeaderboard,
    ]);

    // Format time
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1A202C] pt-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <Loader2 className="w-12 h-12 text-[#9F7AEA] animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading contest...</p>
                </motion.div>
            </div>
        );
    }

    if (!activeContest) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1A202C] pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#6B46C1] to-[#D53F8C] flex items-center justify-center">
                        <Code2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No Active Contest</h2>
                    <p className="text-gray-400 mb-6">There is no contest currently active. Check back later!</p>
                    <Button onClick={() => setCurrentView('home')} className="bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] text-white">
                        Go Home
                    </Button>
                </motion.div>
            </div>
        );
    }

    const isContestOver = contestTimeRemaining <= 0;

    return (
        <div className="min-h-screen bg-[#1A202C] pt-20 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Contest Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-white">{activeContest.title}</h1>
                        <p className="text-sm text-gray-400">
                            {problems.length} Problems • {activeContest.status.toUpperCase()}
                        </p>
                    </div>
                    {/* Timer */}
                    <div
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl border ${isContestOver
                            ? 'bg-red-500/20 border-red-500/50'
                            : contestTimeRemaining < 300
                                ? 'bg-yellow-500/20 border-yellow-500/50 animate-pulse'
                                : 'bg-[#2D3748] border-white/10'
                            }`}
                    >
                        <Timer className={`w-5 h-5 ${isContestOver ? 'text-red-400' : contestTimeRemaining < 300 ? 'text-yellow-400' : 'text-[#9F7AEA]'}`} />
                        <span className={`font-mono text-xl font-bold ${isContestOver ? 'text-red-400' : 'text-white'}`}>
                            {isContestOver ? 'ENDED' : formatTime(contestTimeRemaining)}
                        </span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Panel — Problem / Submissions / Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#2D3748] rounded-2xl border border-white/10 overflow-hidden flex flex-col"
                        style={{ maxHeight: 'calc(100vh - 160px)' }}
                    >
                        {/* Tabs */}
                        <div className="flex border-b border-white/10">
                            {[
                                { key: 'problem', label: 'Problem', icon: FileText },
                                { key: 'submissions', label: 'Submissions', icon: Send },
                                { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.key
                                        ? 'text-[#9F7AEA] border-b-2 border-[#9F7AEA] bg-[#9F7AEA]/5'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <AnimatePresence mode="wait">
                                {activeTab === 'problem' && selectedProblem && (
                                    <motion.div key="problem" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        {/* Problem Selector */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {problems.map((prob, idx) => (
                                                <button
                                                    key={prob._id}
                                                    onClick={() => setSelectedProblem(prob)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedProblem._id === prob._id
                                                        ? 'bg-[#6B46C1] text-white'
                                                        : 'bg-[#1A202C] text-gray-400 hover:text-white'
                                                        }`}
                                                >
                                                    {String.fromCharCode(65 + idx)}
                                                </button>
                                            ))}
                                        </div>

                                        <h2 className="text-xl font-bold text-white mb-4">{selectedProblem.title}</h2>

                                        <div className="prose prose-invert max-w-none mb-6">
                                            <p className="text-gray-300 whitespace-pre-wrap">{selectedProblem.description}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-[#1A202C] rounded-xl p-4">
                                                <h4 className="text-sm font-semibold text-[#9F7AEA] mb-2">Input Format</h4>
                                                <p className="text-gray-400 text-sm whitespace-pre-wrap">{selectedProblem.inputFormat}</p>
                                            </div>
                                            <div className="bg-[#1A202C] rounded-xl p-4">
                                                <h4 className="text-sm font-semibold text-[#9F7AEA] mb-2">Output Format</h4>
                                                <p className="text-gray-400 text-sm whitespace-pre-wrap">{selectedProblem.outputFormat}</p>
                                            </div>
                                        </div>

                                        {/* Sample test cases (non-hidden) */}
                                        {selectedProblem.testCases.filter((tc) => !tc.isHidden).length > 0 && (
                                            <div className="mt-6 space-y-3">
                                                <h4 className="text-sm font-semibold text-white">Sample Test Cases</h4>
                                                {selectedProblem.testCases
                                                    .filter((tc) => !tc.isHidden)
                                                    .map((tc, idx) => (
                                                        <div key={idx} className="grid grid-cols-2 gap-3">
                                                            <div className="bg-[#1A202C] rounded-lg p-3">
                                                                <span className="text-xs text-gray-500 block mb-1">Input</span>
                                                                <pre className="text-sm text-gray-300 font-mono">{tc.input}</pre>
                                                            </div>
                                                            <div className="bg-[#1A202C] rounded-lg p-3">
                                                                <span className="text-xs text-gray-500 block mb-1">Output</span>
                                                                <pre className="text-sm text-gray-300 font-mono">{tc.output}</pre>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}

                                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            Time Limit: {selectedProblem.timeLimit}ms
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'submissions' && (
                                    <motion.div key="submissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <h3 className="text-lg font-bold text-white mb-4">Your Submissions</h3>
                                        {submissionHistory.length === 0 ? (
                                            <div className="text-center py-12 text-gray-500">
                                                <Send className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                                <p>No submissions yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {submissionHistory.map((sub, idx) => {
                                                    const style = getVerdictStyle(sub.verdict);
                                                    const Icon = style.icon;
                                                    return (
                                                        <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${style.bg} ${style.border}`}>
                                                            <div className="flex items-center gap-3">
                                                                <Icon className={`w-5 h-5 ${style.text}`} />
                                                                <span className={`font-semibold ${style.text}`}>{sub.verdict}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                {sub.timeTaken}ms • {sub.timestamp.toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'leaderboard' && (
                                    <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <h3 className="text-lg font-bold text-white mb-4">Live Leaderboard</h3>
                                        {leaderboard.length === 0 ? (
                                            <div className="text-center py-12 text-gray-500">
                                                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                                <p>No submissions yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {leaderboard.map((entry, idx) => (
                                                    <div
                                                        key={entry.userId}
                                                        className={`flex items-center justify-between p-4 rounded-xl border ${idx === 0
                                                            ? 'bg-yellow-500/10 border-yellow-500/30'
                                                            : idx === 1
                                                                ? 'bg-gray-400/10 border-gray-400/30'
                                                                : idx === 2
                                                                    ? 'bg-orange-500/10 border-orange-500/30'
                                                                    : 'bg-[#1A202C] border-white/5'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-8 h-8 rounded-lg bg-[#2D3748] flex items-center justify-center text-sm font-bold text-white">
                                                                {idx + 1}
                                                            </span>
                                                            <div>
                                                                <p className="font-semibold text-white">{entry.userId}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {entry.problemsSolved} solved
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-mono text-[#9F7AEA]">{entry.totalTime}ms</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Right Panel — Code Editor */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#2D3748] rounded-2xl border border-white/10 overflow-hidden flex flex-col"
                        style={{ maxHeight: 'calc(100vh - 160px)' }}
                    >
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-[#9F7AEA]" />
                                <span className="text-sm font-medium text-white">Code Editor</span>
                            </div>

                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A202C] text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    {LANGUAGES.find((l) => l.value === language)?.label || language}
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                {showLangDropdown && (
                                    <div className="absolute right-0 top-full mt-1 w-44 bg-[#1A202C] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.value}
                                                onClick={() => {
                                                    setLanguage(lang.value);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === lang.value
                                                    ? 'bg-[#6B46C1]/20 text-[#9F7AEA]'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Code textarea */}
                        <div className="flex-1 relative">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={isContestOver}
                                className="w-full h-full min-h-[400px] bg-[#1A202C] text-gray-200 font-mono text-sm p-4 resize-none outline-none placeholder:text-gray-600"
                                placeholder="Write your solution here..."
                                spellCheck={false}
                            />
                        </div>

                        {/* Verdict Banner */}
                        <AnimatePresence>
                            {lastVerdict && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className={`mx-4 mb-3 p-4 rounded-xl border flex items-center gap-3 ${getVerdictStyle(lastVerdict).bg} ${getVerdictStyle(lastVerdict).border}`}
                                >
                                    {(() => {
                                        const Icon = getVerdictStyle(lastVerdict).icon;
                                        return <Icon className={`w-6 h-6 ${getVerdictStyle(lastVerdict).text}`} />;
                                    })()}
                                    <span className={`font-bold text-lg ${getVerdictStyle(lastVerdict).text}`}>{lastVerdict}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <div className="p-4 border-t border-white/10">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || isContestOver || !selectedProblem}
                                className="w-full bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] hover:from-[#553C9A] hover:to-[#B83280] text-white font-bold py-6 rounded-xl disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Judging...
                                    </>
                                ) : isContestOver ? (
                                    'Contest Ended'
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Submit Solution
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
