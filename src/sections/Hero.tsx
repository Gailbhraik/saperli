import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Trophy, Users, Radio, Gamepad2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  currency: string;
  isLoggedIn: boolean;
}

interface HeroProps {
  user: User;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
  onViewAllBets?: () => void;
}

export function Hero({ user, onOpenAuth, onViewAllBets }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }

    const particles: Particle[] = [];
    const particleCount = 80;
    const connectionDistance = 120;
    const mouseRadius = 150;
    const colors = ['rgba(26, 255, 110, 0.6)', 'rgba(0, 212, 255, 0.6)', 'rgba(139, 92, 246, 0.6)'];

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius;
          particle.vx += (dx / distance) * force * 0.5;
          particle.vy += (dy / distance) * force * 0.5;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(26, 255, 110, ${0.15 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const stats = [
    { icon: Trophy, label: 'LIGUES', value: 'LEC & LFL' },
    { icon: Gamepad2, label: 'MATCHS', value: '50+' },
    { icon: Radio, label: 'LIVE', value: '24/7' },
  ];

  const leagues = [
    { name: 'LEC', flag: '🇪🇺', color: '#00d4ff' },
    { name: 'LFL', flag: '🇫🇷', color: '#0055A4' },
    { name: 'LCK', flag: '🇰🇷', color: '#e31c79' },
    { name: 'LPL', flag: '🇨🇳', color: '#ff6b35' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient Orbs */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)',
            top: '10%',
            left: '5%',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
            bottom: '10%',
            right: '10%',
            animation: 'float 15s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.4) 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12 items-center min-h-[70vh]">
          <div className="space-y-8">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-3 px-4 py-2 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-full transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <Gamepad2 className="w-4 h-4 text-[#00d4ff]" />
              <span className="text-[#00d4ff] text-sm font-semibold">
                PARIS ESPORT - LEAGUE OF LEGENDS
              </span>
            </div>

            {/* Title */}
            <h1 className="space-y-2">
              {['PARIEZ SUR', 'LA LEC & LFL'].map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={`block text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight transition-all duration-800 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{
                    transitionDelay: `${400 + lineIndex * 100}ms`,
                    textShadow: '0 0 40px rgba(0, 212, 255, 0.3)',
                  }}
                >
                  {line}
                </div>
              ))}
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-[#b3b3b3] max-w-xl leading-relaxed transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              Les meilleures cotes sur tous les matchs de League of Legends. 
              LEC, LFL, LCK, LPL et plus encore. Paris en direct et cash-out instantané.
            </p>

            {/* League Badges */}
            <div
              className={`flex flex-wrap gap-3 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              {leagues.map((league) => (
                <div
                  key={league.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                  style={{ 
                    backgroundColor: `${league.color}15`,
                    borderColor: `${league.color}40`
                  }}
                >
                  <span>{league.flag}</span>
                  <span className="font-semibold text-sm" style={{ color: league.color }}>
                    {league.name}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              {user.isLoggedIn ? (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-bold text-lg px-8 py-6 hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] transition-all duration-300 group relative overflow-hidden"
                  onClick={onViewAllBets}
                >
                  <span className="relative z-10 flex items-center">
                    VOIR TOUS LES PARIS
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-bold text-lg px-8 py-6 hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] transition-all duration-300 group relative overflow-hidden"
                  onClick={() => onOpenAuth?.('register')}
                >
                  <span className="relative z-10 flex items-center">
                    <Zap className="mr-2 w-5 h-5" />
                    COMMENCER - 1000€ OFFERTS
                  </span>
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-[#2a2a2a] text-white hover:bg-white/5 hover:border-[#3a3a3a] text-lg px-8 py-6"
                onClick={() => document.getElementById('live')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Radio className="mr-2 w-5 h-5 text-red-500" />
                MATCHS EN DIRECT
              </Button>
            </div>

            {/* Stats */}
            <div
              className={`flex flex-wrap gap-8 pt-8 transition-all duration-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '1100ms' }}
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-[#00d4ff]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-[#666] font-medium tracking-wider">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Featured Match Card */}
          <div
            className={`hidden lg:flex justify-center items-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/30 to-[#8b5cf6]/30 rounded-3xl blur-3xl" />
              
              {/* Main Card */}
              <div className="relative bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 w-80">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇪🇺</span>
                    <span className="text-[#00d4ff] font-semibold">LEC Winter 2025</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-500 text-xs font-semibold">LIVE</span>
                  </div>
                </div>

                {/* Teams */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                        <span className="text-2xl">🦁</span>
                      </div>
                      <span className="text-white font-bold text-lg">G2 Esports</span>
                    </div>
                    <span className="text-3xl font-black text-white">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                        <span className="text-2xl">🦊</span>
                      </div>
                      <span className="text-white font-bold text-lg">Fnatic</span>
                    </div>
                    <span className="text-3xl font-black text-white">0</span>
                  </div>
                </div>

                {/* Game Info */}
                <div className="text-center mb-6 py-3 bg-[#0a0a0a] rounded-lg">
                  <span className="text-[#666] text-sm">Game 2 • 24:35</span>
                </div>

                {/* Odds */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 px-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#00d4ff] transition-colors">
                    <span className="text-[#666] text-xs block">G2</span>
                    <span className="text-white font-bold text-xl">1.45</span>
                  </button>
                  <button className="py-3 px-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#00d4ff] transition-colors">
                    <span className="text-[#666] text-xs block">Fnatic</span>
                    <span className="text-white font-bold text-xl">2.75</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -30px); }
          50% { transform: translate(-20px, 20px); }
          75% { transform: translate(20px, 10px); }
        }
      `}</style>
    </section>
  );
}
