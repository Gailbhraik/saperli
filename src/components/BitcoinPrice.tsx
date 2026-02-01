import { useState, useEffect } from 'react';
import { Bitcoin, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BitcoinPriceDisplayProps {
  className?: string;
}

export function BitcoinPriceDisplay({ className }: BitcoinPriceDisplayProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchBitcoinPrice = async () => {
    try {
      // Utiliser CoinGecko API (gratuit, pas de clé nécessaire)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Bitcoin price');
      }

      const data = await response.json();
      const btcData = data.bitcoin;
      
      setPrice(btcData.usd);
      setPriceChange(btcData.usd_24h_change || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      // Fallback sur une valeur par défaut si l'API échoue
      setPrice(95000);
      setPriceChange(2.5);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBitcoinPrice();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchBitcoinPrice, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const isPositive = priceChange >= 0;

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg", className)}>
        <Bitcoin className="w-5 h-5 text-[#f7931a]" />
        <span className="text-[#666] text-sm">Chargement...</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg hover:border-[#f7931a]/50 transition-all",
      className
    )}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#f7931a]/20 rounded-full flex items-center justify-center">
          <Bitcoin className="w-5 h-5 text-[#f7931a]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-[#666]">BTC/USD</span>
          <span className="text-sm font-bold text-white">
            ${price?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
      
      <div className={cn(
        "flex items-center text-xs font-medium px-2 py-1 rounded",
        isPositive ? "bg-[#1aff6e]/20 text-[#1aff6e]" : "bg-red-500/20 text-red-400"
      )}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
      </div>
    </div>
  );
}
