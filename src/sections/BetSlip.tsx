import { X, Trash2, ChevronUp, ChevronDown, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBetSlip } from '@/hooks/useBetSlip';
import { cn } from '@/lib/utils';
import type { Match } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface BetSlipProps {
  betSlip: ReturnType<typeof useBetSlip>;
  userBalance: number;
  matches: Match[];
  onLoginRequired?: () => void;
}

export function BetSlip({ betSlip, userBalance, matches, onLoginRequired }: BetSlipProps) {
  const { isLoggedIn } = useAuth();
  
  const { 
    bets, 
    isOpen, 
    error, 
    totalStake, 
    totalPotentialWin, 
    canPlaceBets,
    removeBet, 
    updateStake, 
    clearBets, 
    closeSlip, 
    placeBets,
    toggleSlip 
  } = betSlip;

  const handlePlaceBets = () => {
    if (!isLoggedIn) {
      onLoginRequired?.();
      return;
    }
    const result = placeBets();
    if (result.success) {
      closeSlip();
    }
  };

  const getMatchDetails = (matchId: string) => {
    return matches.find(m => m.id === matchId);
  };

  if (bets.length === 0 && !isOpen) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSlip}
        className={cn(
          'fixed bottom-4 right-4 z-50 lg:hidden w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300',
          bets.length > 0
            ? 'bg-gradient-to-r from-[#1aff6e] to-[#00d9a3] text-[#0a0a0a]'
            : 'bg-[#1a1a1a] text-white border border-[#2a2a2a]'
        )}
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {bets.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {bets.length}
            </span>
          )}
        </div>
      </button>

      {/* Bet Slip Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full sm:w-96 bg-[#141414] border-l border-[#2a2a2a] shadow-2xl z-50 transition-transform duration-500 lg:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">Ticket de Paris</h3>
            <span className="px-2 py-0.5 bg-[#1aff6e]/20 text-[#1aff6e] text-xs font-semibold rounded-full">
              {bets.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {bets.length > 0 && (
              <button
                onClick={clearBets}
                className="p-2 text-[#666] hover:text-red-500 transition-colors"
                title="Tout supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={closeSlip}
              className="p-2 text-[#666] hover:text-white transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Balance Info or Login Prompt */}
        <div className="px-4 py-3 bg-[#0a0a0a] border-b border-[#2a2a2a]">
          {isLoggedIn ? (
            <div className="flex items-center justify-between">
              <span className="text-[#666] text-sm">Votre solde</span>
              <span className="text-[#1aff6e] font-bold">{userBalance.toFixed(2)} €</span>
            </div>
          ) : (
            <button
              onClick={onLoginRequired}
              className="w-full flex items-center justify-center gap-2 py-2 text-[#1aff6e] hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-medium">Connectez-vous pour parier</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-200px)] overflow-y-auto">
          {bets.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-[#b3b3b3] mb-2">Votre ticket est vide</p>
              <p className="text-[#666] text-sm">Sélectionnez des cotes pour commencer à parier</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {bets.map((bet) => {
                const match = getMatchDetails(bet.matchId);
                return (
                  <BetItem
                    key={bet.id}
                    bet={bet}
                    match={match}
                    onRemove={() => removeBet(bet.id)}
                    onUpdateStake={(stake) => updateStake(bet.id, stake)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {bets.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0a0a0a] border-t border-[#2a2a2a]">
            {/* Login Required Message */}
            {!isLoggedIn && (
              <div className="mb-3 p-3 bg-[#1aff6e]/10 border border-[#1aff6e]/30 rounded-lg flex items-center gap-2">
                <LogIn className="w-4 h-4 text-[#1aff6e] flex-shrink-0" />
                <p className="text-[#1aff6e] text-sm">Connectez-vous pour placer vos paris</p>
              </div>
            )}

            {/* Error Message */}
            {isLoggedIn && error && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {isLoggedIn && !error && canPlaceBets && (
              <div className="mb-3 p-3 bg-[#1aff6e]/10 border border-[#1aff6e]/30 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#1aff6e] flex-shrink-0" />
                <p className="text-[#1aff6e] text-sm">Solde suffisant pour placer ce pari</p>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#b3b3b3]">Mise totale</span>
                <span className="text-white font-semibold">{totalStake.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-[#b3b3b3]">Gain potentiel</span>
                <span className="text-[#1aff6e] font-bold">{totalPotentialWin.toFixed(2)} €</span>
              </div>
            </div>

            {/* Place Bet Button */}
            <Button
              onClick={handlePlaceBets}
              disabled={isLoggedIn && !canPlaceBets}
              className={cn(
                'w-full font-bold py-6 transition-all duration-300',
                !isLoggedIn
                  ? 'bg-gradient-to-r from-[#1aff6e] to-[#00d9a3] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(26,255,110,0.4)]'
                  : canPlaceBets
                    ? 'bg-gradient-to-r from-[#1aff6e] to-[#00d9a3] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(26,255,110,0.4)]'
                    : 'bg-[#2a2a2a] text-[#666] cursor-not-allowed'
              )}
            >
              {!isLoggedIn 
                ? 'SE CONNECTER POUR PARIER'
                : totalStake > userBalance 
                  ? `Solde insuffisant (${userBalance.toFixed(2)}€)` 
                  : 'PLACER LE PARI'}
            </Button>
          </div>
        )}
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSlip}
        />
      )}
    </>
  );
}

interface BetItemProps {
  bet: {
    id: string;
    matchId: string;
    selection: 'home' | 'draw' | 'away';
    odds: number;
    stake: number;
    potentialWin: number;
  };
  match?: Match;
  onRemove: () => void;
  onUpdateStake: (stake: number) => void;
}

function BetItem({ bet, match, onRemove, onUpdateStake }: BetItemProps) {
  const selectionLabels: Record<string, string> = {
    home: '1',
    draw: 'X',
    away: '2',
  };

  const selectionNames: Record<string, string> = {
    home: match?.homeTeam.name || 'Domicile',
    draw: 'Nul',
    away: match?.awayTeam.name || 'Extérieur',
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {match && (
            <p className="text-[#666] text-xs mb-1 truncate">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-[#1aff6e]/20 text-[#1aff6e] text-xs font-bold rounded">
              {selectionLabels[bet.selection]}
            </span>
            <span className="text-white text-sm">{selectionNames[bet.selection]}</span>
            <span className="text-[#1aff6e] font-bold">@ {bet.odds.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-[#666] hover:text-red-500 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stake Input */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateStake(bet.stake - 5)}
          className="w-8 h-8 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg flex items-center justify-center transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-white" />
        </button>
        <div className="flex-1 relative">
          <input
            type="number"
            value={bet.stake}
            onChange={(e) => onUpdateStake(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-center font-semibold focus:outline-none focus:border-[#1aff6e]"
            min="1"
            step="1"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] text-sm">€</span>
        </div>
        <button
          onClick={() => onUpdateStake(bet.stake + 5)}
          className="w-8 h-8 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg flex items-center justify-center transition-colors"
        >
          <ChevronUp className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Potential Win */}
      <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex justify-between items-center">
        <span className="text-[#666] text-sm">Gain potentiel</span>
        <span className="text-[#1aff6e] font-bold">{bet.potentialWin.toFixed(2)} €</span>
      </div>
    </div>
  );
}
