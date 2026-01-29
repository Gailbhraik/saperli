import { useState } from 'react';
import { ArrowLeft, Radio, Trophy, Filter, Search, Calendar, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EsportsMatch } from '@/types';
import type { useBetSlip } from '@/hooks/useBetSlip';
import { cn } from '@/lib/utils';

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
                <Gamepad2 className="w-5 h-5 text-[#1aff6e]" />
                <h1 className="text-xl font-bold">Tous les Paris</h1>
              </div>
            </div>
            
            {/* Search */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <Input
                  type="text"
                  placeholder="Rechercher une équipe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#666]"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* League Tabs */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(leagueInfo) as LeagueFilter[]).map((league) => {
              const info = leagueInfo[league];
              const isActive = selectedLeague === league;
              const count = league === 'live' ? liveCount : 
                            league === 'all' ? matches.all.length :
                            league === 'lec' ? matches.lec.length :
                            league === 'lfl' ? matches.lfl.length : 0;
              
              return (
                <button
                  key={league}
                  onClick={() => setSelectedLeague(league)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'text-white shadow-lg'
                      : 'bg-[#1a1a1a] text-[#b3b3b3] hover:bg-[#2a2a2a]'
                  )}
                  style={{
                    backgroundColor: isActive ? info.color : undefined,
                    boxShadow: isActive ? `0 4px 20px ${info.color}40` : undefined,
                  }}
                >
                  {league === 'live' && <Radio className="w-4 h-4 animate-pulse" />}
                  {info.icon && <span>{info.icon}</span>}
                  <span>{info.name}</span>
                  {count > 0 && (
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-xs',
                      isActive ? 'bg-white/20' : 'bg-[#2a2a2a]'
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#666]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'odds')}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1aff6e]"
            >
              <option value="date">Trier par date</option>
              <option value="odds">Trier par cotes</option>
            </select>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <Input
              type="text"
              placeholder="Rechercher une équipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#666]"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#666] text-sm">
            {filteredMatches.length} match{filteredMatches.length > 1 ? 's' : ''} disponible{filteredMatches.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} betSlip={betSlip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-[#666]" />
            </div>
            <p className="text-[#b3b3b3] mb-2">Aucun match trouvé</p>
            <p className="text-[#666] text-sm">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface MatchCardProps {
  match: EsportsMatch;
  betSlip: ReturnType<typeof useBetSlip>;
}

function MatchCard({ match, betSlip }: MatchCardProps) {
  const isLive = match.status === 'live';
  const existingBet = betSlip.getBetForMatch(match.id);

  const handleOddsClick = (selection: 'home' | 'away', odds: number) => {
    betSlip.addBet(match, selection, odds);
  };

  // Déterminer la couleur de la ligue
  const getLeagueColor = () => {
    const league = match.league.toLowerCase();
    if (league.includes('lec')) return '#00d4ff';
    if (league.includes('lfl') || league.includes('french')) return '#0055A4';
    if (league.includes('lck') || league.includes('korea')) return '#e31c79';
    if (league.includes('lpl') || league.includes('china')) return '#ff6b35';
    return '#1aff6e';
  };

  const leagueColor = getLeagueColor();

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div 
        className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between"
        style={{ backgroundColor: `${leagueColor}10` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: leagueColor }}>{match.league}</span>
          {match.format && (
            <span className="text-[#666] text-xs uppercase">{match.format}</span>
          )}
        </div>
        {isLive ? (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500 text-xs font-semibold">{match.time || 'LIVE'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[#666] text-xs">
            <Calendar className="w-3 h-3" />
            {new Date(match.startTime).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="p-4">
        <div className="space-y-3 mb-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center overflow-hidden">
                {match.homeTeam.logo ? (
                  <img src={match.homeTeam.logo} alt="" className="w-7 h-7 object-contain" />
                ) : (
                  <span className="text-lg">🎮</span>
                )}
              </div>
              <span className="text-white font-semibold">{match.homeTeam.name}</span>
            </div>
            {isLive && match.score && (
              <span className="text-2xl font-black text-white">{match.score.home}</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center overflow-hidden">
                {match.awayTeam.logo ? (
                  <img src={match.awayTeam.logo} alt="" className="w-7 h-7 object-contain" />
                ) : (
                  <span className="text-lg">🎮</span>
                )}
              </div>
              <span className="text-white font-semibold">{match.awayTeam.name}</span>
            </div>
            {isLive && match.score && (
              <span className="text-2xl font-black text-white">{match.score.away}</span>
            )}
          </div>
        </div>

        {/* Odds */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleOddsClick('home', match.odds.home)}
            className={cn(
              'py-3 px-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1',
              existingBet?.selection === 'home'
                ? 'bg-[#1aff6e]/20 border-[#1aff6e]'
                : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#1aff6e]'
            )}
          >
            <span className="text-[#666] text-xs">1</span>
            <span className={cn(
              'font-bold text-lg',
              existingBet?.selection === 'home' ? 'text-[#1aff6e]' : 'text-white'
            )}>
              {match.odds.home.toFixed(2)}
            </span>
          </button>
          <button
            onClick={() => handleOddsClick('away', match.odds.away)}
            className={cn(
              'py-3 px-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1',
              existingBet?.selection === 'away'
                ? 'bg-[#1aff6e]/20 border-[#1aff6e]'
                : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#1aff6e]'
            )}
          >
            <span className="text-[#666] text-xs">2</span>
            <span className={cn(
              'font-bold text-lg',
              existingBet?.selection === 'away' ? 'text-[#1aff6e]' : 'text-white'
            )}>
              {match.odds.away.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
