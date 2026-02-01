import type { PolymarketMarket, PolymarketAnalysis, PolymarketRecommendation, MarketOutcome } from '@/types';

// Configuration API Polymarket
const POLYMARKET_API_BASE = 'https://gamma-api.polymarket.com';

// Proxy CORS fonctionnel
const CORS_PROXY = 'https://api.codetabs.com/v1/proxy?quest=';

// Interface pour la réponse de l'API Polymarket
interface PolymarketApiEvent {
  id: string;
  slug: string;
  title: string;
  description?: string;
  active: boolean;
  closed: boolean;
  archived?: boolean;
  tags?: Array<{ id: string; label: string; slug: string }>;
  markets?: Array<{
    id: string;
    question: string;
    outcomes: string;
    outcomePrices: string;
    clobTokenIds?: string[];
    volume24hr?: string;
    volume?: string;
    volume1wk?: string;
    volume1mo?: string;
    liquidity?: string;
    liquidityClob?: string;
    openInterest?: string;
    commentCount?: number;
    endDate?: string;
    createdAt?: string;
    startDate?: string;
    closedTime?: string;
    active?: boolean;
    closed?: boolean;
    lastTradePrice?: string;
    bestBid?: string;
    bestAsk?: string;
    spread?: string;
    oneDayPriceChange?: number;
    oneWeekPriceChange?: number;
    oneMonthPriceChange?: number;
    competitive?: number;
    negRisk?: boolean;
    restricted?: boolean;
    image?: string;
    icon?: string;
  }>;
  endDate?: string;
  createdAt?: string;
  startDate?: string;
  closedTime?: string;
  volume24hr?: string;
  volume?: string;
  volume1wk?: string;
  volume1mo?: string;
  liquidity?: string;
  liquidityClob?: string;
  openInterest?: string;
  commentCount?: number;
  image?: string;
  icon?: string;
  competitive?: number;
  negRisk?: boolean;
  restricted?: boolean;
}

// Icônes par catégorie
const CATEGORY_ICONS: Record<string, string> = {
  'crypto': '₿',
  'bitcoin': '₿',
  'ethereum': 'Ξ',
  'politics': '🗳️',
  'us-politics': '🇺🇸',
  'sports': '⚽',
  'nba': '🏀',
  'nfl': '🏈',
  'soccer': '⚽',
  'technology': '🤖',
  'tech': '💻',
  'ai': '🧠',
  'finance': '💵',
  'economy': '📈',
  'business': '💼',
  'gaming': '🎮',
  'games': '🎲',
  'entertainment': '🎬',
  'science': '🔬',
  'world': '🌍',
  'stocks': '📊',
};

// Mapper les tags vers des catégories
function getCategoryFromTags(tags?: Array<{ label: string; slug: string }>): string {
  if (!tags || tags.length === 0) return 'Autre';
  
  const tagSlugs = tags.map(t => t.slug.toLowerCase());
  
  if (tagSlugs.some(s => ['crypto', 'bitcoin', 'ethereum', 'solana'].includes(s))) return 'Crypto';
  if (tagSlugs.some(s => ['politics', 'us-politics', 'elections', 'trump'].includes(s))) return 'Politique';
  if (tagSlugs.some(s => ['sports', 'nba', 'nfl', 'soccer', 'esports'].includes(s))) return 'Sports';
  if (tagSlugs.some(s => ['technology', 'tech', 'ai', 'artificial-intelligence'].includes(s))) return 'Technologie';
  if (tagSlugs.some(s => ['finance', 'economy', 'markets', 'fed', 'business', 'stocks'].includes(s))) return 'Finance';
  if (tagSlugs.some(s => ['gaming', 'games', 'video-games'].includes(s))) return 'Gaming';
  if (tagSlugs.some(s => ['entertainment', 'movies', 'music'].includes(s))) return 'Entertainment';
  if (tagSlugs.some(s => ['science', 'space', 'physics'].includes(s))) return 'Science';
  if (tagSlugs.some(s => ['world', 'international', 'geopolitics'].includes(s))) return 'Monde';
  
  return tags[0]?.label || 'Autre';
}

// Obtenir l'icône pour une catégorie
function getIconForCategory(category: string, tags?: Array<{ slug: string }>): string {
  if (tags) {
    for (const tag of tags) {
      const icon = CATEGORY_ICONS[tag.slug.toLowerCase()];
      if (icon) return icon;
    }
  }
  
  const icons: Record<string, string> = {
    'Crypto': '₿',
    'Politique': '🗳️',
    'Sports': '⚽',
    'Technologie': '🤖',
    'Finance': '💵',
    'Gaming': '🎮',
    'Entertainment': '🎬',
    'Science': '🔬',
    'Monde': '🌍',
    'Autre': '📊',
  };
  
  return icons[category] || '📊';
}

