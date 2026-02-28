import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quiz, QuizState, PlayerScore, User } from '@/types/quiz';

interface QuizStore {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Quiz state
  quizState: QuizState;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  selectAnswer: (answerIndex: number) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  startQuiz: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
  decrementTime: () => void;

  // Admin state
  connectedPlayers: PlayerScore[];
  updatePlayerScore: (score: PlayerScore) => void;
  removePlayer: (userId: string) => void;
  setConnectedPlayers: (players: PlayerScore[]) => void;

  // Leaderboard
  leaderboard: PlayerScore[];
  addToLeaderboard: (score: PlayerScore) => void;

  // View state
  currentView: 'home' | 'quiz' | 'admin' | 'leaderboard' | 'categories' | 'contest';
  setCurrentView: (view: 'home' | 'quiz' | 'admin' | 'leaderboard' | 'categories' | 'contest') => void;
}

const initialQuizState: QuizState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  selectedAnswer: null,
  answers: [],
  score: 0,
  timeRemaining: 0,
  isQuizActive: false,
  isQuizFinished: false,
  streak: 0,
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // User
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      // Quiz
      quizState: initialQuizState,
      setCurrentQuiz: (quiz) => set((state) => ({
        quizState: {
          ...state.quizState,
          currentQuiz: quiz,
          timeRemaining: quiz?.timeLimit || 0,
        }
      })),

      setCurrentQuestionIndex: (index) => set((state) => ({
        quizState: { ...state.quizState, currentQuestionIndex: index }
      })),

      selectAnswer: (answerIndex) => set((state) => ({
        quizState: { ...state.quizState, selectedAnswer: answerIndex }
      })),

      submitAnswer: () => {
        const { quizState, currentUser } = get();
        const { currentQuiz, currentQuestionIndex, selectedAnswer, answers, score, streak } = quizState;

        if (!currentQuiz || selectedAnswer === null) return;

        const currentQuestion = currentQuiz.questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

        const newAnswers = [...answers, selectedAnswer];
        const newScore = isCorrect ? score + 10 + (streak * 2) : score;
        const newStreak = isCorrect ? streak + 1 : 0;

        set((state) => ({
          quizState: {
            ...state.quizState,
            answers: newAnswers,
            score: newScore,
            streak: newStreak,
            selectedAnswer: null,
          }
        }));

        // Update admin panel in real-time
        if (currentUser) {
          const playerScore: PlayerScore = {
            userId: currentUser.id,
            userName: currentUser.name,
            quizId: currentQuiz.id,
            quizTitle: currentQuiz.title,
            score: newScore,
            totalQuestions: currentQuiz.questions.length,
            completedQuestions: newAnswers.length,
            currentStreak: newStreak,
            timeRemaining: quizState.timeRemaining,
            isFinished: false,
            lastUpdated: Date.now(),
          };
          get().updatePlayerScore(playerScore);
        }
      },

      nextQuestion: () => {
        const { quizState } = get();
        const { currentQuiz, currentQuestionIndex } = quizState;

        if (!currentQuiz) return;

        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
          set((state) => ({
            quizState: {
              ...state.quizState,
              currentQuestionIndex: state.quizState.currentQuestionIndex + 1,
              selectedAnswer: null,
            }
          }));
        } else {
          get().finishQuiz();
        }
      },

      startQuiz: () => set((state) => ({
        quizState: {
          ...state.quizState,
          isQuizActive: true,
          isQuizFinished: false,
          score: 0,
          streak: 0,
          answers: [],
          currentQuestionIndex: 0,
          selectedAnswer: null,
        }
      })),

      finishQuiz: () => {
        const { quizState, currentUser } = get();
        const { currentQuiz, score, answers } = quizState;

        if (!currentQuiz || !currentUser) return;

        const finalScore: PlayerScore = {
          userId: currentUser.id,
          userName: currentUser.name,
          quizId: currentQuiz.id,
          quizTitle: currentQuiz.title,
          score,
          totalQuestions: currentQuiz.questions.length,
          completedQuestions: answers.length,
          currentStreak: 0,
          timeRemaining: quizState.timeRemaining,
          isFinished: true,
          lastUpdated: Date.now(),
        };

        set((state) => ({
          quizState: { ...state.quizState, isQuizActive: false, isQuizFinished: true },
          leaderboard: [...state.leaderboard, finalScore].sort((a, b) => b.score - a.score).slice(0, 100),
        }));

        // Update admin
        get().updatePlayerScore(finalScore);
      },

      resetQuiz: () => set({
        quizState: initialQuizState,
      }),

      decrementTime: () => set((state) => {
        const newTime = Math.max(0, state.quizState.timeRemaining - 1);
        if (newTime === 0 && state.quizState.isQuizActive) {
          return {
            quizState: {
              ...state.quizState,
              timeRemaining: 0,
              isQuizActive: false,
              isQuizFinished: true,
            }
          };
        }
        return {
          quizState: { ...state.quizState, timeRemaining: newTime }
        };
      }),

      // Admin
      connectedPlayers: [],
      updatePlayerScore: (score) => set((state) => {
        const existingIndex = state.connectedPlayers.findIndex(p => p.userId === score.userId);
        let newPlayers;
        if (existingIndex >= 0) {
          newPlayers = [...state.connectedPlayers];
          newPlayers[existingIndex] = score;
        } else {
          newPlayers = [...state.connectedPlayers, score];
        }
        return { connectedPlayers: newPlayers.sort((a, b) => b.score - a.score) };
      }),
      removePlayer: (userId) => set((state) => ({
        connectedPlayers: state.connectedPlayers.filter(p => p.userId !== userId)
      })),
      setConnectedPlayers: (players) => set({ connectedPlayers: players }),

      // Leaderboard
      leaderboard: [],
      addToLeaderboard: (score) => set((state) => ({
        leaderboard: [...state.leaderboard, score].sort((a, b) => b.score - a.score).slice(0, 100)
      })),

      // View
      currentView: 'home',
      setCurrentView: (view) => set({ currentView: view }),
    }),
    {
      name: 'debugx-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        leaderboard: state.leaderboard,
      }),
    }
  )
);
