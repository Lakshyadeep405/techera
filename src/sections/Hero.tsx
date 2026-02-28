import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Timer, BarChart3, Trophy, Sparkles, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/quizStore';

// AI-themed background with mechanical robot
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Robot state
    const robot = {
      x: 0,
      y: 0,
      direction: 1,
      walkCycle: 0,
      eyeGlow: 0,
    };

    // Floating gears
    const gears: Array<{ x: number; y: number; radius: number; teeth: number; speed: number; rotation: number }> = [];
    // Circuit nodes
    const nodes: Array<{ x: number; y: number; pulse: number; connections: number[] }> = [];
    // Binary rain columns
    const binaryColumns: Array<{ x: number; chars: string[]; y: number; speed: number }> = [];

    const init = () => {
      robot.y = canvas.height * 0.72;
      robot.x = canvas.width * 0.15;

      // Create gears
      gears.length = 0;
      for (let i = 0; i < 6; i++) {
        gears.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.6,
          radius: 15 + Math.random() * 25,
          teeth: Math.floor(6 + Math.random() * 6),
          speed: (Math.random() - 0.5) * 0.02,
          rotation: Math.random() * Math.PI * 2,
        });
      }

      // Create circuit nodes
      nodes.length = 0;
      for (let i = 0; i < 20; i++) {
        const conns: number[] = [];
        const numConns = Math.floor(1 + Math.random() * 2);
        for (let j = 0; j < numConns; j++) {
          conns.push(Math.floor(Math.random() * 20));
        }
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          pulse: Math.random() * Math.PI * 2,
          connections: conns,
        });
      }

      // Binary rain
      binaryColumns.length = 0;
      for (let i = 0; i < 15; i++) {
        const chars: string[] = [];
        for (let j = 0; j < 8; j++) {
          chars.push(Math.random() > 0.5 ? '1' : '0');
        }
        binaryColumns.push({
          x: Math.random() * canvas.width,
          chars,
          y: Math.random() * canvas.height,
          speed: 0.3 + Math.random() * 0.7,
        });
      }
    };

    const drawGear = (x: number, y: number, radius: number, teeth: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#6B46C1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      const innerR = radius * 0.7;
      const outerR = radius;
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2;
        const midAngle = ((i + 0.25) / teeth) * Math.PI * 2;
        const midAngle2 = ((i + 0.75) / teeth) * Math.PI * 2;
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
        }
        ctx.lineTo(Math.cos(midAngle) * outerR, Math.sin(midAngle) * outerR);
        ctx.lineTo(Math.cos(midAngle2) * outerR, Math.sin(midAngle2) * outerR);
        ctx.lineTo(Math.cos(nextAngle) * innerR, Math.sin(nextAngle) * innerR);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    const drawRobot = (x: number, y: number, walkPhase: number, eyeGlow: number) => {
      ctx.save();
      ctx.translate(x, y);

      // Body glow
      const glow = ctx.createRadialGradient(0, -30, 5, 0, -30, 60);
      glow.addColorStop(0, `rgba(107, 70, 193, ${0.15 + eyeGlow * 0.1})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(-60, -90, 120, 120);

      const legOffset = Math.sin(walkPhase) * 8;

      // Legs
      ctx.strokeStyle = '#4A5568';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-10, 10);
      ctx.lineTo(-12 - legOffset, 40);
      ctx.lineTo(-14 - legOffset, 50);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(12 + legOffset, 40);
      ctx.lineTo(14 + legOffset, 50);
      ctx.stroke();

      // Feet
      ctx.fillStyle = '#2D3748';
      ctx.fillRect(-20 - legOffset, 48, 12, 5);
      ctx.fillRect(8 + legOffset, 48, 12, 5);

      // Body
      ctx.fillStyle = '#2D3748';
      ctx.beginPath();
      ctx.roundRect(-20, -35, 40, 48, 6);
      ctx.fill();
      ctx.strokeStyle = '#6B46C1';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Chest light
      ctx.fillStyle = `rgba(159, 122, 234, ${0.5 + eyeGlow * 0.5})`;
      ctx.beginPath();
      ctx.arc(0, -15, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(159, 122, 234, ${0.2 + eyeGlow * 0.2})`;
      ctx.beginPath();
      ctx.arc(0, -15, 8, 0, Math.PI * 2);
      ctx.fill();

      // Circuit lines on body
      ctx.strokeStyle = `rgba(107, 70, 193, ${0.3 + eyeGlow * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-10, -25);
      ctx.lineTo(-15, -20);
      ctx.lineTo(-15, -5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, -25);
      ctx.lineTo(15, -20);
      ctx.lineTo(15, -5);
      ctx.stroke();

      // Arms with swing
      const armSwing = Math.sin(walkPhase) * 10;
      ctx.strokeStyle = '#4A5568';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, -25);
      ctx.lineTo(-30, -15 + armSwing);
      ctx.lineTo(-28, 0 + armSwing);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20, -25);
      ctx.lineTo(30, -15 - armSwing);
      ctx.lineTo(28, 0 - armSwing);
      ctx.stroke();

      // Hands
      ctx.fillStyle = '#6B46C1';
      ctx.beginPath();
      ctx.arc(-28, 0 + armSwing, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(28, 0 - armSwing, 3, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#2D3748';
      ctx.beginPath();
      ctx.roundRect(-16, -60, 32, 26, 5);
      ctx.fill();
      ctx.strokeStyle = '#6B46C1';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Antenna
      ctx.strokeStyle = '#4A5568';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(0, -70);
      ctx.stroke();
      ctx.fillStyle = `rgba(246, 135, 179, ${0.6 + eyeGlow * 0.4})`;
      ctx.beginPath();
      ctx.arc(0, -72, 3, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      const eyeBrightness = 0.7 + eyeGlow * 0.3;
      ctx.fillStyle = `rgba(56, 178, 172, ${eyeBrightness})`;
      ctx.shadowColor = 'rgba(56, 178, 172, 0.8)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(-7, -50, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7, -50, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Mouth (LED strip)
      for (let i = -2; i <= 2; i++) {
        ctx.fillStyle = `rgba(159, 122, 234, ${0.3 + eyeGlow * 0.4})`;
        ctx.fillRect(i * 5 - 1.5, -41, 3, 2);
      }

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;
      ctx.fillStyle = 'rgba(26, 32, 44, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background overlay periodically
      if (Math.floor(time * 60) % 30 === 0) {
        const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bg.addColorStop(0, 'rgba(26, 32, 44, 0.95)');
        bg.addColorStop(0.5, 'rgba(45, 55, 72, 0.95)');
        bg.addColorStop(1, 'rgba(26, 32, 44, 0.95)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw circuit connections
      ctx.strokeStyle = 'rgba(107, 70, 193, 0.08)';
      ctx.lineWidth = 1;
      nodes.forEach((node, i) => {
        node.pulse += 0.02;
        node.connections.forEach(j => {
          if (j < nodes.length && j !== i) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            // Right-angle circuit paths
            const midX = (node.x + nodes[j].x) / 2;
            ctx.lineTo(midX, node.y);
            ctx.lineTo(midX, nodes[j].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        });

        // Pulsing node
        const pulseAlpha = 0.2 + Math.sin(node.pulse) * 0.15;
        ctx.fillStyle = `rgba(159, 122, 234, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw gears
      gears.forEach(gear => {
        gear.rotation += gear.speed;
        drawGear(gear.x, gear.y, gear.radius, gear.teeth, gear.rotation, 0.12);
      });

      // Binary rain
      ctx.font = '10px monospace';
      binaryColumns.forEach(col => {
        col.y += col.speed;
        if (col.y > canvas.height + 100) {
          col.y = -80;
          col.x = Math.random() * canvas.width;
        }
        col.chars.forEach((ch, i) => {
          const alpha = 0.06 + (i / col.chars.length) * 0.08;
          ctx.fillStyle = `rgba(56, 178, 172, ${alpha})`;
          ctx.fillText(ch, col.x, col.y + i * 12);
        });
      });

      // Robot walking
      robot.walkCycle += 0.04;
      robot.x += 0.3 * robot.direction;
      robot.eyeGlow = (Math.sin(time * 2) + 1) / 2;

      if (robot.x > canvas.width + 50) {
        robot.direction = -1;
      } else if (robot.x < -50) {
        robot.direction = 1;
      }

      ctx.save();
      if (robot.direction < 0) {
        ctx.translate(robot.x * 2, 0);
        ctx.scale(-1, 1);
      }
      drawRobot(robot.x, robot.y, robot.walkCycle, robot.eyeGlow);
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    resize();
    init();
    animate();

    const handleResize = () => { resize(); init(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(135deg, #0F1419 0%, #1A202C 40%, #171923 100%)' }}
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
