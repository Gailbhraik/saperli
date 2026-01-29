import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types
export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface BetHistory {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  selection: 'home' | 'draw' | 'away';
  odds: number;
  stake: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
  settledAt?: string;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  
  login: (username: string, password: string) => { success: boolean; error?: string };
  register: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  
  addBalance: (amount: number) => void;
  removeBalance: (amount: number) => void;
  canBet: (amount: number) => boolean;
  
  betHistory: BetHistory[];
  placeBet: (bet: Omit<BetHistory, 'id' | 'status' | 'createdAt'>) => { success: boolean; error?: string; bet?: BetHistory };
  settleBet: (betId: string, result: 'won' | 'lost') => void;
  
  getPendingBets: () => BetHistory[];
  getWonBets: () => BetHistory[];
  getLostBets: () => BetHistory[];
  getTotalWinnings: () => number;
  getTotalLosses: () => number;
  
  resetAccount: () => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

const USERS_KEY = 'betpro-users';
const CURRENT_USER_KEY = 'betpro-current-user';
const BETS_PREFIX = 'betpro-bets-';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUsers = localStorage.getItem(USERS_KEY);
    const savedCurrentUserId = localStorage.getItem(CURRENT_USER_KEY);
    
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers) as UserAccount[];
      setUsers(parsedUsers);
      
      if (savedCurrentUserId) {
        const user = parsedUsers.find(u => u.id === savedCurrentUserId);
        if (user) {
          setCurrentUser(user);
          const savedBets = localStorage.getItem(BETS_PREFIX + user.id);
          if (savedBets) {
            setBetHistory(JSON.parse(savedBets));
          }
        }
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }, [users, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, currentUser.id);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? currentUser : u));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  }, [currentUser, isLoading]);

  useEffect(() => {
    if (!isLoading && currentUser) {
      localStorage.setItem(BETS_PREFIX + currentUser.id, JSON.stringify(betHistory));
    }
  }, [betHistory, currentUser, isLoading]);

  const register = useCallback((username: string, password: string) => {
    const trimmedUsername = username.trim().toLowerCase();
    
    if (trimmedUsername.length < 3) {
      return { success: false, error: 'Le pseudo doit contenir au moins 3 caractères' };
    }
    if (trimmedUsername.length > 20) {
      return { success: false, error: 'Le pseudo ne peut pas dépasser 20 caractères' };
    }
    if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
      return { success: false, error: 'Le pseudo ne peut contenir que des lettres, chiffres et underscores' };
    }
    if (password.length < 4) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 4 caractères' };
    }
    
    if (users.some(u => u.username === trimmedUsername)) {
      return { success: false, error: 'Ce pseudo est déjà pris' };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username: trimmedUsername,
      passwordHash: simpleHash(password),
      balance: 1000,
      currency: '€',
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setBetHistory([]);
    
    return { success: true };
  }, [users]);

  const login = useCallback((username: string, password: string) => {
    const trimmedUsername = username.trim().toLowerCase();
    const user = users.find(u => u.username === trimmedUsername);
    
    if (!user) {
      return { success: false, error: 'Pseudo ou mot de passe incorrect' };
    }
    
    if (user.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Pseudo ou mot de passe incorrect' };
    }

    setCurrentUser(user);
    
    const savedBets = localStorage.getItem(BETS_PREFIX + user.id);
    if (savedBets) {
      setBetHistory(JSON.parse(savedBets));
    } else {
      setBetHistory([]);
    }
    
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setBetHistory([]);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const addBalance = useCallback((amount: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
  }, [currentUser]);

  const removeBalance = useCallback((amount: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, balance: Math.max(0, prev.balance - amount) } : null);
  }, [currentUser]);

  const canBet = useCallback((amount: number) => {
    return currentUser ? currentUser.balance >= amount : false;
  }, [currentUser]);

  const placeBet = useCallback((bet: Omit<BetHistory, 'id' | 'status' | 'createdAt'>) => {
    if (!currentUser) {
      return { success: false, error: 'Vous devez être connecté pour parier' };
    }
    
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
  }, [currentUser, canBet, removeBalance]);

  const settleBet = useCallback((betId: string, result: 'won' | 'lost') => {
    setBetHistory(prev => prev.map(bet => {
      if (bet.id === betId && bet.status === 'pending') {
        if (result === 'won') {
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
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, balance: 1000 } : null);
    setBetHistory([]);
  }, [currentUser]);

  const deleteAccount = useCallback(() => {
    if (!currentUser) return;
    
    setUsers(prev => prev.filter(u => u.id !== currentUser.id));
    localStorage.removeItem(BETS_PREFIX + currentUser.id);
    logout();
  }, [currentUser, logout]);

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

  const value: AuthContextType = {
    currentUser,
    isLoggedIn: !!currentUser,
    isLoading,
    login,
    register,
    logout,
    addBalance,
    removeBalance,
    canBet,
    betHistory,
    placeBet,
    settleBet,
    getPendingBets,
    getWonBets,
    getLostBets,
    getTotalWinnings,
    getTotalLosses,
    resetAccount,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
