import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RotateCcw,
  Flame,
  Target,
  Zap,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuizStore } from '@/store/quizStore';

export default function QuizInterface() {
  const {
    quizState,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    finishQuiz,
    resetQuiz,
    decrementTime,
    setCurrentView,
    currentUser,
  } = useQuizStore();

  const {
    currentQuiz,
    currentQuestionIndex,
    selectedAnswer,
    answers,
    score,
    timeRemaining,
    isQuizActive,
    isQuizFinished,
    streak,
  } = quizState;

  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Timer effect - 20 minutes for entire quiz
  useEffect(() => {
    if (!isQuizActive || isQuizFinished) return;

    const timer = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizActive, isQuizFinished, decrementTime]);

  // Handle answer selection
  const handleSelectAnswer = useCallback((index: number) => {
    if (showFeedback || !isQuizActive) return;
    selectAnswer(index);
  }, [showFeedback, isQuizActive, selectAnswer]);

  // Handle answer submission
  const handleSubmit = useCallback(() => {
    if (selectedAnswer === null || !currentQuiz) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    submitAnswer();

    // Auto-advance after feedback
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        nextQuestion();
      } else {
        finishQuiz();
      }
    }, 1500);
  }, [selectedAnswer, currentQuiz, currentQuestionIndex, submitAnswer, nextQuestion, finishQuiz]);

  // Handle quiz exit
  const handleExit = () => {
    if (confirm('Are you sure you want to exit? Your progress will be lost!')) {
      resetQuiz();
      setCurrentView('categories');
    }
  };

  // Handle quiz restart
  const handleRestart = () => {
    resetQuiz();
    if (currentQuiz) {
      const { setCurrentQuiz, startQuiz } = useQuizStore.getState();
      setCurrentQuiz(currentQuiz);
      startQuiz();
    }
  };

  if (!currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A202C]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-4">No quiz selected</p>
          <Button onClick={() => setCurrentView('categories')}>
            Go to Quiz
          </Button>
        </motion.div>
      </div>
    );
  }

  // Quiz Finished Screen
  if (isQuizFinished) {
    const totalQuestions = currentQuiz.questions.length;
    const correctAnswers = answers.filter((ans, idx) => 
      ans === currentQuiz.questions[idx].correctAnswer
    ).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const timeUsed = currentQuiz.timeLimit - timeRemaining;
    const minutesUsed = Math.floor(timeUsed / 60);
    const secondsUsed = timeUsed % 60;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A202C] px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg w-full bg-[#2D3748] rounded-3xl p-8 border border-white/10"
        >
          {/* Result Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#6B46C1] to-[#D53F8C] flex items-center justify-center"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Quiz Completed!
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Great job, {currentUser?.name || 'Player'}!
          </p>

          {/* Score Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#1A202C] rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-[#9F7AEA]">{score}</div>
              <div className="text-xs text-gray-500">Total Score</div>
            </div>
            <div className="bg-[#1A202C] rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-[#38B2AC]">{percentage}%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
            <div className="bg-[#1A202C] rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-[#F687B3]">{correctAnswers}/{totalQuestions}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="bg-[#1A202C] rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-[#DD6B20]">{minutesUsed}:{secondsUsed.toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">Time Used</div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="mb-8 text-center">
            {percentage >= 80 && (
              <p className="text-[#38B2AC] font-medium text-lg">Outstanding! You're a master! 🏆</p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="text-[#9F7AEA] font-medium text-lg">Great job! Keep it up! ⭐</p>
            )}
            {percentage < 60 && (
              <p className="text-[#F687B3] font-medium text-lg">Good effort! Practice makes perfect! 💪</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleRestart}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button
              onClick={() => setCurrentView('leaderboard')}
              className="flex-1 bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] hover:from-[#553C9A] hover:to-[#B83280] text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining < 120; // Less than 2 minutes

  return (
    <div className="min-h-screen bg-[#1A202C] pt-20 pb-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-[#2D3748]" />
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4 flex-wrap">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D3748] ${
              isLowTime ? 'text-red-400 animate-pulse border border-red-400/30' : 'text-gray-300'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D3748] text-[#9F7AEA]">
              <Target className="w-4 h-4" />
              <span className="font-medium">{score}</span>
            </div>

            {/* Streak */}
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#DD6B20]/20 text-[#DD6B20]"
              >
                <Flame className="w-4 h-4" />
                <span className="font-medium">{streak}x</span>
              </motion.div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="text-gray-500 hover:text-white"
          >
            Exit
          </Button>
        </motion.div>

        {/* Low Time Warning */}
        <AnimatePresence>
          {isLowTime && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400">Hurry up! Less than 2 minutes remaining!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-[#2D3748] rounded-3xl p-6 md:p-8 border border-white/10"
          >
            {/* Category Tag */}
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full bg-[#6B46C1]/20 text-[#9F7AEA] text-xs font-medium">
                {currentQuestion.category}
              </span>
            </div>

            {/* Question */}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                const showCorrect = showFeedback && isCorrectAnswer;
                const showWrong = showFeedback && isSelected && !isCorrectAnswer;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showFeedback}
                    whileHover={!showFeedback ? { scale: 1.02, x: 5 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 ${
                      showCorrect
                        ? 'border-[#38B2AC] bg-[#38B2AC]/20'
                        : showWrong
                        ? 'border-red-500 bg-red-500/20'
                        : isSelected
                        ? 'border-[#6B46C1] bg-[#6B46C1]/20'
                        : 'border-white/10 bg-[#1A202C] hover:border-[#6B46C1]/50 hover:bg-[#6B46C1]/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          showCorrect
                            ? 'bg-[#38B2AC] text-white'
                            : showWrong
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-[#6B46C1] text-white'
                            : 'bg-[#2D3748] text-gray-400'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-white">{option}</span>
                      {showCorrect && <CheckCircle2 className="w-5 h-5 text-[#38B2AC]" />}
                      {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Submit Button */}
            {!showFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: selectedAnswer !== null ? 1 : 0 }}
                className="mt-6"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="w-full bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] hover:from-[#553C9A] hover:to-[#B83280] text-white font-bold py-6 rounded-xl"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Submit Answer
                </Button>
              </motion.div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-4 rounded-xl text-center ${
                    isCorrect
                      ? 'bg-[#38B2AC]/20 border border-[#38B2AC]'
                      : 'bg-red-500/20 border border-red-500'
                  }`}
                >
                  <p
                    className={`text-lg font-bold ${
                      isCorrect ? 'text-[#38B2AC]' : 'text-red-400'
                    }`}
                  >
                    {isCorrect ? '🎉 Correct!' : '❌ Incorrect!'}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-gray-400 mt-1">
                      The correct answer was: {currentQuestion.options[currentQuestion.correctAnswer]}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
