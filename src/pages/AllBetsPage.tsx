import { useState } from 'react';
import { ArrowLeft, Radio, Trophy, Search, Gamepad2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EsportsMatch } from '@/types';
import type { useBetSlip } from '@/hooks/useBetSlip';
import { cn } from '@/lib/utils';
import { MatchDetailsModal } from '@/components/MatchDetailsModal';
import { LEAGUE_LOGOS, getLeagueColor } from '@/services/api';

interface AllBetsPageProps {
  matches: {
    all: EsportsMatch[];
    lec: EsportsMatch[];
    lfl: EsportsMatch[];
    international: EsportsMatch[];
    live: EsportsMatch[];
  };
  betSlip: ReturnType<typeof useBetSlip>;
  onBack: () => void;
}

type LeagueFilter = 'all' | 'lec' | 'lfl' | 'lck' | 'lpl' | 'live';

const leagueInfo: Record<LeagueFilter, { name: string; color: string; icon?: string }> = {
  all: { name: 'Tous les matchs', color: '#1aff6e' },
  live: { name: 'En direct', color: '#ff4757' },
  lec: { name: 'LEC', color: '#00d4ff', icon: '🇪🇺' },
  lfl: { name: 'LFL', color: '#0055A4', icon: '🇫🇷' },
  lck: { name: 'LCK', color: '#e31c79', icon: '🇰🇷' },
  lpl: { name: 'LPL', color: '#ff6b35', icon: '🇨🇳' },
};

export function AllBetsPage({ matches, betSlip, onBack }: AllBetsPageProps) {
  const [selectedLeague, setSelectedLeague] = useState<LeagueFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'odds'>('date');
  const [selectedMatch, setSelectedMatch] = useState<EsportsMatch | null>(null);

  // Filtrer les matchs
  const getFilteredMatches = (): EsportsMatch[] => {
    let filtered: EsportsMatch[] = [];

    switch (selectedLeague) {
      case 'live':
        filtered = matches.live;
        break;
      case 'lec':
        filtered = matches.lec;
        break;
      case 'lfl':
        filtered = matches.lfl;
        break;
      case 'lck':
        filtered = matches.all.filter(m =>
          m.league.toLowerCase().includes('lck') || m.league.toLowerCase().includes('korea')
        );
        break;
      case 'lpl':
        filtered = matches.all.filter(m =>
          m.league.toLowerCase().includes('lpl') || m.league.toLowerCase().includes('china')
        );
        break;
      default:
        filtered = matches.all;
    }

    // Recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.homeTeam.name.toLowerCase().includes(query) ||
        m.awayTeam.name.toLowerCase().includes(query) ||
        m.league.toLowerCase().includes(query)
      );
    }

    // Tri
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    } else {
      filtered.sort((a, b) => Math.min(a.odds.home, a.odds.away) - Math.min(b.odds.home, b.odds.away));
    }

    return filtered;
  };

  const filteredMatches = getFilteredMatches();
  const liveCount = matches.live.length;

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-[#b3b3b3] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="h-6 w-px bg-[#2a2a2a]" />
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-[#00d4ff]" />
                <h1 className="text-xl font-bold">Tous les paris</h1>
              </div>
            </div>
            {liveCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-red-500 text-sm font-semibold">{liveCount} LIVE</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* League Filters */}
          <div className="flex flex-wrap gap-3">
            {(Object.keys(leagueInfo) as LeagueFilter[]).map((league) => {
              const info = leagueInfo[league];
              const count = league === 'all' ? matches.all.length
                : league === 'live' ? matches.live.length
                  : league === 'lec' ? matches.lec.length
                    : league === 'lfl' ? matches.lfl.length
                      : matches.all.filter(m =>
                        m.league.toLowerCase().includes(league)
                      ).length;

              return (
                <button
                  key={league}
                  onClick={() => setSelectedLeague(league)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300',
                    selectedLeague === league
                      ? 'border-current shadow-lg'
                      : 'border-[#2a2a2a] bg-[#141414] hover:border-[#3a3a3a]'
                  )}
                  style={{
                    backgroundColor: selectedLeague === league ? `${info.color}15` : undefined,
                    borderColor: selectedLeague === league ? info.color : undefined,
                    color: selectedLeague === league ? info.color : '#b3b3b3',
                  }}
                >
                  {league !== 'all' && league !== 'live' && LEAGUE_LOGOS[league] && (
                    <img
                      src={LEAGUE_LOGOS[league]}
                      alt={info.name}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  {info.icon && <span>{info.icon}</span>}
                  {league === 'live' && <Radio className="w-4 h-4" />}
                  <span className="font-medium">{info.name}</span>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    selectedLeague === league ? 'bg-current/20' : 'bg-[#2a2a2a]'
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
              <Input
                type="text"
                placeholder="Rechercher une équipe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#141414] border-[#2a2a2a] text-white placeholder:text-[#666]"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'odds')}
              className="px-4 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#00d4ff]"
            >
              <option value="date">Trier par date</option>
              <option value="odds">Trier par cotes</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-[#666] mb-6">
          {filteredMatches.length} match{filteredMatches.length > 1 ? 's' : ''} trouvé{filteredMatches.length > 1 ? 's' : ''}
        </p>

        {/* Matches Grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                betSlip={betSlip}
                onMatchClick={handleMatchClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-[#666]" />
            </div>
            <p className="text-[#b3b3b3] mb-2">Aucun match trouvé</p>
            <p className="text-[#666] text-sm">Essayez de modifier vos filtres</p>
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
    </div>
  );
}

interface MatchCardProps {
  match: EsportsMatch;
  betSlip: ReturnType<typeof useBetSlip>;
  onMatchClick: (match: EsportsMatch) => void;
}

function MatchCard({ match, betSlip, onMatchClick }: MatchCardProps) {
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => onMatchClick(match)}
        className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
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
            <span className="text-sm font-medium" style={{ color: leagueColor }}>{match.league}</span>
            {match.format && (
              <span className="text-[#666] text-xs uppercase">{match.format}</span>
            )}
          </div>
          {isLive ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full animate-pulse bg-red-500" />
              <span className="text-xs font-semibold text-red-500">{match.time}</span>
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
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center overflow-hidden">
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
                    <span className="text-xs font-bold text-[#666]">{match.homeTeam.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-white font-semibold">{match.homeTeam.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center overflow-hidden">
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
                    <span className="text-xs font-bold text-[#666]">{match.awayTeam.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-white font-semibold">{match.awayTeam.name}</span>
              </div>
            </div>

            {/* Score or Info button */}
            {isLive && match.score ? (
              <div className="text-center px-6">
                <div className="text-3xl font-black text-white">
                  {match.score.home} - {match.score.away}
                </div>
                {match.currentGame && (
                  <div className="text-[#666] text-xs mt-1">Game {match.currentGame}</div>
                )}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMatchClick(match);
                }}
                className="p-3 text-[#666] hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Voir les statistiques"
              >
                <Info className="w-6 h-6" />
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
              <span className={cn(
                'font-bold',
                existingBet?.selection === 'home' ? 'text-[#1aff6e]' : 'text-white'
              )}>
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
              <span className={cn(
                'font-bold',
                existingBet?.selection === 'away' ? 'text-[#1aff6e]' : 'text-white'
              )}>
                {match.odds.away.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
