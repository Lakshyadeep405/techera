import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  Clock,
  BarChart3,
  Play,
  Trophy,
  Target,
  Zap,
  Users,
  Timer
} from 'lucide-react';
import { megaQuiz } from '@/data/quizzes';
import { useQuizStore } from '@/store/quizStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { setCurrentQuiz, setCurrentView, startQuiz, currentUser, setCurrentUser } = useQuizStore();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [userName, setUserName] = useState('');

  const handleStartQuiz = () => {
    if (!currentUser) {
      setShowLoginDialog(true);
      return;
    }
    startMegaQuiz();
  };

  const startMegaQuiz = () => {
    setCurrentQuiz(megaQuiz);
    startQuiz();
    setCurrentView('quiz');
  };

  const handleLogin = () => {
    if (userName.trim()) {
      setCurrentUser({
        id: Date.now().toString(),
        name: userName.trim(),
        isAdmin: false,
      });
      setUserName('');
      setShowLoginDialog(false);
      // Auto-start quiz after login
      setTimeout(startMegaQuiz, 300);
    }
  };

  // Format time from seconds
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-block px-4 py-1 rounded-full bg-[#6B46C1]/20 text-[#9F7AEA] text-sm font-medium mb-4"
          >
            DebugX Quick Quiz
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Test Your{' '}
            <span className="bg-gradient-to-r from-[#9F7AEA] to-[#F687B3] bg-clip-text text-transparent">
              Code IQ
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Think you know coding? Test your knowledge across DSA, Algorithms, Web Dev, Databases, OS, and more.
            One quiz, 100 questions, 20 minutes!
          </p>
        </motion.div>

        {/* Mega Quiz Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6B46C1] via-[#D53F8C] to-[#9F7AEA] rounded-3xl blur-xl opacity-30" />

          <div className="relative bg-[#2D3748] rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#6B46C1] rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D53F8C] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              {/* Icon & Title */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6B46C1] to-[#D53F8C] flex items-center justify-center shadow-lg shadow-purple-500/25"
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>

                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {megaQuiz.title}
                  </h3>
                  <p className="text-gray-400">
                    {megaQuiz.description}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    icon: BarChart3,
                    value: megaQuiz.questions.length,
                    label: 'Questions',
                    color: '#9F7AEA'
                  },
                  {
                    icon: Timer,
                    value: formatTime(megaQuiz.timeLimit),
                    label: 'Time Limit',
                    color: '#38B2AC'
                  },
                  {
                    icon: Target,
                    value: '10',
                    label: 'Points per Q',
                    color: '#F687B3'
                  },
                  {
                    icon: Zap,
                    value: '+2',
                    label: 'Streak Bonus',
                    color: '#DD6B20'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-[#1A202C] rounded-2xl p-4 text-center"
                  >
                    <div
                      className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Categories Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {['DSA', 'Algorithms', 'Web Dev', 'Databases', 'OS', 'Networking', 'OOP'].map((cat, index) => (
                  <motion.span
                    key={cat}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="px-3 py-1 rounded-full bg-[#1A202C] text-gray-400 text-xs"
                  >
                    {cat}
                  </motion.span>
                ))}
              </div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 }}
                className="text-center"
              >
                <Button
                  onClick={handleStartQuiz}
                  size="lg"
                  className="group bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] hover:from-[#553C9A] hover:to-[#B83280] text-white font-bold text-lg px-12 py-7 rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                >
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  START CODING QUIZ
                </Button>

                {currentUser && (
                  <p className="mt-4 text-sm text-gray-500">
                    Playing as <span className="text-[#9F7AEA]">{currentUser.name}</span>
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Clock,
              title: 'Race the Clock',
              description: 'You have 20 minutes to crack all 100 coding questions. Speed and accuracy win!'
            },
            {
              icon: Trophy,
              title: 'Build Your Streak',
              description: 'Answer consecutive questions correctly to earn bonus points. Streak = +2 points!'
            },
            {
              icon: Users,
              title: 'Climb the Ranks',
              description: 'Your score hits the live leaderboard. Compete with coders across DebugX!'
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="bg-[#2D3748]/50 rounded-2xl p-6 border border-white/5"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6B46C1]/20 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-[#9F7AEA]" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-[#2D3748] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Enter Your Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-400">
              Please enter your name to start the quiz. Your score will be saved to the leaderboard.
            </p>
            <Input
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-[#1A202C] border-white/10 text-white placeholder:text-gray-500"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] hover:from-[#553C9A] hover:to-[#B83280] text-white font-semibold"
            >
              Start Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
