import { useState, useEffect } from 'react';
import { Radio, Trophy, Gamepad2, ArrowRight, Info } from 'lucide-react';
import type { EsportsMatch } from '@/types';
import type { useBetSlip } from '@/hooks/useBetSlip';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MatchDetailsModal } from '@/components/MatchDetailsModal';
import { LEAGUE_LOGOS, getLeagueColor } from '@/services/api';

interface EsportsSectionProps {
  betSlip: ReturnType<typeof useBetSlip>;
  lecMatches: EsportsMatch[];
  lflMatches: EsportsMatch[];
  liveMatches: EsportsMatch[];
  onViewAllBets?: () => void;
}

export function EsportsSection({ betSlip, lecMatches, lflMatches, liveMatches, onViewAllBets }: EsportsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'lec' | 'lfl'>('lec');
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

    const section = document.getElementById('esports');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const displayedMatches = selectedTab === 'lec' ? lecMatches : lflMatches;

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

  return (
    <section id="esports" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0055A4]/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div
              className={`flex items-center gap-3 mb-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-4xl font-black text-white">LEAGUE OF LEGENDS</h2>
              {liveMatches.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                  <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                  <span className="text-red-500 text-xs font-semibold">{liveMatches.length} LIVE</span>
                </div>
              )}
            </div>
            <p
              className={`text-[#b3b3b3] transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              Les meilleures compétitions européennes
            </p>
          </div>

          {/* View All Button */}
          <Button
            onClick={onViewAllBets}
            className="bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-bold hover:opacity-90"
          >
            Voir tous les paris
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* League Tabs */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <button
            onClick={() => setSelectedTab('lec')}
            className={cn(
              'flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300',
              selectedTab === 'lec'
                ? 'bg-[#00d4ff]/10 border-[#00d4ff] shadow-lg shadow-[#00d4ff]/20'
                : 'bg-[#141414] border-[#2a2a2a] hover:border-[#3a3a3a]'
            )}
          >
            <img 
              src={LEAGUE_LOGOS['lec']} 
              alt="LEC" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="text-left">
              <p className={cn(
                'font-bold text-lg',
                selectedTab === 'lec' ? 'text-[#00d4ff]' : 'text-white'
              )}>
                LEC
              </p>
              <p className="text-[#666] text-xs">European Championship</p>
            </div>
            <span className={cn(
              'px-2 py-1 rounded text-xs font-semibold ml-auto',
              selectedTab === 'lec' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-[#2a2a2a] text-[#666]'
            )}>
              {lecMatches.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('lfl')}
            className={cn(
              'flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300',
              selectedTab === 'lfl'
                ? 'bg-[#0055A4]/10 border-[#0055A4] shadow-lg shadow-[#0055A4]/20'
                : 'bg-[#141414] border-[#2a2a2a] hover:border-[#3a3a3a]'
            )}
          >
            <img 
              src={LEAGUE_LOGOS['lfl']} 
              alt="LFL" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="text-left">
              <p className={cn(
                'font-bold text-lg',
                selectedTab === 'lfl' ? 'text-[#0055A4]' : 'text-white'
              )}>
                LFL
              </p>
              <p className="text-[#666] text-xs">Ligue Française</p>
            </div>
            <span className={cn(
              'px-2 py-1 rounded text-xs font-semibold ml-auto',
              selectedTab === 'lfl' ? 'bg-[#0055A4]/20 text-[#0055A4]' : 'bg-[#2a2a2a] text-[#666]'
            )}>
              {lflMatches.length}
            </span>
          </button>
        </div>

        {/* Stats Bar */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {[
            { icon: Trophy, label: 'Tournois', value: '8', color: '#ffa502' },
            { icon: Gamepad2, label: 'Matchs', value: `${lecMatches.length + lflMatches.length}+`, color: '#1aff6e' },
            { icon: Radio, label: 'En direct', value: `${liveMatches.length}`, color: '#ff4757' },
            { icon: Trophy, label: 'Équipes', value: '20+', color: '#00d4ff' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-[#666] text-xs">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Matches Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMatches.length > 0 ? (
            displayedMatches.slice(0, 6).map((match, index) => (
              <EsportsMatchCard
                key={match.id}
                match={match}
                index={index}
                isVisible={isVisible}
                betSlip={betSlip}
                onMatchClick={handleMatchClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#666]">Aucun match disponible pour le moment</p>
            </div>
          )}
        </div>

        {/* View More */}
        {displayedMatches.length > 6 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={onViewAllBets}
              className="border-[#2a2a2a] text-white hover:bg-white/5"
            >
              Voir les {displayedMatches.length - 6} autres matchs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
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

interface EsportsMatchCardProps {
  match: EsportsMatch;
  index: number;
  isVisible: boolean;
  betSlip: ReturnType<typeof useBetSlip>;
  onMatchClick: (match: EsportsMatch) => void;
}

function EsportsMatchCard({ match, index, isVisible, betSlip, onMatchClick }: EsportsMatchCardProps) {
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
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${500 + index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => onMatchClick(match)}
        className="relative bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
        style={{
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: isHovered ? `0 20px 40px -15px ${leagueColor}30` : 'none',
          borderColor: isHovered ? leagueColor : undefined,
        }}
      >
        {/* Header */}
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
            <span className="text-white text-sm font-medium">{match.league}</span>
            {match.format && (
              <span className="text-[#666] text-xs uppercase">{match.format}</span>
            )}
          </div>
          {isLive ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full animate-pulse bg-red-500" />
              <span className="text-xs font-semibold text-red-500">
                {match.time}
              </span>
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

        {/* Content */}
        <div className="p-5">
          {/* Teams */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-lg overflow-hidden">
                  {match.homeTeam.logo ? (
                    <img 
                      src={match.homeTeam.logo} 
                      alt="" 
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-[#666] font-bold text-xs">{match.homeTeam.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-white font-semibold">{match.homeTeam.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-lg overflow-hidden">
                  {match.awayTeam.logo ? (
                    <img 
                      src={match.awayTeam.logo} 
                      alt="" 
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-[#666] font-bold text-xs">{match.awayTeam.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-white font-semibold">{match.awayTeam.name}</span>
              </div>
            </div>

            {/* Score */}
            {isLive && match.score && (
              <div className="text-center px-6">
                <div className="text-3xl font-black text-white">
                  {match.score.home} - {match.score.away}
                </div>
                {match.currentGame && (
                  <div className="text-[#666] text-xs mt-1">
                    Game {match.currentGame}
                  </div>
                )}
              </div>
            )}

            {/* Info button */}
            {!isLive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMatchClick(match);
                }}
                className="p-2 text-[#666] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Voir les statistiques"
              >
                <Info className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Odds */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={(e) => handleOddsClick(e, 'home', match.odds.home)}
              className={cn(
                'py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-between',
                existingBet?.selection === 'home'
                  ? 'bg-[#1aff6e]/20 border-[#1aff6e]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#1aff6e]'
              )}
            >
              <span className="text-white font-medium text-sm truncate">{match.homeTeam.name}</span>
              <span
                className={cn(
                  'font-bold',
                  existingBet?.selection === 'home' ? 'text-[#1aff6e]' : 'text-white'
                )}
              >
                {match.odds.home.toFixed(2)}
              </span>
            </button>
            <button
              onClick={(e) => handleOddsClick(e, 'away', match.odds.away)}
              className={cn(
                'py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-between',
                existingBet?.selection === 'away'
                  ? 'bg-[#1aff6e]/20 border-[#1aff6e]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#1aff6e]'
              )}
            >
              <span className="text-white font-medium text-sm truncate">{match.awayTeam.name}</span>
              <span
                className={cn(
                  'font-bold',
                  existingBet?.selection === 'away' ? 'text-[#1aff6e]' : 'text-white'
                )}
              >
                {match.odds.away.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
