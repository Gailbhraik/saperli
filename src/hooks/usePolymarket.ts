import { useState, useEffect, useCallback } from 'react';
import type { PolymarketMarket, PolymarketAnalysis, PolymarketRecommendation } from '@/types';
import { fetchPolymarketMarkets, analyzeMarket, calculateBestBuys } from '@/services/api-polymarket';

interface UsePolymarketReturn {
  markets: PolymarketMarket[];
  analysis: PolymarketAnalysis[];
  recommendations: PolymarketRecommendation[];
  loading: boolean;
  error: string | null;
  refreshMarkets: () => Promise<void>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  minLiquidity: number;
  setMinLiquidity: (value: number) => void;
  minConfidence: number;
  setMinConfidence: (value: number) => void;
  categories: string[];
}

const CATEGORIES = ['Tous', 'Crypto', 'Politique', 'Sports', 'Technologie', 'Finance', 'Gaming'];

export function usePolymarket(): UsePolymarketReturn {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [analysis, setAnalysis] = useState<PolymarketAnalysis[]>([]);
  const [recommendations, setRecommendations] = useState<PolymarketRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [minLiquidity, setMinLiquidity] = useState(10000);
  const [minConfidence, setMinConfidence] = useState(60);

  const analyzeMarkets = useCallback((marketsData: PolymarketMarket[]) => {
    const analyzed = marketsData.map(market => analyzeMarket(market));
    setAnalysis(analyzed);
    
    const bestBuys = calculateBestBuys(analyzed, minConfidence);
    setRecommendations(bestBuys);
  }, [minConfidence]);

  const refreshMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPolymarketMarkets();
      
      let filtered = data;
      if (selectedCategory !== 'Tous') {
        filtered = data.filter(m => 
          m.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      filtered = filtered.filter(m => m.liquidity >= minLiquidity);
      
      setMarkets(filtered);
      analyzeMarkets(filtered);
    } catch (err) {
      setError('Erreur lors du chargement des marchés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, minLiquidity, analyzeMarkets]);

  useEffect(() => {
    refreshMarkets();
  }, [refreshMarkets]);

  useEffect(() => {
    if (markets.length > 0) {
      analyzeMarkets(markets);
    }
  }, [minConfidence, markets, analyzeMarkets]);

  return {
    markets,
    analysis,
    recommendations,
    loading,
    error,
    refreshMarkets,
    selectedCategory,
    setSelectedCategory,
    minLiquidity,
    setMinLiquidity,
    minConfidence,
    setMinConfidence,
    categories: CATEGORIES,
  };
}
