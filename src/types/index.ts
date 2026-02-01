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
  matchData?: {
    homeTeam: string;
    awayTeam: string;
    league: string;
  };
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

export type SportType = 'football' | 'tennis' | 'basketball' | 'esports';

// Types pour Polymarket

export interface MarketOutcome {
  id: string;
  name: string;
  probability: number;
  price: number;
}

export interface PolymarketMarket {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  outcomes: MarketOutcome[];
  
  // Données financières
  liquidity: number;
  liquidityClob?: number;
  volume24h: number;
  volume: number;
  volume1wk?: number;
  volume1mo?: number;
  openInterest?: number;
  
  // Prix et spread
  lastTradePrice?: number;
  bestBid?: number;
  bestAsk?: number;
  spread?: number;
  
  // Variations de prix
  oneDayPriceChange?: number;
  oneWeekPriceChange?: number;
  oneMonthPriceChange?: number;
  
  // Métriques sociales et engagement
  commentCount?: number;
  traderCount?: number;
  uniqueTraders?: number;
  
  // Scores et métriques
  competitive?: number;
  negRisk?: boolean;
  restricted?: boolean;
  
  // Dates
  endDate: string;
  createdAt: string;
  startDate?: string;
  closedTime?: string;
  
  // Status
  status: 'active' | 'resolved' | 'closed';
  
  // Médias
  icon?: string;
  image?: string;
  
  // Tendances
  trend: 'up' | 'down' | 'stable';
  volumeTrend: number;
}

export interface PolymarketAnalysis {
  market: PolymarketMarket;
  expectedValue: number;
  confidence: number;
  recommendation: 'buy' | 'sell' | 'hold';
  potentialProfit: number;
  riskScore: number;
  analysis: string;
  bestOutcome?: MarketOutcome;
}

export interface PolymarketRecommendation extends PolymarketAnalysis {
  rank: number;
  urgency: 'high' | 'medium' | 'low';
}

export interface PolymarketPortfolio {
  positions: PolymarketPosition[];
  totalValue: number;
  totalProfit: number;
  roi: number;
}

export interface PolymarketPosition {
  id: string;
  market: PolymarketMarket;
  outcome: MarketOutcome;
  shares: number;
  avgPrice: number;
  currentValue: number;
  profit: number;
  roi: number;
}
