import { useState, useEffect, useCallback } from 'react';
import type { EsportsMatch } from '@/types';
import { fetchAllMatches } from '@/services/api';

export function useMatches() {
  const [allMatches, setAllMatches] = useState<EsportsMatch[]>([]);
  const [lecMatches, setLecMatches] = useState<EsportsMatch[]>([]);
  const [lflMatches, setLflMatches] = useState<EsportsMatch[]>([]);
  const [internationalMatches, setInternationalMatches] = useState<EsportsMatch[]>([]);
  const [liveMatches, setLiveMatches] = useState<EsportsMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllMatches();
      
      setAllMatches(data.esports);
      setLecMatches(data.lec);
      setLflMatches(data.lfl);
      setInternationalMatches(data.international);
      setLiveMatches(data.live);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des matchs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    
    // Rafraîchir toutes les 2 minutes pour les matchs esport
    const interval = setInterval(fetchMatches, 120000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  const getMatchesByLeague = useCallback((league: string): EsportsMatch[] => {
    return allMatches.filter(m => 
      m.league.toLowerCase().includes(league.toLowerCase())
    );
  }, [allMatches]);

  const upcomingMatches = allMatches.filter(m => m.status === 'upcoming');

  return {
    allMatches,
    lecMatches,
    lflMatches,
    internationalMatches,
    liveMatches,
    upcomingMatches,
    loading,
    error,
    lastUpdated,
    refetch: fetchMatches,
    getMatchesByLeague,
  };
}

export function useLiveMatches() {
  const { liveMatches, loading, error } = useMatches();
  return { liveMatches, loading, error };
}
