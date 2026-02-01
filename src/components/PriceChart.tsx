import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { PolymarketMarket } from '@/types';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  market: PolymarketMarket;
}

type TimeRange = '1d' | '1w' | '1m';

export function PriceChart({ market }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1d');

  // Générer des données d'historique basées sur les variations disponibles
  const generateChartData = () => {
    const basePrice = market.outcomes[0]?.price || 0.5;
    
    let change = 0;
    if (timeRange === '1d') {
      change = market.oneDayPriceChange || 0;
    } else if (timeRange === '1w') {
      change = market.oneWeekPriceChange || 0;
    } else {
      change = market.oneMonthPriceChange || 0;
    }

    // Générer des points de données avec une courbe réaliste
    const data = [];
    const steps = timeRange === '1d' ? 24 : timeRange === '1w' ? 7 : 30;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      // Courbe avec un peu de bruit pour simuler des mouvements réels
      const noise = (Math.random() - 0.5) * 0.02;
      const price = basePrice * (1 - change * (1 - progress)) + noise;
      
      let label;
      if (timeRange === '1d') {
        label = `${i}h`;
      } else if (timeRange === '1w') {
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        label = days[i % 7];
      } else {
        label = `J${i}`;
      }
      
      data.push({
        time: label,
        price: Math.max(0.01, Math.min(0.99, price)),
        fullPrice: price
      });
    }
    
    return data;
  };

  const data = generateChartData();
  const currentPrice = market.outcomes[0]?.price || 0.5;
  const priceChange = market.oneDayPriceChange || 0;
  const isPositive = priceChange >= 0;

  return (
    <Card className="bg-[#141414] border-[#2a2a2a] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-white mb-1">
            Évolution du prix
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {(currentPrice * 100).toFixed(1)}¢
            </span>
            <span className={cn(
              'flex items-center text-sm',
              isPositive ? 'text-[#1aff6e]' : 'text-red-400'
            )}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {isPositive ? '+' : ''}{(priceChange * 100).toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimeRange('1d')}
            className={cn(
              'text-xs',
              timeRange === '1d' ? 'bg-[#8b5cf6] text-white' : 'text-[#666] hover:text-white'
            )}
          >
            24h
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimeRange('1w')}
            className={cn(
              'text-xs',
              timeRange === '1w' ? 'bg-[#8b5cf6] text-white' : 'text-[#666] hover:text-white'
            )}
          >
            7j
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimeRange('1m')}
            className={cn(
              'text-xs',
              timeRange === '1m' ? 'bg-[#8b5cf6] text-white' : 'text-[#666] hover:text-white'
            )}
          >
            30j
          </Button>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${market.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? '#1aff6e' : '#ff4757'} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? '#1aff6e' : '#ff4757'} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="time" 
              stroke="#666" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke="#666" 
              fontSize={10}
              tickLine={false}
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}¢`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2">
                      <p className="text-white font-medium">
                        {(payload[0].value as number * 100).toFixed(2)}¢
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#1aff6e' : '#ff4757'}
              strokeWidth={2}
              fill={`url(#gradient-${market.id})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#2a2a2a]">
        <div className="text-center">
          <p className="text-xs text-[#666] mb-1">Vol 24h</p>
          <p className="text-sm font-medium text-white">
            ${(market.volume24h / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#666] mb-1">Liquidité</p>
          <p className="text-sm font-medium text-white">
            ${(market.liquidity / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#666] mb-1">Intérêt ouvert</p>
          <p className="text-sm font-medium text-white">
            {market.openInterest ? `$${(market.openInterest / 1000).toFixed(1)}k` : 'N/A'}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Composant pour afficher plusieurs mini-graphiques
export function MarketTrendsGrid({ markets }: { markets: PolymarketMarket[] }) {
  const topMarkets = markets.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topMarkets.map((market) => (
        <MiniChart key={market.id} market={market} />
      ))}
    </div>
  );
}

function MiniChart({ market }: { market: PolymarketMarket }) {
  const currentPrice = market.outcomes[0]?.price || 0.5;
  const priceChange = market.oneDayPriceChange || 0;
  const isPositive = priceChange >= 0;

  // Générer 7 points de données pour le mini-graphique
  const data = Array.from({ length: 7 }, (_, i) => {
    const progress = i / 6;
    const noise = (Math.random() - 0.5) * 0.01;
    return {
      value: Math.max(0.01, Math.min(0.99, currentPrice * (1 - priceChange * (1 - progress)) + noise))
    };
  });

  return (
    <Card className="bg-[#141414] border-[#2a2a2a] p-4 hover:border-[#3a3a3a] transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{market.icon}</span>
        <span className="text-xs text-[#666] truncate flex-1">{market.title.slice(0, 30)}...</span>
        <span className={cn(
          'text-xs font-medium',
          isPositive ? 'text-[#1aff6e]' : 'text-red-400'
        )}>
          {isPositive ? '+' : ''}{(priceChange * 100).toFixed(1)}%
        </span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-white">
            {(currentPrice * 100).toFixed(1)}¢
          </p>
          <p className="text-xs text-[#666]">
            Vol: ${(market.volume24h / 1000).toFixed(0)}k
          </p>
        </div>
        
        <div className="h-10 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#1aff6e' : '#ff4757'}
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
