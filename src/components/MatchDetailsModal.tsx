import { useState } from 'react';
import { 
  X, 
  Clock, 
  Trophy, 
  Users, 
  Swords, 
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  Zap,
  Target,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { EsportsMatch } from '@/types';
import { LEAGUE_LOGOS, getLeagueColor } from '@/services/api';

interface MatchDetailsModalProps {
  match: EsportsMatch;
  isOpen: boolean;
  onClose: () => void;
  onBet: (selection: 'home' | 'away') => void;
}

// Stats simulées pour les équipes (en production, viendrait de l'API)
function generateTeamStats(teamName: string, isHome: boolean) {
  const seed = teamName.length + (isHome ? 10 : 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };
  
  return {
    wins: random(5, 15),
    losses: random(2, 10),
    winStreak: random(0, 5),
    avgGameTime: `${random(28, 38)}:${random(10, 59).toString().padStart(2, '0')}`,
    avgKills: random(12, 22),
    avgDeaths: random(8, 16),
    firstBloodRate: random(40, 70),
    dragonRate: random(50, 80),
    baronRate: random(30, 60),
    towerRate: random(55, 75),
  };
}

// Head-to-head simulé
function generateH2H(team1: string, team2: string) {
  const seed = team1.length + team2.length;
  const total = 5;
  const team1Wins = Math.floor(Math.sin(seed) * 2.5 + 2.5);
  
  return {
    total,
    team1Wins,
    team2Wins: total - team1Wins,
    recentMatches: [
      { winner: team1Wins > 2 ? team1 : team2, score: '2-1', date: '2025-01-15' },
      { winner: team1Wins > 1 ? team1 : team2, score: '2-0', date: '2024-12-20' },
      { winner: team1Wins > 3 ? team2 : team1, score: '1-2', date: '2024-11-10' },
    ]
  };
}

export function MatchDetailsModal({ match, isOpen, onClose, onBet }: MatchDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'h2h'>('overview');
  
  if (!isOpen) return null;

  const homeStats = generateTeamStats(match.homeTeam.name, true);
  const awayStats = generateTeamStats(match.awayTeam.name, false);
  const h2h = generateH2H(match.homeTeam.name, match.awayTeam.name);
  
  const leagueColor = getLeagueColor(match.league);
  const leagueLogo = LEAGUE_LOGOS[match.league.toLowerCase().includes('lec') ? 'lec' : 
                                  match.league.toLowerCase().includes('lfl') ? 'lfl' :
                                  match.league.toLowerCase().includes('lck') ? 'lck' :
                                  match.league.toLowerCase().includes('lpl') ? 'lpl' : 'lol'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl shadow-2xl">
        {/* Header avec couleur de la ligue */}
        <div 
          className="relative p-6 border-b border-[#2a2a2a]"
          style={{ background: `linear-gradient(135deg, ${leagueColor}15, transparent)` }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#666] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* League info */}
          <div className="flex items-center gap-3 mb-4">
            {leagueLogo && (
              <img src={leagueLogo} alt={match.league} className="w-8 h-8 object-contain" />
            )}
            <div>
              <span 
                className="text-sm font-semibold"
                style={{ color: leagueColor }}
              >
                {match.league}
              </span>
              <div className="flex items-center gap-2 text-[#666] text-xs">
                <Calendar className="w-3 h-3" />
                {new Date(match.startTime).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            {match.status === 'live' && (
              <span className="ml-auto px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          
          {/* Teams */}
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl p-2 flex items-center justify-center">
                {match.homeTeam.logo ? (
                  <img 
                    src={match.homeTeam.logo} 
                    alt={match.homeTeam.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-2xl font-bold text-[#666]">
                    {match.homeTeam.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{match.homeTeam.name}</h3>
                <p className="text-[#666] text-sm">{homeStats.wins}W - {homeStats.losses}L</p>
              </div>
            </div>
            
            {/* Score / VS */}
            <div className="px-6 text-center">
              {match.status === 'live' && match.score ? (
                <div className="text-3xl font-black text-white">
                  {match.score.home} - {match.score.away}
                </div>
              ) : (
                <div className="text-2xl font-bold text-[#666]">VS</div>
              )}
              {match.time && (
                <p className="text-[#ffa502] text-sm font-medium mt-1">{match.time}</p>
              )}
              <p className="text-[#666] text-xs mt-1">{match.format.toUpperCase()}</p>
            </div>
            
            {/* Away Team */}
            <div className="flex items-center gap-4 flex-1 justify-end text-right">
              <div>
                <h3 className="text-white font-bold text-lg">{match.awayTeam.name}</h3>
                <p className="text-[#666] text-sm">{awayStats.wins}W - {awayStats.losses}L</p>
              </div>
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl p-2 flex items-center justify-center">
                {match.awayTeam.logo ? (
                  <img 
                    src={match.awayTeam.logo} 
                    alt={match.awayTeam.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-2xl font-bold text-[#666]">
                    {match.awayTeam.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-[#2a2a2a]">
          {[
            { id: 'overview', label: 'Aperçu', icon: Trophy },
            { id: 'stats', label: 'Statistiques', icon: TrendingUp },
            { id: 'h2h', label: 'Face à Face', icon: Swords },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id 
                  ? 'text-white border-b-2'
                  : 'text-[#666] hover:text-white'
              )}
              style={{ 
                borderColor: activeTab === tab.id ? leagueColor : 'transparent' 
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#141414] rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 text-[#00d4ff] mx-auto mb-2" />
                  <p className="text-white font-bold">{homeStats.avgGameTime}</p>
                  <p className="text-[#666] text-xs">Durée moy.</p>
                </div>
                <div className="bg-[#141414] rounded-xl p-4 text-center">
                  <Zap className="w-5 h-5 text-[#ffa502] mx-auto mb-2" />
                  <p className="text-white font-bold">{match.format.toUpperCase()}</p>
                  <p className="text-[#666] text-xs">Format</p>
                </div>
                <div className="bg-[#141414] rounded-xl p-4 text-center">
                  <Users className="w-5 h-5 text-[#8b5cf6] mx-auto mb-2" />
                  <p className="text-white font-bold">{h2h.total}</p>
                  <p className="text-[#666] text-xs">Confrontations</p>
                </div>
              </div>
              
              {/* Win Probability */}
              <div className="bg-[#141414] rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#00d4ff]" />
                  Probabilité de victoire
                </h4>
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium w-20">{match.homeTeam.name.split(' ')[0]}</span>
                  <div className="flex-1 h-3 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(1/match.odds.home) / ((1/match.odds.home) + (1/match.odds.away)) * 100}%`,
                        background: `linear-gradient(90deg, ${leagueColor}, ${leagueColor}80)`
                      }}
                    />
                  </div>
                  <span className="text-white font-medium w-20 text-right">{match.awayTeam.name.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-[#1aff6e]">
                    {((1/match.odds.home) / ((1/match.odds.home) + (1/match.odds.away)) * 100).toFixed(0)}%
                  </span>
                  <span className="text-[#1aff6e]">
                    {((1/match.odds.away) / ((1/match.odds.home) + (1/match.odds.away)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              {/* Recent Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#141414] rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">{match.homeTeam.name}</h4>
                  <div className="flex gap-1 mb-2">
                    {['W', 'W', 'L', 'W', 'W'].map((result, i) => (
                      <span 
                        key={i}
                        className={cn(
                          'w-8 h-8 rounded flex items-center justify-center text-xs font-bold',
                          result === 'W' ? 'bg-[#1aff6e]/20 text-[#1aff6e]' : 'bg-red-500/20 text-red-500'
                        )}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#666] text-sm">
                    Série: <span className="text-[#1aff6e]">{homeStats.winStreak}W</span>
                  </p>
                </div>
                <div className="bg-[#141414] rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">{match.awayTeam.name}</h4>
                  <div className="flex gap-1 mb-2">
                    {['L', 'W', 'W', 'W', 'L'].map((result, i) => (
                      <span 
                        key={i}
                        className={cn(
                          'w-8 h-8 rounded flex items-center justify-center text-xs font-bold',
                          result === 'W' ? 'bg-[#1aff6e]/20 text-[#1aff6e]' : 'bg-red-500/20 text-red-500'
                        )}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#666] text-sm">
                    Série: <span className="text-[#1aff6e]">{awayStats.winStreak}W</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {[
                { label: 'Kills moyens', home: homeStats.avgKills, away: awayStats.avgKills, icon: Swords },
                { label: 'Deaths moyens', home: homeStats.avgDeaths, away: awayStats.avgDeaths, icon: Shield },
                { label: 'First Blood %', home: homeStats.firstBloodRate, away: awayStats.firstBloodRate, icon: Zap, suffix: '%' },
                { label: 'Dragon %', home: homeStats.dragonRate, away: awayStats.dragonRate, icon: Star, suffix: '%' },
                { label: 'Baron %', home: homeStats.baronRate, away: awayStats.baronRate, icon: Trophy, suffix: '%' },
                { label: 'Tour %', home: homeStats.towerRate, away: awayStats.towerRate, icon: MapPin, suffix: '%' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#141414] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold">{stat.home}{stat.suffix || ''}</span>
                    <div className="flex items-center gap-2 text-[#666]">
                      <stat.icon className="w-4 h-4" />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="text-white font-bold">{stat.away}{stat.suffix || ''}</span>
                  </div>
                  <div className="flex h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div 
                      className="bg-[#00d4ff] rounded-l-full"
                      style={{ width: `${stat.home / (stat.home + stat.away) * 100}%` }}
                    />
                    <div 
                      className="bg-[#8b5cf6] rounded-r-full"
                      style={{ width: `${stat.away / (stat.home + stat.away) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'h2h' && (
            <div className="space-y-6">
              {/* H2H Summary */}
              <div className="bg-[#141414] rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 text-center">Historique des confrontations</h4>
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="text-4xl font-black text-[#00d4ff]">{h2h.team1Wins}</p>
                    <p className="text-[#666] text-sm">{match.homeTeam.name.split(' ')[0]}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#666]">-</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-[#8b5cf6]">{h2h.team2Wins}</p>
                    <p className="text-[#666] text-sm">{match.awayTeam.name.split(' ')[0]}</p>
                  </div>
                </div>
              </div>
              
              {/* Recent Matches */}
              <div>
                <h4 className="text-white font-semibold mb-3">Dernières rencontres</h4>
                <div className="space-y-2">
                  {h2h.recentMatches.map((m, i) => (
                    <div key={i} className="bg-[#141414] rounded-lg p-3 flex items-center justify-between">
                      <span className={cn(
                        'font-medium',
                        m.winner === match.homeTeam.name ? 'text-[#00d4ff]' : 'text-[#8b5cf6]'
                      )}>
                        {m.winner}
                      </span>
                      <span className="text-white font-bold">{m.score}</span>
                      <span className="text-[#666] text-sm">{m.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer - Betting */}
        <div className="p-6 border-t border-[#2a2a2a] bg-[#0a0a0a]">
          <div className="flex gap-4">
            <Button
              onClick={() => onBet('home')}
              className="flex-1 py-6 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#00d4ff] text-white transition-all"
            >
              <div className="text-center">
                <p className="text-sm text-[#666] mb-1">{match.homeTeam.name}</p>
                <p className="text-2xl font-black text-[#00d4ff]">{match.odds.home.toFixed(2)}</p>
              </div>
            </Button>
            <Button
              onClick={() => onBet('away')}
              className="flex-1 py-6 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8b5cf6] text-white transition-all"
            >
              <div className="text-center">
                <p className="text-sm text-[#666] mb-1">{match.awayTeam.name}</p>
                <p className="text-2xl font-black text-[#8b5cf6]">{match.odds.away.toFixed(2)}</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
