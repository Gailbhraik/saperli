import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Trophy, 
  TrendingUp, 
  Target, 
  Flame,
  Medal,
  Crown,
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getAllUsersStats, type UserStats } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilesPageProps {
  onBack: () => void;
}

export function ProfilesPage({ onBack }: ProfilesPageProps) {
  const { isOnline } = useAuth();
  const [profiles, setProfiles] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'winRate' | 'profit' | 'totalBets'>('rank');
  const [selectedProfile, setSelectedProfile] = useState<UserStats | null>(null);

  // Charger les profils
  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      try {
        if (isOnline) {
          const stats = await getAllUsersStats();
          setProfiles(stats);
        } else {
          // Mode hors ligne - charger depuis localStorage
          const users = JSON.parse(localStorage.getItem('betpro-users') || '[]');
          const localProfiles: UserStats[] = users.map((user: any, index: number) => {
            const bets = JSON.parse(localStorage.getItem(`betpro-bets-${user.id}`) || '[]');
            const totalBets = bets.length;
            const wonBets = bets.filter((b: any) => b.status === 'won').length;
            const lostBets = bets.filter((b: any) => b.status === 'lost').length;
            const pendingBets = bets.filter((b: any) => b.status === 'pending').length;
            const totalWagered = bets.reduce((sum: number, b: any) => sum + b.stake, 0);
            const totalWon = bets.filter((b: any) => b.status === 'won').reduce((sum: number, b: any) => sum + b.potentialWin, 0);
            const winRate = totalBets > 0 ? (wonBets / (wonBets + lostBets)) * 100 || 0 : 0;
            const profitLoss = totalWon - totalWagered;

            return {
              id: user.id,
              username: user.username,
              balance: user.balance,
              created_at: user.createdAt,
              totalBets,
              wonBets,
              lostBets,
              pendingBets,
              totalWagered,
              totalWon,
              winRate,
              profitLoss,
              rank: index + 1,
              badges: [],
            };
          });
          // Trier par profit
          localProfiles.sort((a, b) => b.profitLoss - a.profitLoss);
          localProfiles.forEach((p, i) => p.rank = i + 1);
          setProfiles(localProfiles);
        }
      } catch (error) {
        console.error('Erreur chargement profils:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [isOnline]);

  // Filtrer et trier les profils
  const filteredProfiles = profiles
    .filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'winRate': return b.winRate - a.winRate;
        case 'profit': return b.profitLoss - a.profitLoss;
        case 'totalBets': return b.totalBets - a.totalBets;
        default: return a.rank - b.rank;
      }
    });

  // Stats globales
  const globalStats = {
    totalPlayers: profiles.length,
    totalBets: profiles.reduce((sum, p) => sum + p.totalBets, 0),
    bestWinRate: profiles.length > 0 ? Math.max(...profiles.map(p => p.winRate)) : 0,
    bestProfit: profiles.length > 0 ? Math.max(...profiles.map(p => p.profitLoss)) : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#00d4ff] animate-spin mx-auto mb-4" />
          <p className="text-[#b3b3b3]">Chargement du classement...</p>
        </div>
      </div>
    );
  }

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
                <Trophy className="w-5 h-5 text-[#ffa502]" />
                <h1 className="text-xl font-bold">Classement</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1aff6e]/20 border border-[#1aff6e]/30 rounded-full">
                  <Wifi className="w-4 h-4 text-[#1aff6e]" />
                  <span className="text-[#1aff6e] text-sm font-medium">En ligne</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ffa502]/20 border border-[#ffa502]/30 rounded-full">
                  <WifiOff className="w-4 h-4 text-[#ffa502]" />
                  <span className="text-[#ffa502] text-sm font-medium">Hors ligne</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Joueurs"
            value={globalStats.totalPlayers.toString()}
            color="#00d4ff"
          />
          <StatCard
            icon={Target}
            label="Paris totaux"
            value={globalStats.totalBets.toString()}
            color="#8b5cf6"
          />
          <StatCard
            icon={TrendingUp}
            label="Meilleur Win Rate"
            value={`${globalStats.bestWinRate.toFixed(1)}%`}
            color="#1aff6e"
          />
          <StatCard
            icon={Trophy}
            label="Meilleur Profit"
            value={`${globalStats.bestProfit >= 0 ? '+' : ''}${globalStats.bestProfit.toFixed(0)}€`}
            color="#ffa502"
          />
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <Input
              type="text"
              placeholder="Rechercher un joueur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#141414] border-[#2a2a2a] text-white placeholder:text-[#666]"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#00d4ff]"
          >
            <option value="rank">Trier par rang</option>
            <option value="winRate">Trier par win rate</option>
            <option value="profit">Trier par profit</option>
            <option value="totalBets">Trier par nombre de paris</option>
          </select>
        </div>

        {/* Liste ou Détail */}
        {selectedProfile ? (
          <ProfileDetail 
            profile={selectedProfile} 
            onBack={() => setSelectedProfile(null)} 
          />
        ) : (
          <>
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
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-[#666] mx-auto mb-4" />
                <p className="text-[#b3b3b3] mb-2">Aucun joueur trouvé</p>
                <p className="text-[#666] text-sm">
                  {profiles.length === 0 
                    ? 'Soyez le premier à vous inscrire !' 
                    : 'Essayez une autre recherche'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Composant StatCard
function StatCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-[#666] text-xs">{label}</p>
        </div>
      </div>
    </div>
  );
}

// Composant ProfileCard
function ProfileCard({ profile, onClick }: { profile: UserStats; onClick: () => void }) {
  const getRankStyle = (rank: number) => {
    if (rank === 1) return { bg: 'from-[#ffd700] to-[#ffb700]', text: 'text-[#0a0a0a]', icon: Crown };
    if (rank === 2) return { bg: 'from-[#c0c0c0] to-[#a0a0a0]', text: 'text-[#0a0a0a]', icon: Medal };
    if (rank === 3) return { bg: 'from-[#cd7f32] to-[#b87333]', text: 'text-[#0a0a0a]', icon: Medal };
    return { bg: 'from-[#00d4ff] to-[#8b5cf6]', text: 'text-white', icon: null };
  };

  const rankStyle = getRankStyle(profile.rank);

  return (
    <div
      onClick={onClick}
      className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        {/* Rang */}
        <div 
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg bg-gradient-to-br',
            rankStyle.bg,
            rankStyle.text
          )}
        >
          {rankStyle.icon ? (
            <rankStyle.icon className="w-6 h-6" />
          ) : (
            `#${profile.rank}`
          )}
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold truncate">{profile.username}</h3>
            {profile.badges.slice(0, 3).map((badge, i) => (
              <span key={i} className="text-sm">{badge.split(' ')[0]}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#666]">
              {profile.totalBets} paris
            </span>
            <span className={profile.winRate >= 50 ? 'text-[#1aff6e]' : 'text-[#ff4757]'}>
              {profile.winRate.toFixed(1)}% win
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right">
          <p className={cn(
            'text-xl font-bold',
            profile.profitLoss >= 0 ? 'text-[#1aff6e]' : 'text-[#ff4757]'
          )}>
            {profile.profitLoss >= 0 ? '+' : ''}{profile.profitLoss.toFixed(0)}€
          </p>
          <p className="text-[#666] text-sm">Profit</p>
        </div>

        {/* Arrow */}
        <ChevronDown className="w-5 h-5 text-[#666] group-hover:text-white transition-colors rotate-[-90deg]" />
      </div>
    </div>
  );
}

// Composant ProfileDetail
function ProfileDetail({ profile, onBack }: { profile: UserStats; onBack: () => void }) {
  const roi = profile.totalWagered > 0 
    ? ((profile.totalWon - profile.totalWagered) / profile.totalWagered * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-[#666] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
          <p className="text-[#666] text-sm">
            Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-3xl font-black bg-gradient-to-r from-[#ffd700] to-[#ff8c00] bg-clip-text text-transparent">
            #{profile.rank}
          </p>
          <p className="text-[#666] text-sm">Classement</p>
        </div>
      </div>

      {/* Badges */}
      {profile.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {profile.badges.map((badge, i) => (
            <span 
              key={i}
              className="px-3 py-1 bg-[#141414] border border-[#2a2a2a] rounded-full text-sm"
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-[#666] text-xs mb-1">Solde</p>
          <p className="text-2xl font-bold text-[#00d4ff]">{profile.balance.toFixed(0)}€</p>
        </div>
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-[#666] text-xs mb-1">Total misé</p>
          <p className="text-2xl font-bold text-white">{profile.totalWagered.toFixed(0)}€</p>
        </div>
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-[#666] text-xs mb-1">Total gagné</p>
          <p className="text-2xl font-bold text-[#1aff6e]">{profile.totalWon.toFixed(0)}€</p>
        </div>
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-[#666] text-xs mb-1">Profit/Perte</p>
          <p className={cn(
            'text-2xl font-bold',
            profile.profitLoss >= 0 ? 'text-[#1aff6e]' : 'text-[#ff4757]'
          )}>
            {profile.profitLoss >= 0 ? '+' : ''}{profile.profitLoss.toFixed(0)}€
          </p>
        </div>
      </div>

      {/* Stats détaillées */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#00d4ff]" />
            Statistiques de paris
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[#666]">Paris totaux</span>
              <span className="text-white font-semibold">{profile.totalBets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Paris gagnés</span>
              <span className="text-[#1aff6e] font-semibold">{profile.wonBets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Paris perdus</span>
              <span className="text-[#ff4757] font-semibold">{profile.lostBets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Paris en cours</span>
              <span className="text-[#ffa502] font-semibold">{profile.pendingBets}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1aff6e]" />
            Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[#666]">Win Rate</span>
              <span className={cn(
                'font-semibold',
                profile.winRate >= 50 ? 'text-[#1aff6e]' : 'text-[#ff4757]'
              )}>
                {profile.winRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">ROI</span>
              <span className={cn(
                'font-semibold',
                roi >= 0 ? 'text-[#1aff6e]' : 'text-[#ff4757]'
              )}>
                {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666]">Mise moyenne</span>
              <span className="text-white font-semibold">
                {profile.totalBets > 0 ? (profile.totalWagered / profile.totalBets).toFixed(0) : 0}€
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression Win Rate */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">Répartition des résultats</h3>
        <div className="flex h-4 rounded-full overflow-hidden bg-[#2a2a2a]">
          {profile.wonBets > 0 && (
            <div 
              className="bg-[#1aff6e] transition-all"
              style={{ width: `${(profile.wonBets / profile.totalBets) * 100}%` }}
            />
          )}
          {profile.pendingBets > 0 && (
            <div 
              className="bg-[#ffa502] transition-all"
              style={{ width: `${(profile.pendingBets / profile.totalBets) * 100}%` }}
            />
          )}
          {profile.lostBets > 0 && (
            <div 
              className="bg-[#ff4757] transition-all"
              style={{ width: `${(profile.lostBets / profile.totalBets) * 100}%` }}
            />
          )}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-[#1aff6e]">✓ {profile.wonBets} gagnés</span>
          <span className="text-[#ffa502]">⏳ {profile.pendingBets} en cours</span>
          <span className="text-[#ff4757]">✗ {profile.lostBets} perdus</span>
        </div>
      </div>
    </div>
  );
}
