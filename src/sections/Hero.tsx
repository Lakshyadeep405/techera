import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Timer, BarChart3, Trophy, Sparkles, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/quizStore';

// Modern 2D Robot SVG that waves on hover
const Robot = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <motion.svg
      width="280"
      height="320"
      viewBox="0 0 280 320"
      fill="none"
      initial={{ y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="drop-shadow-lg"
    >
      {/* Shadow under robot */}
      <ellipse cx="140" cy="310" rx="60" ry="8" fill="black" opacity="0.06" />

      {/* Left Leg */}
      <motion.g
        animate={isHovered ? { rotate: [0, -3, 3, 0] } : { rotate: 0 }}
        transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
        style={{ originX: '110px', originY: '230px' }}
      >
        <rect x="100" y="230" width="22" height="50" rx="6" fill="#222" stroke="#444" strokeWidth="1.5" />
        <rect x="92" y="275" width="35" height="14" rx="5" fill="#111" stroke="#444" strokeWidth="1.5" />
      </motion.g>

      {/* Right Leg */}
      <motion.g
        animate={isHovered ? { rotate: [0, 3, -3, 0] } : { rotate: 0 }}
        transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0, delay: 0.1 }}
        style={{ originX: '158px', originY: '230px' }}
      >
        <rect x="158" y="230" width="22" height="50" rx="6" fill="#222" stroke="#444" strokeWidth="1.5" />
        <rect x="153" y="275" width="35" height="14" rx="5" fill="#111" stroke="#444" strokeWidth="1.5" />
      </motion.g>

      {/* Body */}
      <rect x="85" y="130" width="110" height="105" rx="16" fill="#1a1a1a" stroke="#333" strokeWidth="2" />

      {/* Body panel lines */}
      <line x1="105" y1="145" x2="105" y2="220" stroke="#333" strokeWidth="1" />
      <line x1="175" y1="145" x2="175" y2="220" stroke="#333" strokeWidth="1" />
      <line x1="100" y1="175" x2="180" y2="175" stroke="#333" strokeWidth="0.5" />

      {/* Chest circle (reactor) */}
      <circle cx="140" cy="170" r="14" fill="none" stroke="#444" strokeWidth="1.5" />
      <circle cx="140" cy="170" r="8" fill="none" stroke="#555" strokeWidth="1" />
      <motion.circle
        cx="140"
        cy="170"
        r="4"
        fill="#22c55e"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Left Arm */}
      <motion.g
        animate={isHovered
          ? { rotate: [0, -45, -35, -45, -30, -45, 0] }
          : { rotate: 0 }
        }
        transition={{
          duration: 1.5,
          repeat: isHovered ? Infinity : 0,
          ease: 'easeInOut',
        }}
        style={{ originX: '85px', originY: '145px' }}
      >
        <rect x="50" y="135" width="40" height="20" rx="8" fill="#222" stroke="#444" strokeWidth="1.5" />
        <rect x="38" y="155" width="18" height="45" rx="8" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
        <circle cx="47" cy="205" r="10" fill="#222" stroke="#444" strokeWidth="1.5" />
        <motion.g
          animate={isHovered ? { rotate: [0, 10, -5, 10, 0] } : {}}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        >
          <rect x="38" y="212" width="5" height="10" rx="2.5" fill="#333" />
          <rect x="44" y="213" width="5" height="12" rx="2.5" fill="#333" />
          <rect x="50" y="212" width="5" height="10" rx="2.5" fill="#333" />
        </motion.g>
      </motion.g>

      {/* Right Arm */}
      <motion.g
        animate={isHovered
          ? { rotate: [0, 45, 35, 45, 30, 45, 0] }
          : { rotate: 0 }
        }
        transition={{
          duration: 1.5,
          repeat: isHovered ? Infinity : 0,
          ease: 'easeInOut',
          delay: 0.2,
        }}
        style={{ originX: '195px', originY: '145px' }}
      >
        <rect x="190" y="135" width="40" height="20" rx="8" fill="#222" stroke="#444" strokeWidth="1.5" />
        <rect x="224" y="155" width="18" height="45" rx="8" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
        <circle cx="233" cy="205" r="10" fill="#222" stroke="#444" strokeWidth="1.5" />
        <motion.g
          animate={isHovered ? { rotate: [0, -10, 5, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        >
          <rect x="225" y="212" width="5" height="10" rx="2.5" fill="#333" />
          <rect x="231" y="213" width="5" height="12" rx="2.5" fill="#333" />
          <rect x="237" y="212" width="5" height="10" rx="2.5" fill="#333" />
        </motion.g>
      </motion.g>

      {/* Neck */}
      <rect x="125" y="110" width="30" height="25" rx="4" fill="#222" stroke="#444" strokeWidth="1" />

      {/* Head */}
      <rect x="95" y="50" width="90" height="65" rx="18" fill="#1a1a1a" stroke="#333" strokeWidth="2" />

      {/* Visor / Face plate */}
      <rect x="108" y="65" width="64" height="30" rx="10" fill="#0d0d0d" stroke="#444" strokeWidth="1" />

      {/* Eyes */}
      <motion.circle
        cx="125" cy="80" r="6" fill="#22c55e"
        animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
      />
      <motion.circle
        cx="155" cy="80" r="6" fill="#22c55e"
        animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, repeat: isHovered ? Infinity : 0, repeatDelay: 1, delay: 0.05 }}
      />

      {/* Eye pupils */}
      <motion.circle
        cx="125" cy="80" r="2.5" fill="#0a0a0a"
        animate={isHovered ? { cx: [125, 127, 123, 125] } : {}}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
      />
      <motion.circle
        cx="155" cy="80" r="2.5" fill="#0a0a0a"
        animate={isHovered ? { cx: [155, 157, 153, 155] } : {}}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Mouth */}
      <motion.path
        d={isHovered ? "M 125 95 Q 140 108 155 95" : "M 125 97 Q 140 100 155 97"}
        stroke="#444"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        transition={{ duration: 0.3 }}
      />

      {/* Antenna */}
      <line x1="140" y1="50" x2="140" y2="30" stroke="#444" strokeWidth="2" />
      <motion.circle
        cx="140" cy="25" r="5" fill="#22c55e"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Ear panels */}
      <rect x="87" y="68" width="12" height="20" rx="3" fill="#222" stroke="#444" strokeWidth="1" />
      <rect x="181" y="68" width="12" height="20" rx="3" fill="#222" stroke="#444" strokeWidth="1" />
    </motion.svg>
  );
};

