import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  User, 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Target,
  Percent,
  Clock,
  Crown,
  Medal,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  username: string;
  createdAt: string;
  balance: number;
  stats: {
    totalBets: number;
    wonBets: number;
    lostBets: number;
    pendingBets: number;
    totalWagered: number;
    totalWon: number;
    totalLost: number;
    winRate: number;
    profitLoss: number;
    bestWin: number;
    currentStreak: number;
    bestStreak: number;
    averageOdds: number;
    favoriteLeague: string;
  };
  recentBets: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    selection: 'home' | 'draw' | 'away';
    odds: number;
    stake: number;
    potentialWin: number;
    status: 'pending' | 'won' | 'lost';
    createdAt: string;
    league: string;
  }[];
  rank: number;
  badges: string[];
}

interface ProfilesPageProps {
  onBack: () => void;
}

// Fonction pour récupérer les profils depuis localStorage
function getAllProfiles(): UserProfile[] {
  const usersData = localStorage.getItem('betpro-users');
  if (!usersData) return [];

  const users = JSON.parse(usersData);
  const profiles: UserProfile[] = [];

  for (const user of users) {
    const betsData = localStorage.getItem(`betpro-bets-${user.id}`);
    const bets = betsData ? JSON.parse(betsData) : [];

    // Calculer les stats
    const wonBets = bets.filter((b: any) => b.status === 'won');
    const lostBets = bets.filter((b: any) => b.status === 'lost');
    const pendingBets = bets.filter((b: any) => b.status === 'pending');

    const totalWagered = bets.reduce((sum: number, b: any) => sum + b.stake, 0);
    const totalWon = wonBets.reduce((sum: number, b: any) => sum + b.potentialWin, 0);
    const totalLost = lostBets.reduce((sum: number, b: any) => sum + b.stake, 0);
    const winRate = bets.length > 0 ? (wonBets.length / (wonBets.length + lostBets.length)) * 100 || 0 : 0;
    const profitLoss = totalWon - totalLost;
    const bestWin = wonBets.length > 0 ? Math.max(...wonBets.map((b: any) => b.potentialWin)) : 0;
    const averageOdds = bets.length > 0 ? bets.reduce((sum: number, b: any) => sum + b.odds, 0) / bets.length : 0;

    // Calculer le streak actuel
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    const sortedBets = [...bets].sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    for (const bet of sortedBets) {
      if (bet.status === 'won') {
        tempStreak++;
        if (currentStreak === 0 || currentStreak > 0) currentStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else if (bet.status === 'lost') {
        if (currentStreak > 0) currentStreak = -1;
        else currentStreak--;
        tempStreak = 0;
      }
    }

    // Trouver la ligue favorite
    const leagueCounts: Record<string, number> = {};
    for (const bet of bets) {
      const league = bet.league || 'Unknown';
      leagueCounts[league] = (leagueCounts[league] || 0) + 1;
    }
    const favoriteLeague = Object.entries(leagueCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Badges
    const badges: string[] = [];
    if (wonBets.length >= 10) badges.push('🏆 Vétéran');
    if (winRate >= 60 && bets.length >= 5) badges.push('🎯 Précis');
    if (bestStreak >= 5) badges.push('🔥 En feu');
    if (profitLoss >= 500) badges.push('💰 Rentable');
    if (bets.length >= 50) badges.push('⭐ Assidu');
    if (averageOdds >= 2.5) badges.push('🎲 Risk Taker');

    profiles.push({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      balance: user.balance,
      stats: {
        totalBets: bets.length,
        wonBets: wonBets.length,
        lostBets: lostBets.length,
        pendingBets: pendingBets.length,
        totalWagered,
        totalWon,
        totalLost,
        winRate,
        profitLoss,
        bestWin,
        currentStreak,
        bestStreak,
        averageOdds,
        favoriteLeague,
      },
      recentBets: sortedBets.slice(0, 10).map((b: any) => ({
        ...b,
        league: b.league || 'League of Legends',
      })),
      rank: 0,
      badges,
    });
  }

  // Calculer les rangs basés sur le profit
  profiles.sort((a, b) => b.stats.profitLoss - a.stats.profitLoss);
  profiles.forEach((p, i) => p.rank = i + 1);

  return profiles;
}

export function ProfilesPage({ onBack }: ProfilesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [sortBy, setSortBy] = useState<'rank' | 'winRate' | 'profit' | 'bets'>('rank');

  useEffect(() => {
    setProfiles(getAllProfiles());
  }, []);

  // Filtrer et trier les profils
  const filteredProfiles = profiles
    .filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'winRate':
          return b.stats.winRate - a.stats.winRate;
        case 'profit':
          return b.stats.profitLoss - a.stats.profitLoss;
        case 'bets':
          return b.stats.totalBets - a.stats.totalBets;
        default:
          return a.rank - b.rank;
      }
    });

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
                <User className="w-5 h-5 text-[#00d4ff]" />
                <h1 className="text-xl font-bold">Profils des Joueurs</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProfile ? (
          // Vue détaillée du profil
          <ProfileDetail 
            profile={selectedProfile} 
            onBack={() => setSelectedProfile(null)} 
          />
        ) : (
          // Liste des profils
          <>
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <Input
                  type="text"
                  placeholder="Rechercher un joueur par pseudo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 bg-[#141414] border-[#2a2a2a] text-white placeholder:text-[#666] text-lg"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-[#141414] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#00d4ff]"
              >
                <option value="rank">Trier par Classement</option>
                <option value="winRate">Trier par Win Rate</option>
                <option value="profit">Trier par Profit</option>
                <option value="bets">Trier par Nb de Paris</option>
              </select>
            </div>

            {/* Stats globales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#666] text-sm mb-1">
                  <User className="w-4 h-4" />
                  Joueurs
                </div>
                <p className="text-2xl font-bold text-white">{profiles.length}</p>
              </div>
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#666] text-sm mb-1">
                  <Target className="w-4 h-4" />
                  Total Paris
                </div>
                <p className="text-2xl font-bold text-white">
                  {profiles.reduce((sum, p) => sum + p.stats.totalBets, 0)}
                </p>
              </div>
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#666] text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Meilleur Win Rate
                </div>
                <p className="text-2xl font-bold text-[#1aff6e]">
                  {Math.max(...profiles.map(p => p.stats.winRate), 0).toFixed(0)}%
                </p>
              </div>
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#666] text-sm mb-1">
                  <Trophy className="w-4 h-4" />
                  Meilleur Profit
                </div>
                <p className="text-2xl font-bold text-[#1aff6e]">
                  {Math.max(...profiles.map(p => p.stats.profitLoss), 0).toFixed(0)}€
                </p>
              </div>
            </div>

            {/* Profiles List */}
            {filteredProfiles.length > 0 ? (
              <div className="space-y-4">
                {filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onClick={() => setSelectedProfile(profile)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-[#666]" />
                </div>
                <p className="text-[#b3b3b3] mb-2">
                  {searchQuery ? 'Aucun joueur trouvé' : 'Aucun joueur inscrit'}
                </p>
                <p className="text-[#666] text-sm">
                  {searchQuery ? 'Essayez un autre pseudo' : 'Soyez le premier à vous inscrire !'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface ProfileCardProps {
  profile: UserProfile;
  onClick: () => void;
}

function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const { stats } = profile;

  return (
    <button
      onClick={onClick}
      className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#00d4ff] transition-all duration-300 text-left group"
    >
      <div className="flex items-center gap-4">
        {/* Rank & Avatar */}
        <div className="relative">
          <div className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold',
            profile.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
            profile.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
            profile.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
            'bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] text-white'
          )}>
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div className={cn(
            'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
            profile.rank <= 3 ? 'bg-[#1aff6e] text-black' : 'bg-[#2a2a2a] text-white'
          )}>
            #{profile.rank}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold text-lg group-hover:text-[#00d4ff] transition-colors">
              {profile.username}
            </h3>
            {profile.rank === 1 && <Crown className="w-5 h-5 text-yellow-500" />}
            {profile.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
            {profile.rank === 3 && <Medal className="w-5 h-5 text-orange-500" />}
          </div>
          <div className="flex flex-wrap gap-1">
            {profile.badges.slice(0, 3).map((badge, i) => (
              <span key={i} className="text-xs bg-[#2a2a2a] px-2 py-0.5 rounded">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-center">
            <p className="text-[#666] text-xs">Paris</p>
            <p className="text-white font-bold">{stats.totalBets}</p>
          </div>
          <div className="text-center">
            <p className="text-[#666] text-xs">Win Rate</p>
            <p className={cn(
              'font-bold',
              stats.winRate >= 50 ? 'text-[#1aff6e]' : 'text-red-500'
            )}>
              {stats.winRate.toFixed(0)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-[#666] text-xs">Profit</p>
            <p className={cn(
              'font-bold',
              stats.profitLoss >= 0 ? 'text-[#1aff6e]' : 'text-red-500'
            )}>
              {stats.profitLoss >= 0 ? '+' : ''}{stats.profitLoss.toFixed(0)}€
            </p>
          </div>
          <div className="text-center">
            <p className="text-[#666] text-xs">Solde</p>
            <p className="text-[#00d4ff] font-bold">{profile.balance.toFixed(0)}€</p>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="md:hidden flex items-center gap-3">
          <div className={cn(
            'px-2 py-1 rounded text-xs font-bold',
            stats.winRate >= 50 ? 'bg-[#1aff6e]/20 text-[#1aff6e]' : 'bg-red-500/20 text-red-500'
          )}>
            {stats.winRate.toFixed(0)}%
          </div>
          <div className={cn(
            'px-2 py-1 rounded text-xs font-bold',
            stats.profitLoss >= 0 ? 'bg-[#1aff6e]/20 text-[#1aff6e]' : 'bg-red-500/20 text-red-500'
          )}>
            {stats.profitLoss >= 0 ? '+' : ''}{stats.profitLoss.toFixed(0)}€
          </div>
        </div>
      </div>
    </button>
  );
}

interface ProfileDetailProps {
  profile: UserProfile;
  onBack: () => void;
}

function ProfileDetail({ profile, onBack }: ProfileDetailProps) {
  const [showAllBets, setShowAllBets] = useState(false);
  const { stats } = profile;

  const displayedBets = showAllBets ? profile.recentBets : profile.recentBets.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-[#b3b3b3] hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la liste
      </Button>

      {/* Profile Header */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className={cn(
              'w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold',
              profile.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
              profile.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
              profile.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
              'bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] text-white'
            )}>
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-[#1aff6e] rounded-full text-black text-sm font-bold">
              #{profile.rank}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-white">{profile.username}</h2>
              {profile.rank === 1 && <Crown className="w-8 h-8 text-yellow-500" />}
            </div>
            <div className="flex items-center gap-2 text-[#666] text-sm mb-3">
              <Calendar className="w-4 h-4" />
              Membre depuis {new Date(profile.createdAt).toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, i) => (
                <span key={i} className="text-sm bg-[#2a2a2a] px-3 py-1 rounded-full">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Balance */}
          <div className="text-center md:text-right">
            <p className="text-[#666] text-sm mb-1">Solde actuel</p>
            <p className="text-4xl font-black text-[#00d4ff]">{profile.balance.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Total Paris"
          value={stats.totalBets.toString()}
          color="#00d4ff"
        />
        <StatCard
          icon={Percent}
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          color={stats.winRate >= 50 ? '#1aff6e' : '#ff4757'}
        />
        <StatCard
          icon={stats.profitLoss >= 0 ? TrendingUp : TrendingDown}
          label="Profit/Perte"
          value={`${stats.profitLoss >= 0 ? '+' : ''}${stats.profitLoss.toFixed(2)}€`}
          color={stats.profitLoss >= 0 ? '#1aff6e' : '#ff4757'}
        />
        <StatCard
          icon={Flame}
          label="Meilleur Streak"
          value={`${stats.bestStreak} victoires`}
          color="#ffa502"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-white font-bold mb-4">Statistiques détaillées</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#666]">Paris gagnés</span>
              <span className="text-[#1aff6e] font-semibold">{stats.wonBets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Paris perdus</span>
              <span className="text-red-500 font-semibold">{stats.lostBets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Paris en cours</span>
              <span className="text-[#ffa502] font-semibold">{stats.pendingBets}</span>
            </div>
            <div className="h-px bg-[#2a2a2a] my-2" />
            <div className="flex justify-between">
              <span className="text-[#666]">Total misé</span>
              <span className="text-white font-semibold">{stats.totalWagered.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Total gagné</span>
              <span className="text-[#1aff6e] font-semibold">+{stats.totalWon.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Total perdu</span>
              <span className="text-red-500 font-semibold">-{stats.totalLost.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-white font-bold mb-4">Informations</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#666]">Cote moyenne</span>
              <span className="text-white font-semibold">{stats.averageOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Meilleur gain</span>
              <span className="text-[#1aff6e] font-semibold">+{stats.bestWin.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Streak actuel</span>
              <span className={cn(
                'font-semibold',
                stats.currentStreak > 0 ? 'text-[#1aff6e]' : stats.currentStreak < 0 ? 'text-red-500' : 'text-[#666]'
              )}>
                {stats.currentStreak > 0 ? `+${stats.currentStreak} W` : stats.currentStreak < 0 ? `${stats.currentStreak} L` : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Ligue favorite</span>
              <span className="text-[#00d4ff] font-semibold">{stats.favoriteLeague}</span>
            </div>
            <div className="h-px bg-[#2a2a2a] my-2" />
            <div className="flex justify-between">
              <span className="text-[#666]">ROI</span>
              <span className={cn(
                'font-semibold',
                stats.totalWagered > 0 
                  ? (stats.profitLoss / stats.totalWagered * 100) >= 0 ? 'text-[#1aff6e]' : 'text-red-500'
                  : 'text-[#666]'
              )}>
                {stats.totalWagered > 0 
                  ? `${((stats.profitLoss / stats.totalWagered) * 100).toFixed(1)}%`
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bets */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-white font-bold mb-4">Historique des paris récents</h3>
        
        {profile.recentBets.length > 0 ? (
          <>
            <div className="space-y-3">
              {displayedBets.map((bet) => (
                <div
                  key={bet.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    bet.status === 'won' ? 'bg-[#1aff6e]/5 border-[#1aff6e]/30' :
                    bet.status === 'lost' ? 'bg-red-500/5 border-red-500/30' :
                    'bg-[#0a0a0a] border-[#2a2a2a]'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {bet.homeTeam} vs {bet.awayTeam}
                      </span>
                      <span className="text-[#666] text-xs">{bet.league}</span>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-bold',
                      bet.status === 'won' ? 'bg-[#1aff6e]/20 text-[#1aff6e]' :
                      bet.status === 'lost' ? 'bg-red-500/20 text-red-500' :
                      'bg-[#ffa502]/20 text-[#ffa502]'
                    )}>
                      {bet.status === 'won' ? 'GAGNÉ' : bet.status === 'lost' ? 'PERDU' : 'EN COURS'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-[#666]">
                        Sélection: <span className="text-white">{bet.selection === 'home' ? '1' : '2'}</span>
                      </span>
                      <span className="text-[#666]">
                        Cote: <span className="text-white">{bet.odds.toFixed(2)}</span>
                      </span>
                      <span className="text-[#666]">
                        Mise: <span className="text-white">{bet.stake.toFixed(2)}€</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {bet.status === 'won' && (
                        <span className="text-[#1aff6e] font-bold">+{bet.potentialWin.toFixed(2)}€</span>
                      )}
                      {bet.status === 'lost' && (
                        <span className="text-red-500 font-bold">-{bet.stake.toFixed(2)}€</span>
                      )}
                      <span className="text-[#666] text-xs">
                        {new Date(bet.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {profile.recentBets.length > 5 && (
              <button
                onClick={() => setShowAllBets(!showAllBets)}
                className="mt-4 w-full py-2 text-[#00d4ff] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                {showAllBets ? (
                  <>Voir moins <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Voir plus ({profile.recentBets.length - 5} autres) <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-[#666] mx-auto mb-3" />
            <p className="text-[#666]">Aucun pari effectué pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
      <div className="flex items-center gap-2 text-[#666] text-sm mb-2">
        <Icon className="w-4 h-4" style={{ color }} />
        {label}
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}
