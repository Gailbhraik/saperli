import { ArrowLeft, Users, Search, Filter, Shield, User, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePlayers } from '@/hooks/usePlayers';
import type { PlayerData, TeamData } from '@/services/api-players';

interface PlayersPageProps {
  onBack: () => void;
}

const roleLabels: Record<string, string> = {
  top: 'Top',
  jungle: 'Jungle',
  mid: 'Mid',
  adc: 'ADC',
  support: 'Support',
};

const roleIcons: Record<string, string> = {
  top: '⚔️',
  jungle: '🌲',
  mid: '🔮',
  adc: '🏹',
  support: '🛡️',
};

export function PlayersPage({ onBack }: PlayersPageProps) {
  const {
    teams,
    filteredPlayers,
    loading,
    error,
    searchQuery,
    selectedLeague,
    selectedTeam,
    setSearchQuery,
    setSelectedLeague,
    setSelectedTeam,
    getTeamsByLeague,
  } = usePlayers();

  // Regrouper les joueurs par équipe
  const playersByTeam = filteredPlayers.reduce<Record<string, PlayerData[]>>((acc, player) => {
    if (!acc[player.teamId]) {
      acc[player.teamId] = [];
    }
    acc[player.teamId].push(player);
    return acc;
  }, {});

  // Obtenir les équipes filtrées
  const filteredTeams = selectedLeague ? getTeamsByLeague(selectedLeague) : teams;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#00d4ff] animate-spin mx-auto mb-4" />
          <p className="text-[#b3b3b3]">Chargement des joueurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Erreur</h3>
          <p className="text-[#b3b3b3] mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] hover:opacity-90"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-[#b3b3b3] hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <div className="h-6 w-px bg-[#2a2a2a]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Joueurs</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666]" />
              <Input
                type="text"
                placeholder="Rechercher un joueur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#666]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 h-screen flex">
        {/* Sidebar - Leagues & Teams */}
        <div className="w-[320px] bg-[#141414] border-r border-[#2a2a2a] flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Leagues */}
              <div>
                <h3 className="text-sm font-semibold text-[#b3b3b3] mb-3 px-2">LIGUES</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedLeague(null);
                      setSelectedTeam(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      !selectedLeague 
                        ? 'bg-[#2a2a2a] text-white' 
                        : 'text-[#b3b3b3] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Toutes les ligues</span>
                  </button>
                  {teams.length > 0 && (
                    <>
                      {Array.from(new Set(teams.map(t => ({ id: t.leagueId, name: t.leagueName, color: t.leagueColor })))).map((league) => (
                        <button
                          key={league.id}
                          onClick={() => {
                            setSelectedLeague(league.id);
                            setSelectedTeam(null);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            selectedLeague === league.id 
                              ? 'bg-[#2a2a2a] text-white' 
                              : 'text-[#b3b3b3] hover:bg-[#1a1a1a]'
                          }`}
                        >
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: league.color }}
                          />
                          <span className="font-medium">{league.name}</span>
                          <Badge 
                            variant="outline" 
                            className="ml-auto text-xs"
                            style={{ borderColor: league.color, color: league.color }}
                          >
                            {getTeamsByLeague(league.id).length}
                          </Badge>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Teams */}
              <div>
                <h3 className="text-sm font-semibold text-[#b3b3b3] mb-3 px-2">ÉQUIPES</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      !selectedTeam 
                        ? 'bg-[#2a2a2a] text-white' 
                        : 'text-[#b3b3b3] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Toutes les équipes</span>
                  </button>
                  {filteredTeams.map((team: TeamData) => {
                    const playerCount = team.players?.length || 0;
                    return (
                      <button
                        key={team.id}
                        onClick={() => setSelectedTeam(team.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          selectedTeam === team.id 
                            ? 'bg-[#2a2a2a] text-white border border-[#3a3a3a]' 
                            : 'text-[#b3b3b3] hover:bg-[#1a1a1a]'
                        }`}
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: team.leagueColor }}
                        />
                        <span className="text-sm truncate">{team.name}</span>
                        <Badge 
                          variant="secondary" 
                          className="ml-auto text-xs bg-[#1a1a1a] text-[#666]"
                        >
                          {playerCount}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Players */}
        <div className="flex-1 bg-[#0a0a0a] overflow-auto">
          <div className="p-6 max-w-[1400px]">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="bg-[#141414] border-[#2a2a2a]">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-[#00d4ff]">{filteredPlayers.length}</p>
                  <p className="text-sm text-[#b3b3b3]">Joueurs</p>
                </CardContent>
              </Card>
              <Card className="bg-[#141414] border-[#2a2a2a]">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-[#8b5cf6]">{filteredTeams.length}</p>
                  <p className="text-sm text-[#b3b3b3]">Équipes</p>
                </CardContent>
              </Card>
              <Card className="bg-[#141414] border-[#2a2a2a]">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-[#1aff6e]">
                    {selectedLeague ? '1' : Array.from(new Set(teams.map(t => t.leagueId))).length}
                  </p>
                  <p className="text-sm text-[#b3b3b3]">Ligues</p>
                </CardContent>
              </Card>
            </div>

            {/* Players by Team */}
            {Object.keys(playersByTeam).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(playersByTeam)
                  .sort(([teamIdA], [teamIdB]) => {
                    const teamA = teams.find((t: TeamData) => t.id === teamIdA);
                    const teamB = teams.find((t: TeamData) => t.id === teamIdB);
                    if (!teamA || !teamB) return 0;
                    // Trier par leagueName d'abord, puis par teamName
                    if (teamA.leagueName !== teamB.leagueName) {
                      return teamA.leagueName.localeCompare(teamB.leagueName);
                    }
                    return teamA.name.localeCompare(teamB.name);
                  })
                  .map(([teamId, players]) => {
                  const team = teams.find((t: TeamData) => t.id === teamId);
                  if (!team) return null;
                  
                  return (
                    <Card key={teamId} className="bg-[#141414] border-[#2a2a2a] overflow-hidden">
                      <CardHeader className="bg-[#1a1a1a] border-b border-[#2a2a2a] pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${team.leagueColor}20` }}
                            >
                              <Shield className="w-5 h-5" style={{ color: team.leagueColor }} />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">{team.name}</CardTitle>
                              <p className="text-sm text-[#b3b3b3] flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {team.leagueName}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            style={{ borderColor: team.leagueColor, color: team.leagueColor }}
                          >
                            {team.leagueName}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-5 divide-x divide-[#2a2a2a]">
                          {['top', 'jungle', 'mid', 'adc', 'support'].map((role) => {
                            const player = players.find((p: PlayerData) => p.role === role);
                            if (!player) return (
                              <div key={role} className="p-4 text-center">
                                <span className="text-2xl">{roleIcons[role]}</span>
                                <p className="text-sm text-[#666] mt-2">{roleLabels[role]}</p>
                                <p className="text-xs text-[#444]">-</p>
                              </div>
                            );
                            
                            return (
                              <div key={player.id} className="p-4 hover:bg-[#1a1a1a] transition-colors">
                                <div className="flex flex-col items-center text-center">
                                  <Avatar className="w-12 h-12 mb-2" style={{ backgroundColor: `${team.leagueColor}30` }}>
                                    <AvatarFallback style={{ color: team.leagueColor }}>
                                      {player.gamertag.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="font-semibold text-white">{player.gamertag}</p>
                                  <p className="text-xs text-[#666]">{player.name}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-sm">{roleIcons[role]}</span>
                                    <span className="text-xs text-[#b3b3b3]">{roleLabels[role]}</span>
                                  </div>
                                  <Badge variant="secondary" className="mt-2 text-xs bg-[#1a1a1a]">
                                    {player.country}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Aucun joueur trouvé</h3>
                <p className="text-[#b3b3b3]">Essayez de modifier vos filtres ou votre recherche</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
