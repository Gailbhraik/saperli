import { useState, useEffect, useCallback } from 'react';
import { fetchTeamsAndPlayers, searchPlayers, filterPlayersByLeague, filterPlayersByTeam } from '@/services/api-players';
import type { PlayerData, TeamData } from '@/services/api-players';

interface UsePlayersReturn {
  teams: TeamData[];
  players: PlayerData[];
  filteredPlayers: PlayerData[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedLeague: string | null;
  selectedTeam: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedLeague: (leagueId: string | null) => void;
  setSelectedTeam: (teamId: string | null) => void;
  refetch: () => void;
  getTeamsByLeague: (leagueId: string) => TeamData[];
  getPlayersByTeam: (teamId: string) => PlayerData[];
}

export function usePlayers(): UsePlayersReturn {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchTeamsAndPlayers();
      setTeams(data.teams);
      setPlayers(data.players);
    } catch (err) {
      setError('Erreur lors du chargement des joueurs');
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculer les joueurs filtrés
  const filteredPlayers = (() => {
    let filtered = players;
    
    if (selectedLeague) {
      filtered = filterPlayersByLeague(filtered, selectedLeague);
    }
    
    if (selectedTeam) {
      filtered = filterPlayersByTeam(filtered, selectedTeam);
    }
    
    if (searchQuery) {
      filtered = searchPlayers(filtered, searchQuery);
    }
    
    return filtered;
  })();

  const getTeamsByLeague = useCallback((leagueId: string) => {
    return teams.filter(team => team.leagueId === leagueId);
  }, [teams]);

  const getPlayersByTeam = useCallback((teamId: string) => {
    return players.filter(player => player.teamId === teamId);
  }, [players]);

  return {
    teams,
    players,
    filteredPlayers,
    loading,
    error,
    searchQuery,
    selectedLeague,
    selectedTeam,
    setSearchQuery,
    setSelectedLeague,
    setSelectedTeam,
    refetch: fetchData,
    getTeamsByLeague,
    getPlayersByTeam,
  };
}
