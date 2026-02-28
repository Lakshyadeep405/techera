import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import Categories from '@/sections/Categories';
import QuizInterface from '@/sections/QuizInterface';
import AdminPanel from '@/sections/AdminPanel';
import Leaderboard from '@/sections/Leaderboard';
import ContestArena from '@/sections/ContestArena';
import Footer from '@/sections/Footer';
import { useQuizStore } from '@/store/quizStore';

// Access Denied Component
const AccessDenied = () => {
  const { setCurrentView } = useQuizStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A202C] px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400 mb-6">
          You need admin privileges to access this page.
        </p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] text-white font-semibold"
        >
          Go Home
        </button>
      </motion.div>
    </div>
  );
};

// Protected Route for Admin-only pages
const AdminOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useQuizStore();

  if (!currentUser?.isAdmin) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

// Main content component based on current view
const MainContent = () => {
  const { currentView } = useQuizStore();

  switch (currentView) {
    case 'quiz':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <QuizInterface />
        </motion.div>
      );

    case 'contest':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ContestArena />
        </motion.div>
      );

    case 'admin':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AdminOnlyRoute>
            <AdminPanel />
          </AdminOnlyRoute>
        </motion.div>
      );

    case 'leaderboard':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-[#1A202C] min-h-screen"
        >
          <AdminOnlyRoute>
            <Leaderboard />
          </AdminOnlyRoute>
        </motion.div>
      );

    case 'categories':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-[#1A202C] min-h-screen"
        >
          <div className="pt-20">
            <Categories />
          </div>
          <Footer />
        </motion.div>
      );

    case 'home':
    default:
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-[#1A202C]"
        >
          <Hero />
          <Categories />
          <Footer />
        </motion.div>
      );
  }
};

function App() {
  const { currentView } = useQuizStore();

  // Smooth scroll behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen bg-[#1A202C] text-white font-sans">
      {/* Global Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A202C] via-[#2D3748] to-[#1A202C]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6B46C1]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D53F8C]/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <MainContent key={currentView} />
        </AnimatePresence>
      </main>

      {/* Toast notifications container */}
      <div id="toast-container" className="fixed bottom-4 right-4 z-50" />
    </div>
  );
}

export default App;