// Transformer un event API en notre format
function transformApiEvent(event: PolymarketApiEvent): PolymarketMarket | null {
  try {
    // Chercher un marché actif et ouvert
    const market = event.markets?.find(m => m.active !== false && m.closed !== true) || event.markets?.[0];
    if (!market) return null;
    
    // Parser les outcomes et les prix
    const outcomes: string[] = JSON.parse(market.outcomes || '[]');
    const outcomePrices: string[] = JSON.parse(market.outcomePrices || '[]');
    
    if (outcomes.length === 0 || outcomePrices.length === 0) return null;
    
    // Créer les outcomes formatés
    const formattedOutcomes: MarketOutcome[] = outcomes.map((name, index) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      probability: parseFloat(outcomePrices[index] || '0.5'),
      price: parseFloat(outcomePrices[index] || '0.5'),
    }));
    
    // Extraire toutes les métriques financières
    const liquidity = parseFloat(market.liquidityClob || market.liquidity || event.liquidityClob || event.liquidity || '0');
    const liquidityClob = parseFloat(market.liquidityClob || event.liquidityClob || '0');
    const volume24h = parseFloat(market.volume24hr || event.volume24hr || '0');
    const volume = parseFloat(market.volume || event.volume || '0');
    const volume1wk = parseFloat(market.volume1wk || event.volume1wk || '0');
    const volume1mo = parseFloat(market.volume1mo || event.volume1mo || '0');
    const openInterest = parseFloat(market.openInterest || event.openInterest || '0');
    
    // Extraire les prix et spread
    const lastTradePrice = parseFloat(market.lastTradePrice || '0') || undefined;
    const bestBid = parseFloat(market.bestBid || '0') || undefined;
    const bestAsk = parseFloat(market.bestAsk || '0') || undefined;
    const spread = parseFloat(market.spread || '0') || undefined;
    
    // Extraire les variations de prix
    const oneDayPriceChange = market.oneDayPriceChange || undefined;
    const oneWeekPriceChange = market.oneWeekPriceChange || undefined;
    const oneMonthPriceChange = market.oneMonthPriceChange || undefined;
    
    // Extraire les métriques sociales
    const commentCount = market.commentCount || event.commentCount || undefined;
    
    // Extraire les scores
    const competitive = market.competitive || event.competitive || undefined;
    const negRisk = market.negRisk || event.negRisk || undefined;
    const restricted = market.restricted || event.restricted || undefined;
    
    const category = getCategoryFromTags(event.tags);
    
    return {
      id: event.id,
      slug: event.slug,
      title: event.title || market.question,
      description: event.description || '',
      category,
      outcomes: formattedOutcomes,
      // Données financières
      liquidity,
      liquidityClob: liquidityClob || undefined,
      volume24h,
      volume,
      volume1wk: volume1wk || undefined,
      volume1mo: volume1mo || undefined,
      openInterest: openInterest || undefined,
      // Prix et spread
      lastTradePrice,
      bestBid,
      bestAsk,
      spread,
      // Variations de prix
      oneDayPriceChange,
      oneWeekPriceChange,
      oneMonthPriceChange,
      // Métriques sociales
      commentCount,
      // Scores
      competitive,
      negRisk,
      restricted,
      // Dates
      endDate: market.endDate || event.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: market.createdAt || event.createdAt || new Date().toISOString(),
      startDate: market.startDate || event.startDate || undefined,
      closedTime: market.closedTime || event.closedTime || undefined,
      // Status
      status: (market.closed || event.closed) ? 'closed' : 'active',
      // Médias
      icon: getIconForCategory(category, event.tags),
      image: market.image || event.image || undefined,
      // Tendances
      trend: volume24h > 50000 ? 'up' : volume24h > 10000 ? 'stable' : 'down',
      volumeTrend: Math.floor((Math.random() - 0.5) * 40),
    };
  } catch (error) {
    console.error('Error transforming event:', error, event);
    return null;
  }
}

// Récupérer les marchés depuis l'API Polymarket via proxy CORS
export async function fetchPolymarketMarkets(limit: number = 30): Promise<PolymarketMarket[]> {
  try {
    // Utiliser l'endpoint avec les meilleurs volumes
    const url = `${POLYMARKET_API_BASE}/events?active=true&closed=false&limit=${limit}&order=volume24hr&ascending=false`;
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data: PolymarketApiEvent[] = await response.json();
    
    // Transformer les events en marchés
    const markets = data
      .map(transformApiEvent)
      .filter((m): m is PolymarketMarket => m !== null);
    
    if (markets.length === 0) {
      throw new Error('Aucun marché valide trouvé');
    }
    
    return markets;
    
  } catch (error) {
    console.error('Erreur lors de la récupération des marchés:', error);
    throw new Error('Impossible de récupérer les marchés. Veuillez réessayer.');
  }
}

