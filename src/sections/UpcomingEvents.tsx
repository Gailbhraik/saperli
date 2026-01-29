import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  timeLeft: { days: number; hours: number; minutes: number };
  sport: string;
  icon: string;
  color: string;
}

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Champions League Final',
    subtitle: 'Real Madrid vs Manchester City',
    date: 'Samedi 1 Juin, 21:00',
    timeLeft: { days: 12, hours: 8, minutes: 45 },
    sport: 'Football',
    icon: '⚽',
    color: '#1aff6e',
  },
  {
    id: '2',
    title: 'Roland Garros - Finale Hommes',
    subtitle: 'Alcaraz vs Sinner',
    date: '8 Juin, 15:00',
    timeLeft: { days: 2, hours: 14, minutes: 30 },
    sport: 'Tennis',
    icon: '🎾',
    color: '#00d4ff',
  },
  {
    id: '3',
    title: 'NBA Finals - Game 1',
    subtitle: 'Celtics vs Nuggets',
    date: '5 Juin, 02:00',
    timeLeft: { days: 3, hours: 9, minutes: 15 },
    sport: 'Basketball',
    icon: '🏀',
    color: '#ff6b35',
  },
  {
    id: '4',
    title: 'CS2 Major - Finale',
    subtitle: 'NAVI vs FaZe Clan',
    date: '20 Mars, 19:00',
    timeLeft: { days: 5, hours: 18, minutes: 0 },
    sport: 'Esports',
    icon: '🎮',
    color: '#8b5cf6',
  },
  {
    id: '5',
    title: 'F1 - Grand Prix Monaco',
    subtitle: 'Course principale',
    date: '25 Mai, 14:00',
    timeLeft: { days: 7, hours: 12, minutes: 30 },
    sport: 'F1',
    icon: '🏎️',
    color: '#ff4757',
  },
];

export function UpcomingEvents() {
  const [isVisible, setIsVisible] = useState(false);
  const [countdowns, setCountdowns] = useState(upcomingEvents.map(e => e.timeLeft));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('upcoming');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev =>
        prev.map(countdown => {
          let { days, hours, minutes } = countdown;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
              if (days < 0) {
                days = 0;
                hours = 0;
                minutes = 0;
              }
            }
          }
          return { days, hours, minutes };
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const featuredEvent = upcomingEvents[0];
  const otherEvents = upcomingEvents.slice(1);

  return (
    <section id="upcoming" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#1aff6e]/5 rounded-full blur-[150px] -translate-y-1/2" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h2
            className={`text-4xl md:text-5xl font-black text-white mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
          >
            ÉVÉNEMENTS À{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1aff6e] to-[#00d9a3]">
              VENIR
            </span>
          </h2>
          <p
            className={`text-[#b3b3b3] text-lg transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Les plus grands événements sportifs de l'année
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* Featured Event */}
          <div
            className={`relative transition-all duration-800 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="relative bg-gradient-to-br from-[#141414] to-[#0f1110] border border-[#2a2a2a] rounded-3xl overflow-hidden h-full">
              {/* Background Image Effect */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(135deg, ${featuredEvent.color}40 0%, transparent 60%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${featuredEvent.color}20` }}
                  >
                    {featuredEvent.icon}
                  </div>
                  <div>
                    <div className="text-[#666] text-sm">{featuredEvent.sport}</div>
                    <div className="text-white font-semibold">{featuredEvent.date}</div>
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-white mb-2">
                  {featuredEvent.title}
                </h3>
                <p className="text-[#b3b3b3] text-lg mb-8">{featuredEvent.subtitle}</p>

                {/* Countdown */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { value: countdowns[0].days, label: 'JOURS' },
                    { value: countdowns[0].hours, label: 'HEURES' },
                    { value: countdowns[0].minutes, label: 'MIN' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#0a0a0a]/80 border border-[#2a2a2a] rounded-xl p-4 text-center"
                    >
                      <div className="text-3xl md:text-4xl font-black text-white mb-1">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-[#666] text-xs font-semibold tracking-wider">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="w-full mt-auto bg-gradient-to-r from-[#1aff6e] to-[#00d9a3] text-[#0a0a0a] font-bold hover:shadow-[0_0_30px_rgba(26,255,110,0.4)] transition-all duration-300"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  PARIER MAINTENANT
                </Button>
              </div>
            </div>
          </div>

          {/* Other Events List */}
          <div className="space-y-4">
            {otherEvents.map((event, index) => (
              <div
                key={event.id}
                className={`group relative bg-[#141414] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-5 transition-all duration-500 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}
                style={{
                  transitionDelay: `${300 + index * 100}ms`,
                }}
              >
                {/* Left Border Accent */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-full rounded-full transition-all duration-300"
                  style={{ backgroundColor: event.color }}
                />

                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${event.color}15` }}
                  >
                    {event.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate group-hover:text-[#1aff6e] transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-[#666] text-sm truncate">{event.subtitle}</p>
                  </div>

                  {/* Time */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-[#b3b3b3] text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {countdowns[index + 1].days}j {countdowns[index + 1].hours}h
                      </span>
                    </div>
                    <div className="text-[#666] text-xs">{event.sport}</div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-[#666] group-hover:text-[#1aff6e] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.max(0, 100 - countdowns[index + 1].days * 5)}%`,
                      backgroundColor: event.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
