import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Zap, Tv, Check } from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

const features: Feature[] = [
  {
    id: 'odds',
    icon: TrendingUp,
    title: 'Cotes Compétitives',
    description: 'Les meilleures cotes du marché',
    benefits: ['Analyse algorithmique en temps réel', 'Garantie de cotes optimales', 'Mise à jour continue'],
    color: '#1aff6e',
  },
  {
    id: 'cashout',
    icon: Zap,
    title: 'Cash-Out Instantané',
    description: 'Retirez vos gains à tout moment',
    benefits: ['Disponible 24h/24, 7j/7', 'Zéro délai de traitement', 'Contrôle total de vos paris'],
    color: '#00d4ff',
  },
  {
    id: 'streaming',
    icon: Tv,
    title: 'Streaming Live',
    description: 'Regardez et pariez en direct',
    benefits: ['Multi-stream disponible', 'HD sans latence', 'Tous les matchs majeurs'],
    color: '#8b5cf6',
  },
];

export function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('features');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <section id="features" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1aff6e]/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2
            className={`text-4xl md:text-5xl font-black text-white mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            POURQUOI CHOISIR{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1aff6e] to-[#00d9a3]">
              BETPRO
            </span>
            ?
          </h2>
          <p
            className={`text-[#b3b3b3] text-lg max-w-xl mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Une expérience de paris incomparable
          </p>
        </div>

        {/* Connection Line SVG */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-32 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              ref={pathRef}
              d="M 100 50 Q 300 20 500 50 Q 700 80 900 50 Q 1000 35 1100 50"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={isVisible ? 0 : pathLength}
              style={{
                transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '500ms',
                filter: 'drop-shadow(0 0 10px rgba(26, 255, 110, 0.5))',
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1aff6e" />
                <stop offset="50%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`group relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: `${800 + index * 200}ms` }}
              onMouseEnter={() => setHoveredId(feature.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="relative bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 h-full transition-all duration-500"
                style={{
                  transform: hoveredId === feature.id ? 'translateY(-15px)' : 'translateY(0)',
                  boxShadow:
                    hoveredId === feature.id
                      ? `0 20px 50px -15px ${feature.color}40`
                      : 'none',
                  borderColor: hoveredId === feature.id ? feature.color : undefined,
                }}
              >
                {/* Icon */}
                <div
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500"
                  style={{
                    backgroundColor: `${feature.color}15`,
                    transform: hoveredId === feature.id ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                  }}
                >
                  <feature.icon
                    className="w-8 h-8 transition-colors duration-300"
                    style={{ color: feature.color }}
                  />
                  
                  {/* Pulse Ring */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      animation: hoveredId === feature.id ? 'pulse-ring 2s ease-out infinite' : 'none',
                      border: `2px solid ${feature.color}`,
                    }}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-[#b3b3b3] mb-6">{feature.description}</p>

                {/* Benefits */}
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className="flex items-center gap-3 text-sm text-[#b3b3b3]"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${feature.color}20` }}
                      >
                        <Check className="w-3 h-3" style={{ color: feature.color }} />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Bottom Glow */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                    boxShadow: `0 0 20px ${feature.color}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