// Récupérer un marché spécifique par son slug
export async function fetchPolymarketMarketBySlug(slug: string): Promise<PolymarketMarket | null> {
  try {
    const url = `${POLYMARKET_API_BASE}/markets?slug=${encodeURIComponent(slug)}`;
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return transformApiEvent(data[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du marché:', error);
    return null;
  }
}

// Récupérer les tags/catégories disponibles
export async function fetchPolymarketTags(): Promise<Array<{ id: string; label: string; slug: string }>> {
  try {
    const url = `${POLYMARKET_API_BASE}/tags?limit=100`;
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error);
    return [];
  }
}

// Analyser un marché individuel
export function analyzeMarket(market: PolymarketMarket): PolymarketAnalysis {
  const outcomes = market.outcomes;
  
  if (outcomes.length < 2) {
    return {
      market,
      expectedValue: 0,
      confidence: 0,
      recommendation: 'hold',
      potentialProfit: 0,
      riskScore: 100,
      analysis: 'Marché incomplet - moins de 2 outcomes',
    };
  }
  
  // Trouver le meilleur outcome
  let bestOutcome: MarketOutcome = outcomes[0];
  let bestExpectedValue = 0;
  let recommendation: 'buy' | 'sell' | 'hold' = 'hold';
  
  for (const outcome of outcomes) {
    const expectedValue = outcome.price * (1 / outcome.price);
    
    if (expectedValue > bestExpectedValue) {
      bestExpectedValue = expectedValue;
      bestOutcome = outcome;
    }
  }
  
  // Stratégie: acheter si l'EV > 1.05 (marge de 5%)
  if (bestExpectedValue > 1.05) {
    recommendation = 'buy';
  }
  
  // Calculer le profit potentiel
  const stake = 100;
  const potentialProfit = recommendation === 'buy' 
    ? (stake / bestOutcome.price) - stake
    : 0;
  
  // Calculer le score de confiance
  const liquidityScore = Math.min(100, market.liquidity / 100000);
  const volumeScore = Math.min(100, market.volume24h / 100000);
  const evScore = Math.min(100, (bestExpectedValue - 1) * 500);
  const confidence = Math.min(100, (liquidityScore * 0.4 + volumeScore * 0.4 + evScore * 0.2));
  
  // Calculer le risque
  const riskScore = Math.max(0, 100 - confidence - (market.liquidity / 200000));
  
  // Générer l'analyse textuelle
  let analysis = '';
  if (recommendation === 'buy') {
    const roi = ((1 / bestOutcome.price) - 1) * 100;
    analysis = `Opportunité d'achat sur "${bestOutcome.name}". ROI potentiel: ${roi.toFixed(1)}%. Prix: ${(bestOutcome.price * 100).toFixed(1)}¢`;
  } else {
    const spread = Math.abs(outcomes[0].price - outcomes[1]?.price || 0);
    if (spread < 0.1) {
      analysis = 'Marché équilibré. Pas d\'opportunité évidente.';
    } else {
      analysis = `Marché déséquilibré. Favorise ${outcomes[0].price > (outcomes[1]?.price || 0) ? outcomes[0].name : outcomes[1]?.name || ''}.`;
    }
  }
  
  return {
    market,
    expectedValue: bestExpectedValue,
    confidence,
    recommendation,
    potentialProfit,
    riskScore,
    analysis,
    bestOutcome,
  };
}

// Calculer les meilleurs achats
export function calculateBestBuys(
  analyses: PolymarketAnalysis[], 
  minConfidence: number = 60
): PolymarketRecommendation[] {
  const buys: PolymarketRecommendation[] = analyses
    .filter(a => a.recommendation === 'buy' && a.confidence >= minConfidence)
    .sort((a, b) => b.expectedValue - a.expectedValue)
    .slice(0, 10)
    .map((analysis, index) => ({
      ...analysis,
      rank: index + 1,
      urgency: (analysis.confidence > 80 ? 'high' : analysis.confidence > 65 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    }));
  
  return buys;
}

// Calculer le score global du marché
export function calculateMarketScore(market: PolymarketMarket): number {
  const liquidityScore = Math.min(100, market.liquidity / 100000);
  const volumeScore = Math.min(100, market.volume24h / 100000);
  const trendScore = market.trend === 'up' ? 100 : market.trend === 'down' ? 50 : 75;
  const volumeTrendScore = Math.max(0, Math.min(100, 50 + market.volumeTrend));
  
  return Math.round((liquidityScore + volumeScore + trendScore + volumeTrendScore) / 4);
}

// Fonctions de compatibilité (toujours retourner false car on utilise l'API réelle)
export function isDemoMode(): boolean {
  return false;
}

export function setDemoMode(_enabled: boolean): void {
  // No-op
}
