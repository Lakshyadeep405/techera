import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Menu, X, User, BarChart3, Home, Layers, Lock, LogOut, Swords } from 'lucide-react';
import { useQuizStore } from '@/store/quizStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// Admin secret code
const ADMIN_CODE = 'DEBUGX2024';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState('');
  const { currentUser, setCurrentUser, setCurrentView, currentView } = useQuizStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    if (userName.trim()) {
      setCurrentUser({
        id: Date.now().toString(),
        name: userName.trim(),
        isAdmin: false,
      });
      setUserName('');
    }
  };

  const handleAdminLogin = () => {
    if (adminCode === ADMIN_CODE) {
      setCurrentUser({
        id: 'admin-' + Date.now().toString(),
        name: 'Admin',
        isAdmin: true,
      });
      setAdminCode('');
      setShowAdminLogin(false);
      setAdminError('');
      setCurrentView('admin');
    } else {
      setAdminError('Invalid admin code');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Public nav links (no leaderboard)
  const publicNavLinks = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'categories', label: 'QUIZ', icon: Layers },
    { id: 'contest', label: 'CONTEST', icon: Swords },
  ];

  // Admin nav links (includes leaderboard)
  const adminNavLinks = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'categories', label: 'QUIZ', icon: Layers },
    { id: 'contest', label: 'CONTEST', icon: Swords },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: BarChart3 },
    { id: 'admin', label: 'ADMIN', icon: Lock },
  ];

  const navLinks = currentUser?.isAdmin ? adminNavLinks : publicNavLinks;

  const scrollToSection = (sectionId: string) => {
    setCurrentView(sectionId as any);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/90 backdrop-blur-xl border-b border-black/10 shadow-sm'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-black">
              DEBUGX
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, ease: 'backOut' }}
                onClick={() => scrollToSection(link.id)}
                className={`relative text-sm font-medium transition-colors ${currentView === link.id
                  ? 'text-black'
                  : 'text-black/40 hover:text-black'
                  }`}
              >
                {link.label}
                {currentView === link.id && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Login/User Section */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/5 border border-black/10">
                  <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm font-medium text-black">{currentUser.name}</span>
                  {currentUser.isAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-[#DD6B20]/20 text-[#DD6B20] text-xs">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-black/40 hover:text-black hover:bg-black/5 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Admin Login Button */}
                <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
                  <DialogTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 border border-black/10 text-black/50 hover:text-black hover:bg-black/10 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Admin
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111] border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                        <Lock className="w-6 h-6 text-[#DD6B20]" />
                        Admin Access
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <p className="text-sm text-gray-400">
                        Enter the admin code to access the admin panel and leaderboard.
                      </p>
                      <Input
                        type="password"
                        placeholder="Enter admin code"
                        value={adminCode}
                        onChange={(e) => {
                          setAdminCode(e.target.value);
                          setAdminError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                        className="bg-black border-white/10 text-white placeholder:text-white/30"
                      />
                      {adminError && (
                        <p className="text-red-400 text-sm">{adminError}</p>
                      )}
                      <Button
                        onClick={handleAdminLogin}
                        className="w-full bg-white text-black hover:bg-white/90 font-semibold"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Access Admin Panel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Regular User Login */}
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="bg-black text-white hover:bg-black/85 font-semibold px-6"
                      >
                        LOGIN
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111] border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-white">Enter Your Name</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        placeholder="Enter your name to start playing"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        className="bg-black border-white/10 text-white placeholder:text-white/30"
                      />
                      <Button
                        onClick={handleLogin}
                        className="w-full bg-white text-black hover:bg-white/90 font-semibold"
                      >
                        Start Playing
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === link.id
                    ? 'bg-[#6B46C1]/20 text-[#9F7AEA]'
                    : 'text-gray-300 hover:bg-white/5'
                    }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </button>
              ))}

              {!currentUser && (
                <div className="border-t border-white/10 pt-4 mt-2 space-y-2">
                  {/* Mobile Admin Login */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#2D3748] text-gray-300">
                        <Lock className="w-5 h-5" />
                        Admin Login
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#2D3748] border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Admin Access</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input
                          type="password"
                          placeholder="Enter admin code"
                          value={adminCode}
                          onChange={(e) => {
                            setAdminCode(e.target.value);
                            setAdminError('');
                          }}
                          className="bg-[#1A202C] border-white/10 text-white"
                        />
                        {adminError && (
                          <p className="text-red-400 text-sm">{adminError}</p>
                        )}
                        <Button
                          onClick={handleAdminLogin}
                          className="w-full bg-gradient-to-r from-[#DD6B20] to-[#D53F8C] text-white font-semibold"
                        >
                          Access Admin Panel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {currentUser ? (
                <div className="border-t border-white/10 pt-4 mt-2">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3182CE] to-[#38B2AC] flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-medium block">{currentUser.name}</span>
                      {currentUser.isAdmin && (
                        <span className="text-[#DD6B20] text-xs">Administrator</span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full mt-2 bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] text-white font-semibold"
                    >
                      LOGIN
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#2D3748] border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-white">Enter Your Name</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        className="bg-[#1A202C] border-white/10 text-white"
                      />
                      <Button
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] text-white font-semibold"
                      >
                        Start Playing
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
