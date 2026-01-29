import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  currency: string;
  isLoggedIn: boolean;
}

export interface BetHistory {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  selection: 'home' | 'draw' | 'away';
  odds: number;
  stake: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
  settledAt?: string;
}

const DEFAULT_USER: User = {
  id: 'user-1',
  name: 'Joueur',
  email: 'joueur@betpro.fr',
  balance: 1000,
  currency: '€',
  isLoggedIn: true,
};

export function useUser() {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('betpro-user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });
  
  const [betHistory, setBetHistory] = useState<BetHistory[]>(() => {
    const saved = localStorage.getItem('betpro-history');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('betpro-user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('betpro-history', JSON.stringify(betHistory));
  }, [betHistory]);

  const addBalance = useCallback((amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount,
    }));
  }, []);

  const removeBalance = useCallback((amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
    }));
  }, []);

  const canBet = useCallback((amount: number) => {
    return user.balance >= amount;
  }, [user.balance]);

  const placeBet = useCallback((bet: Omit<BetHistory, 'id' | 'status' | 'createdAt'>) => {
    if (!canBet(bet.stake)) {
      return { success: false, error: 'Solde insuffisant' };
    }

    const newBet: BetHistory = {
      ...bet,
      id: `bet-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBetHistory(prev => [newBet, ...prev]);
    removeBalance(bet.stake);

    return { success: true, bet: newBet };
  }, [canBet, removeBalance]);

  const settleBet = useCallback((betId: string, result: 'won' | 'lost') => {
    setBetHistory(prev => prev.map(bet => {
      if (bet.id === betId) {
        if (result === 'won' && bet.status === 'pending') {
          addBalance(bet.potentialWin);
        }
        return {
          ...bet,
          status: result,
          settledAt: new Date().toISOString(),
        };
      }
      return bet;
    }));
  }, [addBalance]);

  const resetAccount = useCallback(() => {
    setUser(DEFAULT_USER);
    setBetHistory([]);
  }, []);

  const getPendingBets = useCallback(() => {
    return betHistory.filter(bet => bet.status === 'pending');
  }, [betHistory]);

  const getWonBets = useCallback(() => {
    return betHistory.filter(bet => bet.status === 'won');
  }, [betHistory]);

  const getLostBets = useCallback(() => {
    return betHistory.filter(bet => bet.status === 'lost');
  }, [betHistory]);

  const getTotalWinnings = useCallback(() => {
    return betHistory
      .filter(bet => bet.status === 'won')
      .reduce((total, bet) => total + bet.potentialWin, 0);
  }, [betHistory]);

  const getTotalLosses = useCallback(() => {
    return betHistory
      .filter(bet => bet.status === 'lost')
      .reduce((total, bet) => total + bet.stake, 0);
  }, [betHistory]);

  return {
    user,
    betHistory,
    addBalance,
    removeBalance,
    canBet,
    placeBet,
    settleBet,
    resetAccount,
    getPendingBets,
    getWonBets,
    getLostBets,
    getTotalWinnings,
    getTotalLosses,
  };
}
