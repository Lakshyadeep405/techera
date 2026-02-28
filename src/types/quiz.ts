export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  questions: Question[];
  timeLimit: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface PlayerScore {
  userId: string;
  userName: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  completedQuestions: number;
  currentStreak: number;
  timeRemaining: number;
  isFinished: boolean;
  lastUpdated: number;
}

export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  answers: number[];
  score: number;
  timeRemaining: number;
  isQuizActive: boolean;
  isQuizFinished: boolean;
  streak: number;
}

export interface AdminState {
  connectedPlayers: PlayerScore[];
  isMonitoring: boolean;
}
