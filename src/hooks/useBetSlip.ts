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
  placeBet: (bet: Omit<BetHistory, 'id' | 'status' | 'createdAt'>) => { success: boolean; error?: string; bet?: BetHistory };
}

export function useBetSlip({ user, placeBet }: UseBetSlipProps) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        potentialWin: 10 * odds
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
    const validStake = Math.max(1, stake);
    setBets(prev => prev.map(bet => {
      if (bet.id === betId) {
        return {
          ...bet,
          stake: validStake,
          potentialWin: validStake * bet.odds
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

  const placeBets = useCallback(() => {
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

    // Placer chaque pari
    const placedBets: BetHistory[] = [];
    for (const bet of bets) {
      const result = placeBet({
        matchId: bet.matchId,
        homeTeam: '', // Sera rempli par le composant parent
        awayTeam: '', // Sera rempli par le composant parent
        selection: bet.selection,
        odds: bet.odds,
        stake: bet.stake,
        potentialWin: bet.potentialWin,
      });
      
      if (result.success && result.bet) {
        placedBets.push(result.bet);
      }
    }

    // Vider le panier après avoir placé les paris
    setBets([]);
    setError(null);
    
    return { success: true, bets: placedBets };
  }, [bets, user.balance, user.isLoggedIn, placeBet]);

  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalPotentialWin = bets.reduce((sum, bet) => sum + bet.potentialWin, 0);

  const hasBetOnMatch = useCallback((matchId: string) => {
    return bets.some(b => b.matchId === matchId);
  }, [bets]);

  const getBetForMatch = useCallback((matchId: string) => {
    return bets.find(b => b.matchId === matchId);
  }, [bets]);

  const canPlaceBets = user.isLoggedIn && totalStake <= user.balance && bets.length > 0;

  return {
    bets,
    isOpen,
    error,
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
