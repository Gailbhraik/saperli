import { useState, useCallback } from 'react';
import type { Bet, Match } from '@/types';
import type { BetHistory } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  currency: string;
  isLoggedIn: boolean;
}

interface UseBetSlipProps {
  user: User;
  placeBet: (bet: Omit<BetHistory, 'id' | 'status' | 'placedAt'>) => Promise<{ success: boolean; error?: string }>;
}

export function useBetSlip({ user, placeBet }: UseBetSlipProps) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);

  const addBet = useCallback((match: Match, selection: 'home' | 'draw' | 'away', odds: number) => {
    setBets(prev => {
      // Vérifier si un pari existe déjà pour ce match
      const existingIndex = prev.findIndex(b => b.matchId === match.id);
      
      const newBet: Bet = {
        id: `bet-${Date.now()}`,
        matchId: match.id,
        selection,
        odds,
        stake: 10, // Mise par défaut
        potentialWin: +(10 * odds).toFixed(2),
        // Stocker les infos du match pour le pari
        matchData: {
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          league: match.league,
        }
      };

      if (existingIndex >= 0) {
        // Remplacer le pari existant
        const updated = [...prev];
        updated[existingIndex] = newBet;
        return updated;
      }

      return [...prev, newBet];
    });
    setIsOpen(true);
    setError(null);
  }, []);

  const removeBet = useCallback((betId: string) => {
    setBets(prev => prev.filter(b => b.id !== betId));
  }, []);

  const updateStake = useCallback((betId: string, stake: number) => {
    const validStake = Math.max(1, Math.round(stake));
    setBets(prev => prev.map(bet => {
      if (bet.id === betId) {
        return {
          ...bet,
          stake: validStake,
          potentialWin: +(validStake * bet.odds).toFixed(2)
        };
      }
      return bet;
    }));
  }, []);

  const clearBets = useCallback(() => {
    setBets([]);
    setError(null);
  }, []);

  const toggleSlip = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeSlip = useCallback(() => {
    setIsOpen(false);
  }, []);

  const placeBets = useCallback(async () => {
    if (bets.length === 0) {
      setError('Aucun pari sélectionné');
      return { success: false, error: 'Aucun pari sélectionné' };
    }

    if (!user.isLoggedIn) {
      setError('Vous devez être connecté pour parier');
      return { success: false, error: 'Vous devez être connecté pour parier' };
    }

    const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
    
    if (totalStake > user.balance) {
      const errorMsg = `Solde insuffisant. Vous avez ${user.balance.toFixed(2)}€ mais la mise totale est de ${totalStake.toFixed(2)}€`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsPlacing(true);
    setError(null);

    try {
      // Placer chaque pari
      for (const bet of bets) {
        const matchData = (bet as any).matchData || {};
        const selectedTeam = bet.selection === 'home' 
          ? matchData.homeTeam 
          : matchData.awayTeam;

        const result = await placeBet({
          matchId: bet.matchId,
          homeTeam: matchData.homeTeam || 'Équipe 1',
          awayTeam: matchData.awayTeam || 'Équipe 2',
          league: matchData.league,
          selection: bet.selection as 'home' | 'away',
          selectedTeam: selectedTeam || (bet.selection === 'home' ? 'Équipe 1' : 'Équipe 2'),
          odds: bet.odds,
          stake: bet.stake,
          potentialWin: bet.potentialWin,
        });
        
        if (!result.success) {
          setError(result.error || 'Erreur lors du placement du pari');
          setIsPlacing(false);
          return { success: false, error: result.error };
        }
      }

      // Vider le panier après avoir placé les paris
      setBets([]);
      setError(null);
      setIsPlacing(false);
      
      return { success: true };
    } catch (err) {
      const errorMsg = 'Erreur lors du placement des paris';
      setError(errorMsg);
      setIsPlacing(false);
      return { success: false, error: errorMsg };
    }
  }, [bets, user.balance, user.isLoggedIn, placeBet]);

  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalPotentialWin = bets.reduce((sum, bet) => sum + bet.potentialWin, 0);

  const hasBetOnMatch = useCallback((matchId: string) => {
    return bets.some(b => b.matchId === matchId);
  }, [bets]);

  const getBetForMatch = useCallback((matchId: string) => {
    return bets.find(b => b.matchId === matchId);
  }, [bets]);

  const canPlaceBets = user.isLoggedIn && totalStake <= user.balance && bets.length > 0 && !isPlacing;

  return {
    bets,
    isOpen,
    error,
    isPlacing,
    totalStake,
    totalPotentialWin,
    canPlaceBets,
    addBet,
    removeBet,
    updateStake,
    clearBets,
    toggleSlip,
    closeSlip,
    placeBets,
    hasBetOnMatch,
    getBetForMatch,
  };
}
