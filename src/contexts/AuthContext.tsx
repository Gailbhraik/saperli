import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type AuthChangeEvent, type Session } from '@supabase/supabase-js';
import {
  supabase,
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getCurrentUser,
  getUserBets,
  placeBet as supabasePlaceBet,
  getUserStats,
  type DbUser,
  type DbBet,
  type UserStats
} from '@/lib/supabase';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface BetHistory {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  selection: 'home' | 'away';
  selectedTeam: string;
  odds: number;
  stake: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost';
  placedAt: string;
  settledAt?: string;
}

interface AuthContextType {
  user: User | null;
  currentUser: User | null; // Alias for user
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  addBetToHistory: (bet: Omit<BetHistory, 'id' | 'placedAt' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  placeBet: (bet: Omit<BetHistory, 'id' | 'placedAt' | 'status'>) => Promise<{ success: boolean; error?: string }>; // Alias for addBetToHistory
  getBetHistory: () => BetHistory[];
  betHistory: BetHistory[]; // Direct access
  getUserStatsData: () => Promise<UserStats | null>;
  isOnline: boolean;
  resetAccount: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convertir DbUser en User
function dbUserToUser(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    balance: dbUser.balance,
    createdAt: dbUser.created_at,
  };
}

// Convertir DbBet en BetHistory
function dbBetToBetHistory(dbBet: DbBet): BetHistory {
  return {
    id: dbBet.id,
    matchId: dbBet.match_id,
    homeTeam: dbBet.home_team,
    awayTeam: dbBet.away_team,
    league: dbBet.league,
    selection: dbBet.selection,
    selectedTeam: dbBet.selected_team,
    odds: dbBet.odds,
    stake: dbBet.stake,
    potentialWin: dbBet.potential_win,
    status: dbBet.status,
    placedAt: dbBet.placed_at,
    settledAt: dbBet.settled_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Vérifier la connexion Supabase au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const dbUser = await getCurrentUser();
        if (dbUser) {
          setUser(dbUserToUser(dbUser));
          const bets = await getUserBets(dbUser.id);
          setBetHistory(bets.map(dbBetToBetHistory));
        }
        setIsOnline(true);
      } catch (error) {
        console.log('Mode hors ligne - utilisation du localStorage');
        setIsOnline(false);
        // Fallback localStorage
        const savedUser = localStorage.getItem('betpro-current-user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          const savedBets = localStorage.getItem(`betpro-bets-${userData.id}`);
          if (savedBets) {
            setBetHistory(JSON.parse(savedBets));
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const dbUser = await getCurrentUser();
        if (dbUser) {
          setUser(dbUserToUser(dbUser));
          const bets = await getUserBets(dbUser.id);
          setBetHistory(bets.map(dbBetToBetHistory));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setBetHistory([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isOnline) {
      const { user: dbUser, error } = await supabaseSignIn(email, password);
      if (error) {
        return { success: false, error };
      }
      if (dbUser) {
        const userData = dbUserToUser(dbUser);
        setUser(userData);
        const bets = await getUserBets(dbUser.id);
        setBetHistory(bets.map(dbBetToBetHistory));
        // Sauvegarder aussi en local pour le mode hors ligne
        localStorage.setItem('betpro-current-user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: 'Erreur inconnue' };
    } else {
      // Mode hors ligne - fallback localStorage
      const users = JSON.parse(localStorage.getItem('betpro-users') || '[]');
      const foundUser = users.find((u: any) => u.email === email);
      if (!foundUser) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }
      if (foundUser.password !== password) {
        return { success: false, error: 'Mot de passe incorrect' };
      }
      const { password: _, ...userData } = foundUser;
      setUser(userData);
      localStorage.setItem('betpro-current-user', JSON.stringify(userData));
      const savedBets = localStorage.getItem(`betpro-bets-${userData.id}`);
      if (savedBets) {
        setBetHistory(JSON.parse(savedBets));
      }
      return { success: true };
    }
  };

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isOnline) {
      const { user: dbUser, error } = await supabaseSignUp(email, password, username);
      if (error) {
        return { success: false, error };
      }
      if (dbUser) {
        const userData = dbUserToUser(dbUser);
        setUser(userData);
        setBetHistory([]);
        localStorage.setItem('betpro-current-user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: 'Erreur lors de la création du compte' };
    } else {
      // Mode hors ligne - fallback localStorage
      const users = JSON.parse(localStorage.getItem('betpro-users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }
      if (users.some((u: any) => u.username === username)) {
        return { success: false, error: 'Ce nom d\'utilisateur est déjà pris' };
      }
      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        password,
        balance: 1000,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem('betpro-users', JSON.stringify(users));
      const { password: _, ...userData } = newUser;
      setUser(userData);
      localStorage.setItem('betpro-current-user', JSON.stringify(userData));
      setBetHistory([]);
      return { success: true };
    }
  };

  const logout = async () => {
    if (isOnline) {
      await supabaseSignOut();
    }
    setUser(null);
    setBetHistory([]);
    localStorage.removeItem('betpro-current-user');
  };

  const updateBalance = async (newBalance: number) => {
    if (!user) return;

    if (isOnline) {
      const { error } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.id);

      if (!error) {
        setUser({ ...user, balance: newBalance });
        localStorage.setItem('betpro-current-user', JSON.stringify({ ...user, balance: newBalance }));
      }
    } else {
      // Mode hors ligne
      const users = JSON.parse(localStorage.getItem('betpro-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].balance = newBalance;
        localStorage.setItem('betpro-users', JSON.stringify(users));
      }
      setUser({ ...user, balance: newBalance });
      localStorage.setItem('betpro-current-user', JSON.stringify({ ...user, balance: newBalance }));
    }
  };

  const addBetToHistory = async (bet: Omit<BetHistory, 'id' | 'placedAt' | 'status'>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Non connecté' };

    if (isOnline) {
      const { bet: newBet, error } = await supabasePlaceBet({
        user_id: user.id,
        match_id: bet.matchId,
        home_team: bet.homeTeam,
        away_team: bet.awayTeam,
        league: bet.league || '',
        selection: bet.selection,
        selected_team: bet.selectedTeam,
        odds: bet.odds,
        stake: bet.stake,
        potential_win: bet.potentialWin,
      });

      if (error) {
        return { success: false, error };
      }

      if (newBet) {
        setBetHistory(prev => [dbBetToBetHistory(newBet), ...prev]);
        // Mettre à jour le solde local
        setUser({ ...user, balance: user.balance - bet.stake });
        return { success: true };
      }

      return { success: false, error: 'Erreur inconnue' };
    } else {
      // Mode hors ligne
      const newBet: BetHistory = {
        ...bet,
        id: crypto.randomUUID(),
        status: 'pending',
        placedAt: new Date().toISOString(),
      };

      const newHistory = [newBet, ...betHistory];
      setBetHistory(newHistory);
      localStorage.setItem(`betpro-bets-${user.id}`, JSON.stringify(newHistory));

      // Mettre à jour le solde
      updateBalance(user.balance - bet.stake);

      return { success: true };
    }
  };

  const getBetHistory = () => betHistory;

  const getUserStatsData = async (): Promise<UserStats | null> => {
    if (!user) return null;
    if (isOnline) {
      return await getUserStats(user.id);
    }
    // Mode hors ligne - calcul local
    const totalBets = betHistory.length;
    const wonBets = betHistory.filter(b => b.status === 'won').length;
    const lostBets = betHistory.filter(b => b.status === 'lost').length;
    const pendingBets = betHistory.filter(b => b.status === 'pending').length;
    const totalWagered = betHistory.reduce((sum, b) => sum + b.stake, 0);
    const totalWon = betHistory.filter(b => b.status === 'won').reduce((sum, b) => sum + b.potentialWin, 0);
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
      rank: 1,
      badges: [],
    };
  };

  const resetAccount = async () => {
    if (user) {
      await updateBalance(1000);
    }
  };

  const deleteAccount = async () => {
    // Note: Deleting a user in Supabase typically requires admin rights or specific RLS policies.
    // For now we will just sign out.
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user, // Alias
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        logout,
        updateBalance,
        addBetToHistory,
        placeBet: addBetToHistory, // Alias
        getBetHistory,
        betHistory, // Direct access
        getUserStatsData,
        isOnline,
        resetAccount,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
