import { useState } from 'react';
import { Navigation } from '@/sections/Navigation';
import { Hero } from '@/sections/Hero';
import { LiveMatches } from '@/sections/LiveMatches';
import { EsportsSection } from '@/sections/EsportsSection';
import { Features } from '@/sections/Features';
import { HowItWorks } from '@/sections/HowItWorks';
import { Promotions } from '@/sections/Promotions';
import { Statistics } from '@/sections/Statistics';
import { BetSlip } from '@/sections/BetSlip';
import { UserPanel } from '@/sections/UserPanel';
import { Footer } from '@/sections/Footer';
import { AuthModal } from '@/components/AuthModal';
import { AllBetsPage } from '@/pages/AllBetsPage';
import { ProfilesPage } from '@/pages/ProfilesPage';
import { GlobePage } from '@/pages/GlobePage';
import { PlayersPage } from '@/pages/PlayersPage';
import { PolymarketBotPage } from '@/pages/PolymarketBotPage';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useBetSlip } from '@/hooks/useBetSlip';
import { useMatches } from '@/hooks/useMatches';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type PageType = 'home' | 'all-bets' | 'profiles' | 'globe' | 'players' | 'polymarket-bot';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const { currentUser, isLoggedIn, placeBet } = useAuth();
  const { allMatches, lecMatches, lflMatches, liveMatches, upcomingMatches, loading } = useMatches();

  const userForBetSlip = {
    id: currentUser?.id || 'guest',
    name: currentUser?.username || 'Invité',
    email: '',
    balance: currentUser?.balance || 0,
    currency: '€',
    isLoggedIn: isLoggedIn,
  };

  const betSlip = useBetSlip({
    user: userForBetSlip,
    placeBet: async (betData) => {
      if (!isLoggedIn) {
        toast.error('Connectez-vous pour parier', {
          description: 'Vous devez être connecté pour placer des paris.',
          action: {
            label: 'Connexion',
            onClick: () => handleOpenAuth('login'),
          },
        });
        return { success: false, error: 'Non connecté' };
      }

      const match = allMatches.find(m => m.id === betData.matchId);
      if (match) {
        const result = await placeBet({
          ...betData,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          league: match.league, // Ajouter la ligue
        });

        if (result.success) {
          toast.success('Pari placé !', {
            description: `${match.homeTeam.name} vs ${match.awayTeam.name} - Mise: ${betData.stake}€`,
          });
        }

        return result;
      }
      return { success: false, error: 'Match non trouvé' };
    }
  });

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Page Profils
  if (currentPage === 'profiles') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        <ProfilesPage onBack={() => handleNavigate('home')} />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authModalTab}
        />

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#141414',
              border: '1px solid #2a2a2a',
              color: '#fff',
            },
          }}
        />
      </div>
    );
  }

  // Page Globe
  if (currentPage === 'globe') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        <GlobePage onBack={() => handleNavigate('home')} />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authModalTab}
        />

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#141414',
              border: '1px solid #2a2a2a',
              color: '#fff',
            },
          }}
        />
      </div>
    );
  }

  // Page Joueurs
  if (currentPage === 'players') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        <PlayersPage onBack={() => handleNavigate('home')} />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authModalTab}
        />

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#141414',
              border: '1px solid #2a2a2a',
              color: '#fff',
            },
          }}
        />
      </div>
    );
  }

  // Page Polymarket Bot
  if (currentPage === 'polymarket-bot') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        <PolymarketBotPage onBack={() => handleNavigate('home')} />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authModalTab}
        />

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#141414',
              border: '1px solid #2a2a2a',
              color: '#fff',
            },
          }}
        />
      </div>
    );
  }

  // Page All Bets
  if (currentPage === 'all-bets') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        <AllBetsPage
          matches={{
            all: allMatches,
            lec: lecMatches,
            lfl: lflMatches,
            international: allMatches.filter(m =>
              !m.league.toLowerCase().includes('lec') &&
              !m.league.toLowerCase().includes('lfl')
            ),
            live: liveMatches,
          }}
          betSlip={betSlip}
          onBack={() => handleNavigate('home')}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authModalTab}
        />

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#141414',
              border: '1px solid #2a2a2a',
              color: '#fff',
            },
          }}
        />
      </div>
    );
  }

  // Page d'accueil
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        <Navigation
          onOpenAuth={handleOpenAuth}
          onViewAllBets={() => handleNavigate('all-bets')}
          onViewProfiles={() => handleNavigate('profiles')}
          onViewGlobe={() => handleNavigate('globe')}
          onViewPlayers={() => handleNavigate('players')}
          onViewPolymarketBot={() => handleNavigate('polymarket-bot')}
        />

      <main>
        <Hero
          user={userForBetSlip}
          onOpenAuth={handleOpenAuth}
          onViewAllBets={() => handleNavigate('all-bets')}
        />
        <LiveMatches
          betSlip={betSlip}
          liveMatches={liveMatches}
          upcomingMatches={upcomingMatches}
          loading={loading}
        />
        <EsportsSection
          betSlip={betSlip}
          lecMatches={lecMatches}
          lflMatches={lflMatches}
          liveMatches={liveMatches}
          onViewAllBets={() => handleNavigate('all-bets')}
        />
        <Features />
        <HowItWorks />
        <Promotions />
        <Statistics />
      </main>

      <Footer />

      <UserPanel onOpenAuth={handleOpenAuth} />

      <BetSlip
        betSlip={betSlip}
        userBalance={currentUser?.balance || 0}
        matches={allMatches}
        onLoginRequired={() => handleOpenAuth('login')}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#141414',
            border: '1px solid #2a2a2a',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
