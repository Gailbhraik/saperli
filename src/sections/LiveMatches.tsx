import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Radio, Gamepad2, Info } from 'lucide-react';
import type { EsportsMatch } from '@/types';
import type { useBetSlip } from '@/hooks/useBetSlip';
import { cn } from '@/lib/utils';
import { MatchDetailsModal } from '@/components/MatchDetailsModal';
import { LEAGUE_LOGOS, getLeagueColor } from '@/services/api';

interface LiveMatchesProps {
  betSlip: ReturnType<typeof useBetSlip>;
  liveMatches: EsportsMatch[];
  upcomingMatches: EsportsMatch[];
  loading?: boolean;
}

export function LiveMatches({ betSlip, liveMatches, upcomingMatches, loading }: LiveMatchesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<EsportsMatch | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('live');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMatchClick = (match: EsportsMatch) => {
    setSelectedMatch(match);
  };

  const handleBetFromModal = (selection: 'home' | 'away') => {
    if (selectedMatch) {
      const odds = selection === 'home' ? selectedMatch.odds.home : selectedMatch.odds.away;
      betSlip.addBet(selectedMatch, selection, odds);
      setSelectedMatch(null);
    }
  };

  const displayMatches = [...liveMatches, ...upcomingMatches.slice(0, 6 - liveMatches.length)];

  if (loading) {
    return (
      <section id="live" className="py-20 bg-[#0a0a0a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-48 bg-[#1a1a1a] rounded animate-pulse" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-64 bg-[#1a1a1a] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="live" className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00d4ff]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-6 h-6 text-[#00d4ff]" />
              <h2 className="text-3xl font-bold text-white">MATCHS ESPORT</h2>
            </div>
            {liveMatches.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-red-500 text-xs font-semibold">{liveMatches.length} LIVE</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayMatches.length > 0 ? (
            displayMatches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                index={index}
                isVisible={isVisible}
                betSlip={betSlip}
                onMatchClick={handleMatchClick}
              />
            ))
          ) : (
            <div className="flex-shrink-0 w-full text-center py-12">
              <p className="text-[#666]">Aucun match disponible pour le moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Match Details Modal */}
      <MatchDetailsModal
        match={selectedMatch!}
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onBet={handleBetFromModal}
      />
    </section>
  );
}

interface MatchCardProps {
  match: EsportsMatch;
  index: number;
  isVisible: boolean;
  betSlip: ReturnType<typeof useBetSlip>;
  onMatchClick: (match: EsportsMatch) => void;
}

function MatchCard({ match, index, isVisible, betSlip, onMatchClick }: MatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isLive = match.status === 'live';
  const existingBet = betSlip.getBetForMatch(match.id);
  const leagueColor = getLeagueColor(match.league);

  const handleOddsClick = (e: React.MouseEvent, selection: 'home' | 'away', odds: number) => {
    e.stopPropagation();
    betSlip.addBet(match, selection, odds);
  };

  // Déterminer le logo de la ligue
  const leagueKey = match.league.toLowerCase().includes('lec') ? 'lec' : 
                    match.league.toLowerCase().includes('lfl') ? 'lfl' :
                    match.league.toLowerCase().includes('lck') ? 'lck' :
                    match.league.toLowerCase().includes('lpl') ? 'lpl' : 'lol';

  return (
    <div
      className={`flex-shrink-0 w-80 snap-start transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${100 + index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => onMatchClick(match)}
        className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
        style={{
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          borderColor: isHovered ? leagueColor : undefined,
          boxShadow: isHovered ? `0 20px 40px -15px ${leagueColor}40` : undefined,
        }}
      >
        <div 
          className="px-5 py-3 border-b border-[#2a2a2a] flex items-center justify-between"
          style={{ backgroundColor: `${leagueColor}10` }}
        >
          <div className="flex items-center gap-2">
            <img 
              src={LEAGUE_LOGOS[leagueKey]} 
              alt={match.league}
              className="w-5 h-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-sm font-medium" style={{ color: leagueColor }}>{match.league}</span>
          </div>
          {isLive ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 text-xs font-semibold">{match.time || 'LIVE'}</span>
            </div>
          ) : (
            <span className="text-[#666] text-xs">
              {new Date(match.startTime).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center overflow-hidden">
                  {match.homeTeam.logo ? (
                    <img 
                      src={match.homeTeam.logo} 
                      alt="" 
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#666]">{match.homeTeam.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-white font-semibold truncate max-w-[120px]">{match.homeTeam.name}</span>
              </div>
              {isLive && match.score && (
                <span className="text-2xl font-black text-white">{match.score.home}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center overflow-hidden">
                  {match.awayTeam.logo ? (
                    <img 
                      src={match.awayTeam.logo} 
                      alt="" 
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#666]">{match.awayTeam.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-white font-semibold truncate max-w-[120px]">{match.awayTeam.name}</span>
              </div>
              {isLive && match.score && (
                <span className="text-2xl font-black text-white">{match.score.away}</span>
              )}
            </div>
          </div>

          {match.format && (
            <div className="flex items-center justify-between mb-4 py-2 px-3 bg-[#0a0a0a] rounded-lg">
              <span className="text-[#666] text-xs uppercase">{match.format}</span>
              {match.currentGame && <span className="text-[#666] text-xs">Game {match.currentGame}</span>}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMatchClick(match);
                }}
                className="p-1 text-[#666] hover:text-white transition-colors"
                title="Voir les statistiques"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => handleOddsClick(e, 'home', match.odds.home)}
              className={cn(
                'py-2.5 px-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-0.5',
                existingBet?.selection === 'home'
                  ? 'bg-[#1aff6e]/20 border-[#1aff6e]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#1aff6e]'
              )}
            >
              <span className={cn('text-xs', existingBet?.selection === 'home' ? 'text-[#1aff6e]' : 'text-[#666]')}>1</span>
              <span className={cn('font-bold', existingBet?.selection === 'home' ? 'text-[#1aff6e]' : 'text-white')}>
                {match.odds.home.toFixed(2)}
              </span>
            </button>
            <button
              onClick={(e) => handleOddsClick(e, 'away', match.odds.away)}
              className={cn(
                'py-2.5 px-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-0.5',
                existingBet?.selection === 'away'
                  ? 'bg-[#1aff6e]/20 border-[#1aff6e]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#1aff6e]'
              )}
            >
              <span className={cn('text-xs', existingBet?.selection === 'away' ? 'text-[#1aff6e]' : 'text-[#666]')}>2</span>
              <span className={cn('font-bold', existingBet?.selection === 'away' ? 'text-[#1aff6e]' : 'text-white')}>
                {match.odds.away.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
