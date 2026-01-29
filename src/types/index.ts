// Types pour les paris esports

export interface Team {
  id: string;
  name: string;
  logo?: string;
  country?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  sport: 'esports';
  league: string;
  startTime: string;
  status: 'live' | 'upcoming' | 'finished';
  score?: {
    home: number;
    away: number;
  };
  time?: string;
  odds: Odds;
}

export interface Odds {
  home: number;
  draw?: number;
  away: number;
}

export interface Bet {
  id: string;
  matchId: string;
  selection: 'home' | 'draw' | 'away';
  odds: number;
  stake: number;
  potentialWin: number;
}

export interface BetSlip {
  bets: Bet[];
  totalStake: number;
  totalPotentialWin: number;
}

export interface EsportsMatch extends Match {
  game: 'lol' | 'cs2' | 'valorant' | 'dota2';
  map?: string;
  format: 'bo1' | 'bo3' | 'bo5';
  currentGame?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  currency: string;
}

export interface League {
  id: string;
  name: string;
  region: string;
  flag: string;
  color: string;
}
