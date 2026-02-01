import { useState } from 'react';
import { 
  ArrowLeft, 
  Bot, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Filter,
  RefreshCw,
  BarChart3,
  Brain,
  Target,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Percent,
  Wallet,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { usePolymarket } from '@/hooks/usePolymarket';
import type { PolymarketRecommendation, PolymarketMarket, PolymarketAnalysis } from '@/types';
import { cn } from '@/lib/utils';
import { calculateMarketScore } from '@/services/api-polymarket';
import { PriceChart, MarketTrendsGrid } from '@/components/PriceChart';

interface PolymarketBotPageProps {
  onBack: () => void;
}

export function PolymarketBotPage({ onBack }: PolymarketBotPageProps) {
  const {
    recommendations,
    markets,
    analysis,
    loading,
    error,
    refreshMarkets,
    selectedCategory,
    setSelectedCategory,
    minLiquidity,
    setMinLiquidity,
    minConfidence,
    setMinConfidence,
    categories,
  } = usePolymarket();

  const [activeTab, setActiveTab] = useState<'recommendations' | 'all-markets' | 'analysis' | 'trends'>('recommendations');
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null);

  const totalPotentialProfit = recommendations.reduce((sum, rec) => sum + rec.potentialProfit, 0);
  const avgConfidence = recommendations.length > 0
    ? recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length
    : 0;
  const highUrgencyCount = recommendations.filter(r => r.urgency === 'high').length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-[#b3b3b3] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="h-6 w-px bg-[#2a2a2a]" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#00d4ff] rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Polymarket Bot</h1>
                  <p className="text-xs text-[#666]">Analyse IA des meilleures opportunités</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshMarkets}
                disabled={loading}
                className="border-[#2a2a2a] text-[#b3b3b3] hover:text-white hover:border-[#3a3a3a]"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="bg-[#141414] border-b border-[#2a2a2a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Target className="w-5 h-5" />}
              label="Opportunités trouvées"
              value={recommendations.length}
              color="#1aff6e"
            />
            <StatCard
              icon={<DollarSign className="w-5 h-5" />}
              label="Profit potentiel (100$)"
              value={`+${totalPotentialProfit.toFixed(2)}$`}
              color="#00d4ff"
            />
            <StatCard
              icon={<Brain className="w-5 h-5" />}
              label="Confiance moyenne"
              value={`${avgConfidence.toFixed(1)}%`}
              color="#8b5cf6"
            />
            <StatCard
              icon={<Zap className="w-5 h-5" />}
              label="Opportunités urgentes"
              value={highUrgencyCount}
              color="#ff4757"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <TabButton
            active={activeTab === 'recommendations'}
            onClick={() => setActiveTab('recommendations')}
            icon={<Brain className="w-4 h-4" />}
            label="Recommandations"
            count={recommendations.length}
          />
          <TabButton
            active={activeTab === 'all-markets'}
            onClick={() => setActiveTab('all-markets')}
            icon={<BarChart3 className="w-4 h-4" />}
            label="Tous les marchés"
            count={markets.length}
          />
          <TabButton
            active={activeTab === 'analysis'}
            onClick={() => setActiveTab('analysis')}
            icon={<LineChart className="w-4 h-4" />}
            label="Analyses"
            count={analysis.length}
          />
          <TabButton
            active={activeTab === 'trends'}
            onClick={() => setActiveTab('trends')}
            icon={<TrendingUp className="w-4 h-4" />}
            label="Tendances"
            count={markets.length}
          />
        </div>

        {/* Filters */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-[#666]" />
            <span className="text-sm font-medium text-[#b3b3b3]">Filtres</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="text-sm text-[#666] mb-2 block">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm transition-all duration-200',
                      selectedCategory === cat
                        ? 'bg-[#8b5cf6] text-white'
                        : 'bg-[#1a1a1a] text-[#b3b3b3] hover:bg-[#2a2a2a]'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Liquidity Filter */}
            <div>
              <label className="text-sm text-[#666] mb-2 block">
                Liquidité minimale: ${minLiquidity.toLocaleString()}
              </label>
              <Slider
                value={[minLiquidity]}
                onValueChange={([value]) => setMinLiquidity(value)}
                min={0}
                max={100000}
                step={1000}
                className="w-full"
              />
            </div>

            {/* Confidence Filter */}
            <div>
              <label className="text-sm text-[#666] mb-2 block">
                Confiance minimale: {minConfidence}%
              </label>
              <Slider
                value={[minConfidence]}
                onValueChange={([value]) => setMinConfidence(value)}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#8b5cf6] to-[#00d4ff] rounded-xl flex items-center justify-center animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <p className="text-[#b3b3b3]">Analyse des marchés en cours...</p>
            <p className="text-[#666] text-sm mt-1">Le bot scanne {markets.length} marchés</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            {activeTab === 'recommendations' && (
              <RecommendationsTab
                recommendations={recommendations}
                expandedMarket={expandedMarket}
                setExpandedMarket={setExpandedMarket}
              />
            )}
            {activeTab === 'all-markets' && (
              <AllMarketsTab
                markets={markets}
                analysis={analysis}
                expandedMarket={expandedMarket}
                setExpandedMarket={setExpandedMarket}
              />
            )}
            {activeTab === 'analysis' && (
              <AnalysisTab analysis={analysis} />
            )}
            {activeTab === 'trends' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Tendances des marchés</h2>
                  <span className="text-sm text-[#666]">Top 6 des marchés par volume</span>
                </div>
                <MarketTrendsGrid markets={markets} />
                
                {expandedMarket && (() => {
                  const selectedMarket = markets.find(m => m.id === expandedMarket);
                  return selectedMarket ? (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Graphique détaillé - {selectedMarket.title}
                      </h3>
                      <PriceChart market={selectedMarket} />
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Composant pour les recommandations
function RecommendationsTab({
  recommendations,
  expandedMarket,
  setExpandedMarket,
}: {
  recommendations: PolymarketRecommendation[];
  expandedMarket: string | null;
  setExpandedMarket: (id: string | null) => void;
}) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-4 bg-[#1a1a1a] rounded-full flex items-center justify-center">
          <Target className="w-10 h-10 text-[#666]" />
        </div>
        <p className="text-[#b3b3b3] mb-2">Aucune opportunité trouvée</p>
        <p className="text-[#666] text-sm">Essayez d'ajuster les filtres de confiance</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-[#1aff6e]" />
        <span className="text-lg font-semibold">Top {recommendations.length} meilleures opportunités</span>
      </div>

      {recommendations.map((rec) => (
        <RecommendationCard
          key={rec.market.id}
          recommendation={rec}
          isExpanded={expandedMarket === rec.market.id}
          onToggle={() => setExpandedMarket(expandedMarket === rec.market.id ? null : rec.market.id)}
        />
      ))}
    </div>
  );
}

// Composant pour tous les marchés
function AllMarketsTab({
  markets,
  analysis,
  expandedMarket,
  setExpandedMarket,
}: {
  markets: PolymarketMarket[];
  analysis: PolymarketAnalysis[];
  expandedMarket: string | null;
  setExpandedMarket: (id: string | null) => void;
}) {
  if (markets.length === 0) {
    return (
      <div className="text-center py-20">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#666]" />
        <p className="text-[#b3b3b3]">Aucun marché disponible</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {markets.map((market) => {
        const marketAnalysis = analysis.find(a => a.market.id === market.id);
        const score = calculateMarketScore(market);

        return (
          <MarketCard
            key={market.id}
            market={market}
            analysis={marketAnalysis}
            score={score}
            isExpanded={expandedMarket === market.id}
            onToggle={() => setExpandedMarket(expandedMarket === market.id ? null : market.id)}
          />
        );
      })}
    </div>
  );
}

// Composant pour l'analyse
function AnalysisTab({ analysis }: { analysis: PolymarketAnalysis[] }) {
  const buyCount = analysis.filter(a => a.recommendation === 'buy').length;
  const holdCount = analysis.filter(a => a.recommendation === 'hold').length;
  const avgEV = analysis.length > 0
    ? analysis.reduce((sum, a) => sum + a.expectedValue, 0) / analysis.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#141414] border-[#2a2a2a] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1aff6e]/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#1aff6e]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1aff6e]">{buyCount}</p>
              <p className="text-sm text-[#666]">Signaux d'achat</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#141414] border-[#2a2a2a] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f59e0b]/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#f59e0b]">{holdCount}</p>
              <p className="text-sm text-[#666]">Position neutre</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#141414] border-[#2a2a2a] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8b5cf6]/20 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#8b5cf6]">{avgEV.toFixed(2)}x</p>
              <p className="text-sm text-[#666]">Valeur attendue moyenne</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Distribution des recommandations</h3>
        <div className="space-y-3">
          {analysis.slice(0, 20).map((a) => (
            <div key={a.market.id} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#b3b3b3] truncate">{a.market.title}</span>
                  <span className={cn(
                    'text-sm font-medium',
                    a.recommendation === 'buy' ? 'text-[#1aff6e]' : 'text-[#f59e0b]'
                  )}>
                    {a.recommendation === 'buy' ? 'ACHETER' : 'ATTENDRE'}
                  </span>
                </div>
                <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      a.recommendation === 'buy' ? 'bg-[#1aff6e]' : 'bg-[#f59e0b]'
                    )}
                    style={{ width: `${a.confidence}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-[#666] w-12 text-right">{a.confidence.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour une carte de recommandation
function RecommendationCard({
  recommendation,
  isExpanded,
  onToggle,
}: {
  recommendation: PolymarketRecommendation;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { market, confidence, potentialProfit, analysis, bestOutcome, rank, urgency } = recommendation;

  return (
    <Card className={cn(
      'bg-[#141414] border transition-all duration-300 overflow-hidden',
      urgency === 'high' ? 'border-red-500/50' : 
      urgency === 'medium' ? 'border-[#f59e0b]/50' : 'border-[#2a2a2a]'
    )}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Rank */}
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0',
            rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
            rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
            rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
            'bg-[#1a1a1a] text-white'
          )}>
            #{rank}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{market.icon}</span>
                  <Badge variant="outline" className="text-xs border-[#2a2a2a] text-[#666]">
                    {market.category}
                  </Badge>
                  {urgency === 'high' && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <Zap className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white leading-tight">{market.title}</h3>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="shrink-0 text-[#666] hover:text-white"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <StatBadge
                icon={<Brain className="w-4 h-4" />}
                label="Confiance"
                value={`${confidence.toFixed(1)}%`}
                color={confidence > 75 ? '#1aff6e' : confidence > 60 ? '#f59e0b' : '#ff4757'}
              />
              <StatBadge
                icon={<DollarSign className="w-4 h-4" />}
                label="Profit potentiel"
                value={`+${potentialProfit.toFixed(2)}$`}
                color="#00d4ff"
              />
              <StatBadge
                icon={<Wallet className="w-4 h-4" />}
                label="Liquidité"
                value={`$${(market.liquidity / 1000).toFixed(0)}k`}
                color="#8b5cf6"
              />
              <StatBadge
                icon={<Clock className="w-4 h-4" />}
                label="Fin"
                value={new Date(market.endDate).toLocaleDateString('fr-FR')}
                color="#b3b3b3"
              />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[#2a2a2a] space-y-4">
            <p className="text-[#b3b3b3] text-sm">{market.description}</p>
            
            <div className="bg-[#0a0a0a] rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#8b5cf6]" />
                Analyse du bot
              </h4>
              <p className="text-sm text-[#b3b3b3]">{analysis}</p>
            </div>

            {bestOutcome && (
              <div className="flex items-center justify-between bg-[#1aff6e]/10 border border-[#1aff6e]/30 rounded-lg p-4">
                <div>
                  <p className="text-sm text-[#666]">Recommandation</p>
                  <p className="text-lg font-semibold text-[#1aff6e]">Acheter "{bestOutcome.name}"</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#666]">Prix actuel</p>
                  <p className="text-2xl font-bold text-white">{(bestOutcome.price * 100).toFixed(1)}¢</p>
                </div>
              </div>
            )}

            {/* Graphique de tendance */}
            <PriceChart market={market} />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-[#2a2a2a] text-[#b3b3b3] hover:text-white"
                onClick={() => window.open(`https://polymarket.com/market/${market.slug}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Voir sur Polymarket
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Composant pour une carte de marché
function MarketCard({
  market,
  analysis,
  score,
  isExpanded,
  onToggle,
}: {
  market: PolymarketMarket;
  analysis?: PolymarketAnalysis;
  score: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const yesOutcome = market.outcomes.find(o => o.id === 'yes') || market.outcomes[0];
  const noOutcome = market.outcomes.find(o => o.id === 'no') || market.outcomes[1];

  return (
    <Card className="bg-[#141414] border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{market.icon}</span>
            <Badge variant="outline" className="text-xs border-[#2a2a2a] text-[#666]">
              {market.category}
            </Badge>
          </div>
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            score >= 75 ? 'bg-[#1aff6e]/20 text-[#1aff6e]' :
            score >= 50 ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
            'bg-red-500/20 text-red-400'
          )}>
            Score: {score}
          </div>
        </div>

        <h3 className="text-sm font-medium text-white mb-3 line-clamp-2">{market.title}</h3>

        <div className="flex gap-2 mb-3">
          {yesOutcome && (
            <div className="flex-1 bg-[#0a0a0a] rounded-lg p-2 text-center">
              <p className="text-xs text-[#666]">{yesOutcome.name}</p>
              <p className="text-lg font-bold text-[#1aff6e]">{(yesOutcome.price * 100).toFixed(0)}¢</p>
            </div>
          )}
          {noOutcome && (
            <div className="flex-1 bg-[#0a0a0a] rounded-lg p-2 text-center">
              <p className="text-xs text-[#666]">{noOutcome.name}</p>
              <p className="text-lg font-bold text-[#ff4757]">{(noOutcome.price * 100).toFixed(0)}¢</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-[#666] mb-3">
          <span>Liq: ${(market.liquidity / 1000).toFixed(0)}k</span>
          <span className={cn(
            market.trend === 'up' ? 'text-[#1aff6e]' :
            market.trend === 'down' ? 'text-red-400' :
            'text-[#666]'
          )}>
            {market.trend === 'up' ? '+' : market.trend === 'down' ? '-' : ''}
            {Math.abs(market.volumeTrend)}% vol
          </span>
        </div>

        {analysis && (
          <div className={cn(
            'flex items-center gap-2 text-xs mb-3',
            analysis.recommendation === 'buy' ? 'text-[#1aff6e]' : 'text-[#f59e0b]'
          )}>
            {analysis.recommendation === 'buy' ? <TrendingUp className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            <span>{analysis.recommendation === 'buy' ? 'Signal d\'achat' : 'Position neutre'}</span>
            <span className="text-[#666]">• Conf: {analysis.confidence.toFixed(0)}%</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full text-[#666] hover:text-white"
        >
          {isExpanded ? 'Moins de détails' : 'Plus de détails'}
          {isExpanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
        </Button>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-[#2a2a2a] space-y-3">
            <p className="text-xs text-[#b3b3b3]">{market.description}</p>
            {analysis && (
              <div className="bg-[#0a0a0a] rounded-lg p-3">
                <p className="text-xs text-[#666] mb-1">Analyse</p>
                <p className="text-xs text-[#b3b3b3]">{analysis.analysis}</p>
              </div>
            )}
            <PriceChart market={market} />
          </div>
        )}
      </div>
    </Card>
  );
}

// Composants utilitaires
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          <p className="text-xs text-[#666]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        active
          ? 'bg-[#8b5cf6] text-white'
          : 'bg-[#141414] text-[#b3b3b3] hover:bg-[#1a1a1a] border border-[#2a2a2a]'
      )}
    >
      {icon}
      {label}
      <span className={cn(
        'px-2 py-0.5 rounded-full text-xs',
        active ? 'bg-white/20' : 'bg-[#2a2a2a]'
      )}>
        {count}
      </span>
    </button>
  );
}

function StatBadge({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div style={{ color }}>{icon}</div>
      <span className="text-[#666]">{label}:</span>
      <span className="font-medium" style={{ color }}>{value}</span>
    </div>
  );
}
