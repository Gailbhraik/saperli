import { useState, useEffect } from 'react';
import { UserPlus, CreditCard, Target, Coins, Check } from 'lucide-react';

const steps = [
  {
    id: 'register',
    icon: UserPlus,
    title: 'Inscrivez-vous',
    description: 'Créez votre compte en 30 secondes',
    subDescription: 'Vérification instantanée',
    color: '#1aff6e',
  },
  {
    id: 'deposit',
    icon: CreditCard,
    title: 'Déposez',
    description: 'Choisissez votre méthode de paiement',
    subDescription: 'Minimum 10€',
    color: '#00d4ff',
  },
  {
    id: 'bet',
    icon: Target,
    title: 'Pariez',
    description: 'Sélectionnez vos matchs',
    subDescription: 'Simple, combiné, système',
    color: '#8b5cf6',
  },
  {
    id: 'win',
    icon: Coins,
    title: 'Gagnez',
    description: 'Retirez vos gains instantanément',
    subDescription: '24h/24, 7j/7',
    color: '#ffa502',
  },
];

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('how-it-works');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#1aff6e]/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-black text-white mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            COMMENT ÇA{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1aff6e] to-[#00d9a3]">
              MARCHE
            </span>
            ?
          </h2>
          <p
            className={`text-[#b3b3b3] text-lg max-w-xl mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Commencez à parier en 4 étapes simples
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5">
            <div className="relative w-full h-full bg-[#2a2a2a] rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1aff6e] via-[#00d4ff] to-[#ffa502] transition-all duration-1500"
                style={{
                  width: isVisible ? '100%' : '0%',
                  transitionDelay: '500ms',
                }}
              />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Number Badge */}
                  <div className="relative mb-6">
                    {/* Pulse Ring */}
                    <div
                      className="absolute inset-0 rounded-full transition-opacity duration-300"
                      style={{
                        animation: hoveredStep === step.id ? 'pulse-ring 2s ease-out infinite' : 'none',
                        border: `2px solid ${step.color}`,
                        opacity: hoveredStep === step.id ? 1 : 0,
                      }}
                    />
                    
                    {/* Main Circle */}
                    <div
                      className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        backgroundColor: `${step.color}15`,
                        border: `2px solid ${hoveredStep === step.id ? step.color : `${step.color}40`}`,
                        transform: hoveredStep === step.id ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: hoveredStep === step.id ? `0 0 30px ${step.color}40` : 'none',
                      }}
                    >
                      <span
                        className="text-2xl font-black"
                        style={{ color: step.color }}
                      >
                        {index + 1}
                      </span>
                    </div>

                    {/* Icon - Floating */}
                    <div
                      className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500"
                      style={{
                        backgroundColor: step.color,
                        transform: hoveredStep === step.id ? 'rotate(10deg) scale(1.1)' : 'rotate(0)',
                      }}
                    >
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-[#b3b3b3] mb-1">{step.description}</p>
                  <p className="text-[#666] text-sm">{step.subDescription}</p>

                  {/* Checkmark - Appears on hover */}
                  <div
                    className={`mt-4 transition-all duration-300 ${
                      hoveredStep === step.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${step.color}20` }}
                    >
                      <Check className="w-4 h-4" style={{ color: step.color }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
