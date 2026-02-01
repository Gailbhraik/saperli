import { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, Wallet, LogOut, LogIn, Gamepad2, List, Trophy, Globe, Users, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onViewAllBets?: () => void;
  onViewProfiles?: () => void;
  onViewGlobe?: () => void;
  onViewPlayers?: () => void;
  onViewPolymarketBot?: () => void;
}

export function Navigation({ onOpenAuth, onViewAllBets, onViewProfiles, onViewGlobe, onViewPlayers, onViewPolymarketBot }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentUser, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Live', href: '#live', icon: '🔴' },
    { label: 'LEC', href: '#esports', icon: '🇪🇺' },
    { label: 'LFL', href: '#esports', icon: '🇫🇷' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]'
        : 'bg-transparent'
        }`}
      style={{
        height: isScrolled ? '64px' : '80px',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 transition-transform duration-500"
            style={{
              transform: isScrolled ? 'scale(0.85)' : 'scale(1)',
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Saperli
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-[#b3b3b3] hover:text-white transition-colors duration-300 text-sm font-medium group flex items-center gap-1.5"
              >
                <span>{link.icon}</span>
                {link.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#00d4ff] transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            ))}

            <div className="h-6 w-px bg-[#2a2a2a]" />

            <button
              onClick={onViewAllBets}
              className="text-[#00d4ff] hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 bg-[#00d4ff]/10 rounded-lg border border-[#00d4ff]/30 hover:bg-[#00d4ff]/20"
            >
              <List className="w-4 h-4" />
              Paris
            </button>

            <button
              onClick={onViewProfiles}
              className="text-[#8b5cf6] hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 bg-[#8b5cf6]/10 rounded-lg border border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/20"
            >
              <Trophy className="w-4 h-4" />
              Classement
            </button>

            <button
              onClick={onViewGlobe}
              className="text-[#1aff6e] hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 bg-[#1aff6e]/10 rounded-lg border border-[#1aff6e]/30 hover:bg-[#1aff6e]/20"
            >
              <Globe className="w-4 h-4" />
              Carte
            </button>

            <button
              onClick={onViewPlayers}
              className="text-[#f59e0b] hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 bg-[#f59e0b]/10 rounded-lg border border-[#f59e0b]/30 hover:bg-[#f59e0b]/20"
            >
              <Users className="w-4 h-4" />
              Joueurs
            </button>

            <button
              onClick={onViewPolymarketBot}
              className="text-[#8b5cf6] hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 bg-[#8b5cf6]/10 rounded-lg border border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/20"
            >
              <Bot className="w-4 h-4" />
              Bot IA
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && currentUser ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                  <Wallet className="w-4 h-4 text-[#1aff6e]" />
                  <span className="text-[#1aff6e] font-bold">{currentUser.balance.toFixed(2)} €</span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                  <UserIcon className="w-4 h-4 text-[#b3b3b3]" />
                  <span className="text-white font-medium">{currentUser.username}</span>
                </div>

                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-[#b3b3b3] hover:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onOpenAuth('login')}
                  className="text-[#b3b3b3] hover:text-white hover:bg-white/5"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Button>

                <Button
                  onClick={() => onOpenAuth('register')}
                  className="bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-bold hover:opacity-90"
                >
                  Inscription
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#2a2a2a] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="px-4 py-6 space-y-4">
          {isLoggedIn && currentUser ? (
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{currentUser.username}</p>
                  <p className="text-[#1aff6e] font-bold text-sm">{currentUser.balance.toFixed(2)} €</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 text-[#666] hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenAuth('login');
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 border-[#2a2a2a] text-white hover:bg-white/5"
              >
                Connexion
              </Button>
              <Button
                onClick={() => {
                  onOpenAuth('register');
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-bold"
              >
                Inscription
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => {
                onViewAllBets?.();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-lg text-[#00d4ff] font-medium"
            >
              <List className="w-4 h-4" />
              Paris
            </button>
            <button
              onClick={() => {
                onViewProfiles?.();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-lg text-[#8b5cf6] font-medium"
            >
              <Trophy className="w-4 h-4" />
              Classement
            </button>
            <button
              onClick={() => {
                onViewGlobe?.();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1aff6e]/10 border border-[#1aff6e]/30 rounded-lg text-[#1aff6e] font-medium"
            >
              <Globe className="w-4 h-4" />
              Carte
            </button>
            <button
              onClick={() => {
                onViewPlayers?.();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg text-[#f59e0b] font-medium"
            >
              <Users className="w-4 h-4" />
              Joueurs
            </button>
            <button
              onClick={() => {
                onViewPolymarketBot?.();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-lg text-[#8b5cf6] font-medium"
            >
              <Bot className="w-4 h-4" />
              Bot IA
            </button>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 text-[#b3b3b3] hover:text-white transition-colors duration-300 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
