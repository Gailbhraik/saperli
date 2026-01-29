import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
// Tu devras créer un projet sur https://supabase.com et remplacer ces valeurs
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export interface DbUser {
  id: string;
  username: string;
  email: string;
  balance: number;
  created_at: string;
  avatar_url?: string;
}

export interface DbBet {
  id: string;
  user_id: string;
  match_id: string;
  home_team: string;
  away_team: string;
  league: string;
  selection: 'home' | 'away';
  selected_team: string;
  odds: number;
  stake: number;
  potential_win: number;
  status: 'pending' | 'won' | 'lost';
  placed_at: string;
  settled_at?: string;
}

// ============ USERS ============

// Inscription
export async function signUp(email: string, password: string, username: string): Promise<{ user: DbUser | null; error: string | null }> {
  // Vérifier si le username existe déjà
  const { data: existingUser } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single();

  if (existingUser) {
    return { user: null, error: 'Ce nom d\'utilisateur est déjà pris' };
  }

  // Créer le compte auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { user: null, error: authError.message };
  }

  if (!authData.user) {
    return { user: null, error: 'Erreur lors de la création du compte' };
  }

  // Créer le profil utilisateur
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      username,
      email,
      balance: 1000, // Solde de départ
    })
    .select()
    .single();

  if (userError) {
    return { user: null, error: userError.message };
  }

  return { user: userData, error: null };
}

// Connexion
export async function signIn(email: string, password: string): Promise<{ user: DbUser | null; error: string | null }> {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { user: null, error: authError.message };
  }

  if (!authData.user) {
    return { user: null, error: 'Utilisateur non trouvé' };
  }

  // Récupérer le profil
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (userError) {
    return { user: null, error: userError.message };
  }

  return { user: userData, error: null };
}

// Déconnexion
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// Récupérer l'utilisateur courant
export async function getCurrentUser(): Promise<DbUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return userData;
}

// Mettre à jour le solde
export async function updateBalance(userId: string, newBalance: number): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({ balance: newBalance })
    .eq('id', userId);

  return !error;
}

// Récupérer tous les utilisateurs (pour le classement)
export async function getAllUsers(): Promise<DbUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('balance', { ascending: false });

  if (error) {
    console.error('Erreur getAllUsers:', error);
    return [];
  }

  return data || [];
}

// ============ BETS ============

// Placer un pari
export async function placeBet(bet: Omit<DbBet, 'id' | 'placed_at' | 'status'>): Promise<{ bet: DbBet | null; error: string | null }> {
  // Vérifier le solde
  const { data: user } = await supabase
    .from('users')
    .select('balance')
    .eq('id', bet.user_id)
    .single();

  if (!user || user.balance < bet.stake) {
    return { bet: null, error: 'Solde insuffisant' };
  }

  // Déduire la mise du solde
  const { error: balanceError } = await supabase
    .from('users')
    .update({ balance: user.balance - bet.stake })
    .eq('id', bet.user_id);

  if (balanceError) {
    return { bet: null, error: 'Erreur lors de la mise à jour du solde' };
  }

  // Créer le pari
  const { data: betData, error: betError } = await supabase
    .from('bets')
    .insert({
      ...bet,
      status: 'pending',
    })
    .select()
    .single();

  if (betError) {
    // Rembourser en cas d'erreur
    await supabase
      .from('users')
      .update({ balance: user.balance })
      .eq('id', bet.user_id);
    return { bet: null, error: betError.message };
  }

  return { bet: betData, error: null };
}

// Récupérer les paris d'un utilisateur
export async function getUserBets(userId: string): Promise<DbBet[]> {
  const { data, error } = await supabase
    .from('bets')
    .select('*')
    .eq('user_id', userId)
    .order('placed_at', { ascending: false });

  if (error) {
    console.error('Erreur getUserBets:', error);
    return [];
  }

  return data || [];
}

// Récupérer tous les paris (pour les stats globales)
export async function getAllBets(): Promise<DbBet[]> {
  const { data, error } = await supabase
    .from('bets')
    .select('*')
    .order('placed_at', { ascending: false });

  if (error) {
    console.error('Erreur getAllBets:', error);
    return [];
  }

  return data || [];
}

// Récupérer les paris avec les infos utilisateur
export async function getBetsWithUsers(): Promise<(DbBet & { user: DbUser })[]> {
  const { data, error } = await supabase
    .from('bets')
    .select(`
      *,
      user:users(*)
    `)
    .order('placed_at', { ascending: false });

  if (error) {
    console.error('Erreur getBetsWithUsers:', error);
    return [];
  }

  return data || [];
}