export default function Hero() {
  const { setCurrentView, currentUser } = useQuizStore();
  const [isRobotHovered, setIsRobotHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const titleLetters = 'DEBUGX'.split('');

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Graph paper grid - green lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.15) 1px, transparent 1px),
            linear-gradient(rgba(34, 197, 94, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        }}
      />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        {/* Event Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-black/60 text-sm font-medium tracking-wider">
            <Code2 className="w-4 h-4" />
            Coding Contest Platform
          </span>
        </motion.div>

        {/* Main Title */}
        <div className="mb-4">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight">
            {titleLetters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block text-black"
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl font-light mb-2 text-black/40 tracking-wide"
        >
          Code Fast, Debug Faster
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm sm:text-base text-black/40 max-w-xl mx-auto mb-8"
        >
          Real problems. Real-time judging. One epic contest. Compete head-to-head,
          solve algorithmic challenges, and climb the leaderboard.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {[
            { icon: BarChart3, value: '8+', label: 'Languages' },
            { icon: Timer, value: 'Live', label: 'Judging' },
            { icon: Trophy, value: '∞', label: 'Contests' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10"
            >
              <stat.icon className="w-4 h-4 text-black/50" />
              <span className="font-bold text-black/80">{stat.value}</span>
              <span className="text-sm text-black/40">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Robot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          onMouseEnter={() => setIsRobotHovered(true)}
          onMouseLeave={() => setIsRobotHovered(false)}
          className="cursor-pointer relative mb-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isRobotHovered ? 0 : 0.4 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-black whitespace-nowrap"
          >
            hover me 👋
          </motion.p>
          <Robot isHovered={isRobotHovered} />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.68, -0.6, 0.32, 1.6] }}
        >
          <Button
            onClick={() => setCurrentView('contest')}
            size="lg"
            className="group bg-black text-white hover:bg-black/85 font-bold text-lg px-12 py-7 rounded-full shadow-lg shadow-black/10 hover:shadow-black/20 transition-all duration-300"
          >
            <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            ENTER CONTEST
          </Button>
        </motion.div>

        {/* User welcome */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10"
          >
            <Sparkles className="w-4 h-4 text-black/40" />
            <span className="text-sm text-black/50">
              Welcome, <span className="font-semibold text-black/80">{currentUser.name}</span>!
            </span>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
