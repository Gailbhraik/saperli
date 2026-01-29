import { useState } from 'react';
import { Wallet, History, TrendingUp, TrendingDown, RotateCcw, User as UserIcon, ChevronDown, ChevronUp, LogIn, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface UserPanelProps {
  onOpenAuth: (tab?: 'login' | 'register') => void;
}

export function UserPanel({ onOpenAuth }: UserPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { 
    currentUser, 
    isLoggedIn, 
    betHistory, 
    resetAccount, 
    deleteAccount,
    addBalance 
  } = useAuth();

  const pendingBets = betHistory.filter(b => b.status === 'pending');
  const wonBets = betHistory.filter(b => b.status === 'won');
  const lostBets = betHistory.filter(b => b.status === 'lost');

  const totalWon = wonBets.reduce((sum, b) => sum + b.potentialWin, 0);
  const totalLost = lostBets.reduce((sum, b) => sum + b.stake, 0);
  const netProfit = totalWon - totalLost;

  // If not logged in, show login prompt
  if (!isLoggedIn || !currentUser) {
    return (
      <div className="fixed left-4 bottom-4 z-50">
        <button
          onClick={() => onOpenAuth('login')}
          className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#2a2a2a] rounded-xl hover:border-[#1aff6e]/50 transition-colors group"
        >
          <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center group-hover:bg-[#1aff6e]/10 transition-colors">
            <LogIn className="w-5 h-5 text-[#666] group-hover:text-[#1aff6e] transition-colors" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">Connectez-vous</p>
            <p className="text-[#666] text-xs">pour parier et sauvegarder</p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-4 bottom-4 z-50">
      {/* Main Panel */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
        {/* Header - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-[#1a1a1a] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1aff6e] to-[#00d9a3] rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#0a0a0a]" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">{currentUser.username}</p>
              <p className="text-[#1aff6e] font-bold">{currentUser.balance.toFixed(2)} €</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-[#666]" />
          ) : (
            <ChevronUp className="w-5 h-5 text-[#666]" />
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-[#2a2a2a] p-4 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a0a0a] rounded-lg p-3">
                <div className="flex items-center gap-2 text-[#666] text-xs mb-1">
                  <TrendingUp className="w-3 h-3" />
                  Gains
                </div>
                <p className="text-[#1aff6e] font-bold">+{totalWon.toFixed(2)} €</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-3">
                <div className="flex items-center gap-2 text-[#666] text-xs mb-1">
                  <TrendingDown className="w-3 h-3" />
                  Pertes
                </div>
                <p className="text-red-500 font-bold">-{totalLost.toFixed(2)} €</p>
              </div>
            </div>

            {/* Net Profit */}
            <div className={`text-center py-2 rounded-lg ${netProfit >= 0 ? 'bg-[#1aff6e]/10' : 'bg-red-500/10'}`}>
              <p className="text-[#666] text-xs">Profit net</p>
              <p className={`font-bold ${netProfit >= 0 ? 'text-[#1aff6e]' : 'text-red-500'}`}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toFixed(2)} €
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addBalance(100)}
                className="flex-1 border-[#2a2a2a] text-[#1aff6e] hover:bg-[#1aff6e]/10"
              >
                <Wallet className="w-4 h-4 mr-1" />
                +100€
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="flex-1 border-[#2a2a2a] text-[#b3b3b3] hover:bg-white/5"
              >
                <History className="w-4 h-4 mr-1" />
                Historique
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAccount}
                className="border-[#2a2a2a] text-[#666] hover:text-[#1aff6e] hover:border-[#1aff6e]"
                title="Réinitialiser le compte"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Account Stats */}
            <div className="text-xs text-[#666] flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
              <span>Total paris: {betHistory.length}</span>
              <span>En cours: {pendingBets.length}</span>
            </div>

            {/* Pending Bets */}
            {pendingBets.length > 0 && (
              <div className="border-t border-[#2a2a2a] pt-3">
                <p className="text-[#666] text-xs mb-2">Paris en cours ({pendingBets.length})</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {pendingBets.slice(0, 3).map(bet => (
                    <div key={bet.id} className="bg-[#0a0a0a] rounded-lg p-2 text-xs">
                      <p className="text-white truncate">{bet.homeTeam} vs {bet.awayTeam}</p>
                      <p className="text-[#666]">Mise: {bet.stake.toFixed(2)}€ | Gain: {bet.potentialWin.toFixed(2)}€</p>
                    </div>
                  ))}
                  {pendingBets.length > 3 && (
                    <p className="text-[#666] text-xs text-center">+{pendingBets.length - 3} autres...</p>
                  )}
                </div>
              </div>
            )}

            {/* Delete Account */}
            <div className="pt-2 border-t border-[#2a2a2a]">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-[#666] hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Supprimer mon compte
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-red-400">Êtes-vous sûr ? Cette action est irréversible.</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 text-xs border-[#2a2a2a] text-[#b3b3b3]"
                    >
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={deleteAccount}
                      className="flex-1 text-xs bg-red-500 hover:bg-red-600 text-white"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-[#141414] border border-[#2a2a2a] rounded-xl shadow-2xl p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Historique des paris</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-[#666] hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {betHistory.length === 0 ? (
            <p className="text-[#666] text-center py-4">Aucun pari effectué</p>
          ) : (
            <div className="space-y-2">
              {betHistory.map(bet => (
                <div
                  key={bet.id}
                  className={`p-3 rounded-lg ${
                    bet.status === 'won' ? 'bg-[#1aff6e]/10 border border-[#1aff6e]/30' :
                    bet.status === 'lost' ? 'bg-red-500/10 border border-red-500/30' :
                    'bg-[#0a0a0a] border border-[#2a2a2a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">{bet.homeTeam || 'Match'} vs {bet.awayTeam || ''}</span>
                    <span className={`text-xs font-bold ${
                      bet.status === 'won' ? 'text-[#1aff6e]' :
                      bet.status === 'lost' ? 'text-red-500' :
                      'text-[#ffa502]'
                    }`}>
                      {bet.status === 'won' ? 'GAGNÉ' : bet.status === 'lost' ? 'PERDU' : 'EN COURS'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#666] mt-1">
                    <span>Mise: {bet.stake.toFixed(2)}€ @ {bet.odds.toFixed(2)}</span>
                    <span>{new Date(bet.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {bet.status === 'won' && (
                    <p className="text-[#1aff6e] text-xs mt-1">+{bet.potentialWin.toFixed(2)} €</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