// Mettre à jour le statut d'un pari (admin)
export async function settleBet(betId: string, won: boolean): Promise<boolean> {
  const { data: bet, error: fetchError } = await supabase
    .from('bets')
    .select('*')
    .eq('id', betId)
    .single();

  if (fetchError || !bet) return false;

  // Mettre à jour le statut
  const { error: updateError } = await supabase
    .from('bets')
    .update({
      status: won ? 'won' : 'lost',
      settled_at: new Date().toISOString(),
    })
    .eq('id', betId);

  if (updateError) return false;

  // Si gagné, créditer le gain
  if (won) {
    const { data: user } = await supabase
      .from('users')
      .select('balance')
      .eq('id', bet.user_id)
      .single();

    if (user) {
      await supabase
        .from('users')
        .update({ balance: user.balance + bet.potential_win })
        .eq('id', bet.user_id);
    }
  }

  return true;
}

// ============ STATS & CLASSEMENT ============

export interface UserStats {
  id: string;
  username: string;
  balance: number;
  created_at: string;
  totalBets: number;
  wonBets: number;
  lostBets: number;
  pendingBets: number;
  totalWagered: number;
  totalWon: number;
  winRate: number;
  profitLoss: number;
  rank: number;
  badges: string[];
}

// Calculer les stats d'un utilisateur
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!user) return null;

  const bets = await getUserBets(userId);

  const totalBets = bets.length;
  const wonBets = bets.filter(b => b.status === 'won').length;
  const lostBets = bets.filter(b => b.status === 'lost').length;
  const pendingBets = bets.filter(b => b.status === 'pending').length;
  const totalWagered = bets.reduce((sum, b) => sum + b.stake, 0);
  const totalWon = bets.filter(b => b.status === 'won').reduce((sum, b) => sum + b.potential_win, 0);
  const winRate = totalBets > 0 ? (wonBets / (wonBets + lostBets)) * 100 || 0 : 0;
  const profitLoss = totalWon - totalWagered;

  // Calculer les badges
  const badges: string[] = [];
  if (wonBets >= 10) badges.push('🏆 Vétéran');
  if (winRate >= 60 && totalBets >= 5) badges.push('🎯 Précis');
  if (profitLoss >= 500) badges.push('💰 Rentable');
  if (totalBets >= 50) badges.push('⭐ Assidu');

  return {
    id: user.id,
    username: user.username,
    balance: user.balance,
    created_at: user.created_at,
    totalBets,
    wonBets,
    lostBets,
    pendingBets,
    totalWagered,
    totalWon,
    winRate,
    profitLoss,
    rank: 0, // Sera calculé dans getAllUsersStats
    badges,
  };
}

// Récupérer le classement complet
export async function getAllUsersStats(): Promise<UserStats[]> {
  const users = await getAllUsers();
  const allBets = await getAllBets();

  const stats: UserStats[] = users.map(user => {
    const userBets = allBets.filter(b => b.user_id === user.id);
    
    const totalBets = userBets.length;
    const wonBets = userBets.filter(b => b.status === 'won').length;
    const lostBets = userBets.filter(b => b.status === 'lost').length;
    const pendingBets = userBets.filter(b => b.status === 'pending').length;
    const totalWagered = userBets.reduce((sum, b) => sum + b.stake, 0);
    const totalWon = userBets.filter(b => b.status === 'won').reduce((sum, b) => sum + b.potential_win, 0);
    const winRate = totalBets > 0 ? (wonBets / (wonBets + lostBets)) * 100 || 0 : 0;
    const profitLoss = totalWon - totalWagered;

    // Badges
    const badges: string[] = [];
    if (wonBets >= 10) badges.push('🏆 Vétéran');
    if (winRate >= 60 && totalBets >= 5) badges.push('🎯 Précis');
    if (profitLoss >= 500) badges.push('💰 Rentable');
    if (totalBets >= 50) badges.push('⭐ Assidu');

    return {
      id: user.id,
      username: user.username,
      balance: user.balance,
      created_at: user.created_at,
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      totalWagered,
      totalWon,
      winRate,
      profitLoss,
      rank: 0,
      badges,
    };
  });

  // Trier par profit et assigner les rangs
  stats.sort((a, b) => b.profitLoss - a.profitLoss);
  stats.forEach((s, i) => s.rank = i + 1);

  return stats;
}

// ============ REALTIME ============

// S'abonner aux changements de paris
export function subscribeToBets(callback: (bets: DbBet[]) => void) {
  return supabase
    .channel('bets-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bets' }, async () => {
      const bets = await getAllBets();
      callback(bets);
    })
    .subscribe();
}

// S'abonner aux changements d'utilisateurs
export function subscribeToUsers(callback: (users: DbUser[]) => void) {
  return supabase
    .channel('users-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, async () => {
      const users = await getAllUsers();
      callback(users);
    })
    .subscribe();
}
