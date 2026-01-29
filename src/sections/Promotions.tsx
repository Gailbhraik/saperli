import { useState, useEffect } from 'react';
import { Gift, Sparkles, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Promotions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('promotions');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const benefits = [
    'Dépôt minimum: 10€',
    'Bonus crédité instantanément',
    'Valable sur tous les sports',
  ];

  return (
    <section id="promotions" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1aff6e]/10 via-transparent to-[#00d9a3]/10" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#1aff6e]/10 rounded-full blur-[150px] -translate-y-1/2" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`relative bg-gradient-to-br from-[#141414] to-[#0f1110] border border-[#2a2a2a] rounded-3xl overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent, #1aff6e, transparent)',
                animation: isVisible ? 'border-shimmer 3s linear infinite' : 'none',
                backgroundSize: '200% 100%',
              }}
            />
            <div className="absolute inset-[1px] bg-gradient-to-br from-[#141414] to-[#0f1110] rounded-3xl" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-[1.2fr_1fr] gap-8 p-8 lg:p-12">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Eyebrow */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 bg-[#1aff6e]/10 border border-[#1aff6e]/30 rounded-full transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <Gift className="w-4 h-4 text-[#1aff6e]" />
                <span className="text-[#1aff6e] text-sm font-semibold">OFFRE DE BIENVENUE</span>
              </div>

              {/* Title */}
              <div
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <h2 className="text-5xl lg:text-6xl font-black text-white mb-2">
                  100€ DE{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1aff6e] to-[#00d9a3]">
                    BONUS
                  </span>
                </h2>
                <p className="text-xl text-[#b3b3b3]">Sur votre premier dépôt</p>
              </div>

              {/* Benefits */}
              <div
                className={`space-y-3 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '800ms' }}
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#1aff6e]/20 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#1aff6e]" />
                    </div>
                    <span className="text-[#b3b3b3]">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div
                className={`pt-4 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '1000ms' }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#1aff6e] to-[#00d9a3] text-[#0a0a0a] font-bold text-lg px-8 py-6 hover:shadow-[0_0_40px_rgba(26,255,110,0.5)] transition-all duration-300 group relative overflow-hidden"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span className="relative z-10">RÉCLAMER MON BONUS</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
              </div>

              {/* Terms */}
              <div
                className={`flex items-center gap-2 text-[#666] text-sm transition-all duration-700 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: '1200ms' }}
              >
                <Info className="w-4 h-4" />
                <span>*Conditions applicables. Jouez de manière responsable.</span>
              </div>
            </div>

            {/* Right Visual - 3D Cards */}
            <div
              className={`hidden lg:flex items-center justify-center perspective-[1000px] transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <div className="relative w-64 h-80 transform-style-3d">
                {/* Card 1 - Back */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0f1110] rounded-2xl border border-[#2a2a2a]"
                  style={{
                    transform: 'translateZ(0px) rotateY(-15deg) rotateX(5deg)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <div className="p-6 h-full flex flex-col justify-center items-center">
                    <div className="text-6xl mb-4">🎁</div>
                    <div className="text-white font-bold text-xl">BONUS</div>
                  </div>
                </div>

                {/* Card 2 - Middle */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0f1110] rounded-2xl border border-[#2a2a2a]"
                  style={{
                    transform: 'translateZ(20px) rotateY(0deg) rotateX(0deg)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <div className="p-6 h-full flex flex-col justify-center items-center">
                    <div className="text-6xl mb-4">💎</div>
                    <div className="text-white font-bold text-xl">VIP</div>
                  </div>
                </div>

                {/* Card 3 - Front */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#1aff6e]/30 to-[#00d9a3]/20 rounded-2xl border border-[#1aff6e]/50"
                  style={{
                    transform: 'translateZ(40px) rotateY(15deg) rotateX(-5deg)',
                    boxShadow: '0 25px 50px -12px rgba(26, 255, 110, 0.3)',
                  }}
                >
                  <div className="p-6 h-full flex flex-col justify-center items-center">
                    <div className="text-6xl mb-4">💰</div>
                    <div className="text-white font-bold text-xl">100€</div>
                    <div className="text-[#1aff6e] text-sm">GRATUITS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes border-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}
