import { useState, useEffect } from 'react';
import type { SportType } from '@/types';

interface Category {
  id: SportType;
  name: string;
  icon: string;
  description: string;
  subDescription: string;
  matchCount: number;
  color: string;
}

const categories: Category[] = [
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    description: '1000+ matchs par semaine',
    subDescription: 'Ligues majeures & championnats',
    matchCount: 156,
    color: '#1aff6e',
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    description: 'ATP, WTA & Grand Chelem',
    subDescription: 'Paris en direct set par set',
    matchCount: 89,
    color: '#00d4ff',
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    description: 'NBA, EuroLeague & plus',
    subDescription: 'Paris quart-temps',
    matchCount: 45,
    color: '#ff6b35',
  },
  {
    id: 'esports',
    name: 'Esports',
    icon: '🎮',
    description: 'LoL, CS2, Valorant...',
    subDescription: 'Tournois majeurs mondiaux',
    matchCount: 67,
    color: '#8b5cf6',
  },
];

export function SportsCategories() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('sports');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="sports" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1aff6e]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-black text-white mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            PARIEZ SUR VOTRE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1aff6e] to-[#00d9a3]">
              SPORT
            </span>
          </h2>
          <p
            className={`text-[#b3b3b3] text-lg max-w-xl mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            Des cotes compétitives sur tous les sports majeurs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`group relative transition-all duration-600 ${
                isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-3'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="relative bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 overflow-hidden transition-all duration-500 cursor-pointer h-full"
                style={{
                  transform: hoveredId === category.id ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow:
                    hoveredId === category.id
                      ? `0 20px 40px -10px ${category.color}30`
                      : 'none',
                  borderColor: hoveredId === category.id ? category.color : undefined,
                }}
              >
                {/* Gradient Background on Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}10 0%, transparent 60%)`,
                  }}
                />

                {/* Orbital Ring */}
                <div
                  className="absolute top-6 right-6 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    animation: hoveredId === category.id ? 'orbit 10s linear infinite' : 'none',
                  }}
                >
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      fill="none"
                      stroke={category.color}
                      strokeWidth="1"
                      strokeDasharray="5 5"
                      opacity="0.5"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="text-5xl mb-4 transition-transform duration-500"
                    style={{
                      transform: hoveredId === category.id ? 'rotate(360deg) scale(1.1)' : 'rotate(0)',
                    }}
                  >
                    {category.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>

                  {/* Description */}
                  <p className="text-[#b3b3b3] text-sm mb-1">{category.description}</p>
                  <p className="text-[#666] text-xs">{category.subDescription}</p>

                  {/* Match Count */}
                  <div
                    className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                    {category.matchCount} matchs aujourd'hui
                  </div>
                </div>

                {/* Corner Accent */}
                <div
                  className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
