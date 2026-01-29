import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 50, suffix: '+', label: 'Sports disponibles', color: '#1aff6e' },
  { value: 10, suffix: 'M+', label: 'Paris placés', color: '#00d4ff' },
  { value: 99.9, suffix: '%', label: 'Uptime garanti', color: '#8b5cf6', isDecimal: true },
  { value: 2, suffix: 'M+', label: 'Joueurs actifs', color: '#ffa502' },
];

export function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          
          // Animate counters
          stats.forEach((stat, index) => {
            const duration = 1500;
            const steps = 60;
            const increment = stat.value / steps;
            let current = 0;
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setCounts(prev => {
                const newCounts = [...prev];
                newCounts[index] = stat.isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current);
                return newCounts;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('statistics');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="statistics" className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(26, 255, 110, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26, 255, 110, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Animated Glow Points */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: stats[i % stats.length].color,
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animation: `pulse-glow 3s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              {/* Number */}
              <div
                className="text-5xl lg:text-6xl font-black mb-2 transition-all duration-300"
                style={{
                  color: stat.color,
                  textShadow: `0 0 40px ${stat.color}50`,
                }}
              >
                <span
                  className="inline-block transition-transform duration-300"
                  style={{
                    transform: isVisible ? 'rotateX(0deg)' : 'rotateX(90deg)',
                    transitionDelay: `${200 + index * 150}ms`,
                  }}
                >
                  {stat.isDecimal ? counts[index].toFixed(1) : counts[index]}
                </span>
                <span className="text-3xl lg:text-4xl">{stat.suffix}</span>
              </div>

              {/* Label */}
              <div
                className={`text-[#b3b3b3] text-sm font-medium uppercase tracking-wider transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                {stat.label}
              </div>

              {/* Underline */}
              <div
                className={`mx-auto mt-4 h-0.5 rounded-full transition-all duration-700 ${
                  isVisible ? 'w-12 opacity-100' : 'w-0 opacity-0'
                }`}
                style={{
                  backgroundColor: stat.color,
                  transitionDelay: `${600 + index * 150}ms`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }
      `}</style>
    </section>
  );
}
