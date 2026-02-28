import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown,
  Target,
  Clock,
  Search,
  User,
  Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuizStore } from '@/store/quizStore';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  completedQuestions: number;
  accuracy: number;
  timeTaken: number;
  date: string;
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
  isTopThree: boolean;
}

const LeaderboardRow = ({ entry, rank, isTopThree }: LeaderboardRowProps) => {
  const getRankIcon = () => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
    return <span className="w-5 h-5 flex items-center justify-center text-gray-500 font-medium">{rank}</span>;
  };

  const getRankStyle = () => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 border-orange-400/30';
    return 'bg-[#2D3748] border-white/5 hover:border-white/10';
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: rank * 0.05 }}
      className={`group transition-all ${getRankStyle()}`}
    >
      <td className="px-4 py-4">
        <div className="flex items-center justify-center">
          {getRankIcon()}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isTopThree 
              ? 'bg-gradient-to-br from-[#6B46C1] to-[#D53F8C]' 
              : 'bg-[#3D4758]'
          }`}>
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white">{entry.userName}</p>
            <p className="text-xs text-gray-500">{entry.quizTitle}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#9F7AEA]" />
          <span className="font-bold text-white">{entry.score}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-[#1A202C] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${entry.accuracy}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full rounded-full ${
                entry.accuracy >= 80 ? 'bg-[#38B2AC]' : 
                entry.accuracy >= 60 ? 'bg-[#9F7AEA]' : 'bg-[#F687B3]'
              }`}
            />
          </div>
          <span className="text-sm text-gray-400">{entry.accuracy}%</span>
        </div>
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {Math.floor(entry.timeTaken / 60)}:{(entry.timeTaken % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </td>
      <td className="px-4 py-4 hidden sm:table-cell">
        <span className="text-sm text-gray-400">
          {new Date(entry.date).toLocaleDateString()}
        </span>
      </td>
    </motion.tr>
  );
};

export default function Leaderboard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [searchQuery, setSearchQuery] = useState('');

  const { leaderboard: storeLeaderboard } = useQuizStore();
  
  // Convert store leaderboard to entries format - NO demo data
  const allEntries: LeaderboardEntry[] = storeLeaderboard.map(s => ({
    userId: s.userId,
    userName: s.userName,
    quizId: s.quizId,
    quizTitle: s.quizTitle,
    score: s.score,
    totalQuestions: s.totalQuestions,
    completedQuestions: s.completedQuestions,
    accuracy: Math.round((s.completedQuestions / s.totalQuestions) * 100) || 0,
    timeTaken: s.timeRemaining,
    date: new Date(s.lastUpdated).toISOString(),
  })).sort((a, b) => b.score - a.score);

  const filteredEntries = allEntries
    .filter((entry) => {
      const matchesSearch = entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.quizTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .slice(0, 20);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6B46C1] to-[#D53F8C] mb-4"
          >
            <Trophy className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Top{' '}
            <span className="bg-gradient-to-r from-[#9F7AEA] to-[#F687B3] bg-clip-text text-transparent">
              Performers
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Celebrate the champions! Real scores from real players.
          </p>
        </motion.div>

        {/* Top 3 Podium - Only show if there are entries */}
        {filteredEntries.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-end justify-center gap-4 mb-12"
          >
            {filteredEntries.slice(0, 3).map((entry, index) => {
              const positions = [
                { height: 'h-48', rank: 2, delay: 0.4 },
                { height: 'h-64', rank: 1, delay: 0.2 },
                { height: 'h-40', rank: 3, delay: 0.6 },
              ];
              const pos = positions[index];
              
              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: pos.delay }}
                  className="flex flex-col items-center"
                >
                  <div className="text-center mb-2">
                    <p className="font-bold text-white text-sm">{entry.userName}</p>
                    <p className="text-[#9F7AEA] text-xs">{entry.score} pts</p>
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={isInView ? { height: 'auto' } : {}}
                    transition={{ duration: 0.8, delay: pos.delay + 0.2 }}
                    className={`w-24 ${pos.height} rounded-t-2xl flex items-center justify-center ${
                      pos.rank === 1
                        ? 'bg-gradient-to-b from-yellow-400/30 to-yellow-600/30 border-t-2 border-yellow-400'
                        : pos.rank === 2
                        ? 'bg-gradient-to-b from-gray-400/30 to-gray-500/30 border-t-2 border-gray-400'
                        : 'bg-gradient-to-b from-orange-400/30 to-orange-500/30 border-t-2 border-orange-400'
                    }`}
                  >
                    <span className="text-3xl font-bold text-white">{pos.rank}</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2D3748] border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-[#1A202C] rounded-2xl border border-white/5 overflow-hidden"
        >
          {filteredEntries.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-[#2D3748] text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase w-16">Rank</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Player</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Time</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEntries.map((entry, index) => (
                  <LeaderboardRow
                    key={entry.userId}
                    entry={entry}
                    rank={index + 1}
                    isTopThree={index < 3}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2D3748] flex items-center justify-center"
              >
                <Users className="w-10 h-10 text-gray-500" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">No Scores Yet</h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                Be the first to take the quiz and claim the top spot on the leaderboard!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
