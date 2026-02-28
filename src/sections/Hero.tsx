import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Timer, BarChart3, Trophy, Sparkles, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/quizStore';

// Particle background component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const colors = ['#6B46C1', '#D53F8C', '#9F7AEA', '#3182CE'];
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(26, 32, 44, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(107, 70, 193, ${0.2 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(135deg, #1A202C 0%, #2D3748 50%, #1A202C 100%)' }}
    />
  );
};

export default function Hero() {
  const { setCurrentView, currentUser } = useQuizStore();
  const [neonFlicker, setNeonFlicker] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  // Neon flicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setNeonFlicker(Math.random() * 0.2 + 0.8);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const titleLetters = 'DEBUGX'.split('');

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticleBackground />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
      >
        {/* Event Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B46C1]/20 border border-[#6B46C1]/30 text-[#9F7AEA] text-sm font-medium">
            <Code2 className="w-4 h-4" />
            Coding Contest Platform
          </span>
        </motion.div>

        {/* Main Title with 3D Character Reveal */}
        <div className="mb-6 perspective-1000">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight">
            {titleLetters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ rotateX: 90, z: -500, opacity: 0 }}
                animate={{ rotateX: 0, z: 0, opacity: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.1 + index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block bg-gradient-to-r from-[#9F7AEA] via-[#D53F8C] to-[#F687B3] bg-clip-text text-transparent"
                style={{
                  textShadow: '0 0 60px rgba(159, 122, 234, 0.5)',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Subtitle with Neon Flicker */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: neonFlicker }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-medium mb-4"
          style={{
            color: '#F687B3',
            textShadow: `0 0 20px rgba(246, 135, 179, ${neonFlicker}), 0 0 40px rgba(246, 135, 179, ${neonFlicker * 0.5})`,
          }}
        >
          Code Fast, Debug Faster
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Real problems. Real-time judging. One epic contest. Compete head-to-head,
          solve algorithmic challenges, and climb the leaderboard.
        </motion.p>

        {/* Quiz Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {[
            { icon: BarChart3, value: '8+', label: 'Languages' },
            { icon: Timer, value: 'Live', label: 'Judging' },
            { icon: Trophy, value: '∞', label: 'Contests' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D3748]/50 border border-white/5"
            >
              <stat.icon className="w-4 h-4 text-[#9F7AEA]" />
              <span className="font-bold text-white">{stat.value}</span>
              <span className="text-sm text-gray-400">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.68, -0.6, 0.32, 1.6] }}
        >
          <Button
            onClick={() => setCurrentView('contest')}
            size="lg"
            className="group bg-gradient-to-r from-[#6B46C1] to-[#D53F8C] hover:from-[#553C9A] hover:to-[#B83280] text-white font-bold text-lg px-12 py-7 rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
          >
            <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            ENTER CONTEST
          </Button>
        </motion.div>

        {/* User welcome message */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B46C1]/20 border border-[#6B46C1]/30"
          >
            <Sparkles className="w-4 h-4 text-[#9F7AEA]" />
            <span className="text-sm text-[#9F7AEA]">
              Welcome, <span className="font-semibold">{currentUser.name}</span>!
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A202C] to-transparent" />
    </section>
  );
}
