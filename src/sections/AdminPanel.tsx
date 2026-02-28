import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trophy,
  Clock,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Code2,
  RefreshCw,
  Calendar,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface TestCase {
  input: string;
  output: string;
  isHidden: boolean;
}

interface Contest {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  testCases: TestCase[];
  timeLimit: number;
  contestId: string;
}

export default function AdminPanel() {


  // Tab state
  const [activeTab, setActiveTab] = useState<'contests' | 'problems'>('contests');

  // Contests state
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>('');

  // Create contest form
  const [contestTitle, setContestTitle] = useState('');
  const [contestStart, setContestStart] = useState('');
  const [contestEnd, setContestEnd] = useState('');

  // Problems state
  const [problems, setProblems] = useState<Problem[]>([]);

  // Create problem form
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDesc, setProblemDesc] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [timeLimit, setTimeLimit] = useState('2000');
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', output: '', isHidden: false },
  ]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch contests
  const fetchContests = async () => {
    try {
      const res = await fetch(`${API_BASE}/contests`);
      const data = await res.json();
      if (data.success) setContests(data.data);
    } catch {
      /* ignore */
    }
  };

  // Fetch problems for selected contest
  const fetchProblems = async (contestId: string) => {
    try {
      const res = await fetch(`${API_BASE}/problems/${contestId}`);
      const data = await res.json();
      if (data.success) setProblems(data.data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    if (selectedContestId) fetchProblems(selectedContestId);
  }, [selectedContestId]);

  // Auto-dismiss message
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // Create contest
  const handleCreateContest = async () => {
    if (!contestTitle || !contestStart || !contestEnd) {
      setMessage({ type: 'error', text: 'Fill all contest fields' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: contestTitle,
          startTime: new Date(contestStart).toISOString(),
          endTime: new Date(contestEnd).toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Contest "${contestTitle}" created!` });
        setContestTitle('');
        setContestStart('');
        setContestEnd('');
        fetchContests();
      } else {
        setMessage({ type: 'error', text: 'Failed to create contest' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Server error' });
    }
    setLoading(false);
  };

  // Create problem
  const handleCreateProblem = async () => {
    if (!selectedContestId) {
      setMessage({ type: 'error', text: 'Select a contest first' });
      return;
    }
    if (!problemTitle || !problemDesc) {
      setMessage({ type: 'error', text: 'Fill problem title and description' });
      return;
    }
    const validTestCases = testCases.filter((tc) => tc.input.trim() && tc.output.trim());
    if (validTestCases.length === 0) {
      setMessage({ type: 'error', text: 'Add at least one test case' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: problemTitle,
          description: problemDesc,
          inputFormat,
          outputFormat,
          testCases: validTestCases,
          timeLimit: parseInt(timeLimit) || 2000,
          contestId: selectedContestId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Problem "${problemTitle}" added!` });
        setProblemTitle('');
        setProblemDesc('');
        setInputFormat('');
        setOutputFormat('');
        setTimeLimit('2000');
        setTestCases([{ input: '', output: '', isHidden: false }]);
        fetchProblems(selectedContestId);
      } else {
        setMessage({ type: 'error', text: 'Failed to create problem' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Server error' });
    }
    setLoading(false);
  };

  // Add test case
  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '', isHidden: false }]);
  };

  // Remove test case
  const removeTestCase = (idx: number) => {
    setTestCases(testCases.filter((_, i) => i !== idx));
  };

  // Update test case
  const updateTestCase = (idx: number, field: keyof TestCase, value: string | boolean) => {
    const updated = [...testCases];
    (updated[idx] as any)[field] = value;
    setTestCases(updated);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ended':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#1A202C] pt-20 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Admin{' '}
            <span className="bg-gradient-to-r from-[#9F7AEA] to-[#F687B3] bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400">Create contests and add problems for students to solve</p>
        </motion.div>

        {/* Message Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          {[
            { key: 'contests', label: 'Contests', icon: Trophy },
            { key: 'problems', label: 'Problems', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.key
                ? 'text-[#9F7AEA] border-[#9F7AEA]'
                : 'text-gray-400 border-transparent hover:text-white'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════ CONTESTS TAB ══════════ */}
        {activeTab === 'contests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Create Contest Form */}
            <div className="bg-[#2D3748] rounded-2xl p-6 border border-white/10 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#9F7AEA]" />
                Create New Contest
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Contest Title</label>
                  <Input
                    placeholder="e.g. DebugX Round #2"
                    value={contestTitle}
                    onChange={(e) => setContestTitle(e.target.value)}
                    className="bg-[#1A202C] border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      value={contestStart}
                      onChange={(e) => setContestStart(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#1A202C] border border-white/10 text-white text-sm outline-none focus:border-[#6B46C1]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      value={contestEnd}
                      onChange={(e) => setContestEnd(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#1A202C] border border-white/10 text-white text-sm outline-none focus:border-[#6B46C1]"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateContest}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] hover:from-[#553C9A] hover:to-[#B83280] text-white font-bold py-5"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Contest
                </Button>
              </div>
            </div>

            {/* Existing Contests */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Existing Contests</h3>
              <button onClick={fetchContests} className="text-gray-400 hover:text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {contests.length === 0 ? (
              <div className="text-center py-12 bg-[#2D3748]/50 rounded-2xl border border-white/5">
                <Trophy className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No contests yet. Create one above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contests.map((c) => (
                  <div
                    key={c._id}
                    className="bg-[#2D3748] rounded-xl p-4 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#6B46C1]/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-[#9F7AEA]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{c.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(c.startTime).toLocaleString()}
                          </span>
                          <span>→ {new Date(c.endTime).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(c.status)}`}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════ PROBLEMS TAB ══════════ */}
        {activeTab === 'problems' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Select Contest */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 block mb-2">Select Contest to Add Problems</label>
              <select
                value={selectedContestId}
                onChange={(e) => setSelectedContestId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#2D3748] border border-white/10 text-white text-sm outline-none focus:border-[#6B46C1] appearance-none"
              >
                <option value="">-- Choose a Contest --</option>
                {contests.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedContestId && (
              <>
                {/* Create Problem Form */}
                <div className="bg-[#2D3748] rounded-2xl p-6 border border-white/10 mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#9F7AEA]" />
                    Add New Problem
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Problem Title</label>
                      <Input
                        placeholder="e.g. Two Sum"
                        value={problemTitle}
                        onChange={(e) => setProblemTitle(e.target.value)}
                        className="bg-[#1A202C] border-white/10 text-white placeholder:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Description</label>
                      <textarea
                        placeholder="Describe the problem clearly..."
                        value={problemDesc}
                        onChange={(e) => setProblemDesc(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-[#1A202C] border border-white/10 text-white text-sm outline-none resize-none focus:border-[#6B46C1] placeholder:text-gray-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Input Format</label>
                        <textarea
                          placeholder="Describe input format..."
                          value={inputFormat}
                          onChange={(e) => setInputFormat(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A202C] border border-white/10 text-white text-sm outline-none resize-none focus:border-[#6B46C1] placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Output Format</label>
                        <textarea
                          placeholder="Describe output format..."
                          value={outputFormat}
                          onChange={(e) => setOutputFormat(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-[#1A202C] border border-white/10 text-white text-sm outline-none resize-none focus:border-[#6B46C1] placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 block mb-1">
                        Time Limit (ms)
                      </label>
                      <Input
                        type="number"
                        placeholder="2000"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        className="bg-[#1A202C] border-white/10 text-white w-40"
                      />
                    </div>

                    {/* Test Cases */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm text-gray-400">
                          Test Cases ({testCases.length})
                        </label>
                        <button
                          onClick={addTestCase}
                          className="flex items-center gap-1 text-xs text-[#9F7AEA] hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add Test Case
                        </button>
                      </div>

                      <div className="space-y-3">
                        {testCases.map((tc, idx) => (
                          <div
                            key={idx}
                            className="bg-[#1A202C] rounded-xl p-4 border border-white/5"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">
                                Test Case #{idx + 1}
                              </span>
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={tc.isHidden}
                                    onChange={(e) =>
                                      updateTestCase(idx, 'isHidden', e.target.checked)
                                    }
                                    className="rounded"
                                  />
                                  Hidden
                                </label>
                                {testCases.length > 1 && (
                                  <button
                                    onClick={() => removeTestCase(idx)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-xs text-gray-500 block mb-1">Input</span>
                                <textarea
                                  value={tc.input}
                                  onChange={(e) =>
                                    updateTestCase(idx, 'input', e.target.value)
                                  }
                                  rows={2}
                                  className="w-full px-3 py-2 rounded-lg bg-[#2D3748] border border-white/5 text-white text-xs font-mono outline-none resize-none focus:border-[#6B46C1]"
                                  placeholder="Input..."
                                />
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 block mb-1">
                                  Expected Output
                                </span>
                                <textarea
                                  value={tc.output}
                                  onChange={(e) =>
                                    updateTestCase(idx, 'output', e.target.value)
                                  }
                                  rows={2}
                                  className="w-full px-3 py-2 rounded-lg bg-[#2D3748] border border-white/5 text-white text-xs font-mono outline-none resize-none focus:border-[#6B46C1]"
                                  placeholder="Expected output..."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateProblem}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] hover:from-[#553C9A] hover:to-[#B83280] text-white font-bold py-5"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Code2 className="w-4 h-4 mr-2" />
                      )}
                      Add Problem
                    </Button>
                  </div>
                </div>

                {/* Existing Problems */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    Problems in this Contest ({problems.length})
                  </h3>
                  <button
                    onClick={() => fetchProblems(selectedContestId)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {problems.length === 0 ? (
                  <div className="text-center py-12 bg-[#2D3748]/50 rounded-2xl border border-white/5">
                    <FileText className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No problems yet. Add one above!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {problems.map((p, idx) => (
                      <div
                        key={p._id}
                        className="bg-[#2D3748] rounded-xl p-4 border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-lg bg-[#6B46C1]/20 flex items-center justify-center text-sm font-bold text-[#9F7AEA]">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <div>
                            <h4 className="font-semibold text-white">{p.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{p.testCases.length} test cases</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {p.timeLimit}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {!selectedContestId && (
              <div className="text-center py-16 bg-[#2D3748]/50 rounded-2xl border border-white/5">
                <Users className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">Select a contest above to manage its problems</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
