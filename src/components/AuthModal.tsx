import { useState } from 'react';
import { X, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    if (activeTab === 'register') {
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        setIsSubmitting(false);
        return;
      }
      
      const result = register(username, password);
      if (result.success) {
        handleClose();
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
      }
    } else {
      const result = login(username, password);
      if (result.success) {
        handleClose();
      } else {
        setError(result.error || 'Erreur lors de la connexion');
      }
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-[#666] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#1aff6e] to-[#00d9a3] rounded-2xl flex items-center justify-center mb-4">
              <span className="text-[#0a0a0a] font-bold text-2xl">B</span>
            </div>
            <h2 className="text-white text-2xl font-bold">
              {activeTab === 'login' ? 'Connexion' : 'Créer un compte'}
            </h2>
            <p className="text-[#666] text-sm mt-1">
              {activeTab === 'login' 
                ? 'Connectez-vous pour accéder à votre compte' 
                : 'Inscrivez-vous et recevez 1000€ fictifs !'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#0a0a0a] rounded-lg p-1">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-[#1aff6e] text-[#0a0a0a]'
                  : 'text-[#666] hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-[#1aff6e] text-[#0a0a0a]'
                  : 'text-[#666] hover:text-white'
              }`}
            >
              Inscription
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-[#b3b3b3] text-sm font-medium">Pseudo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre pseudo"
                className="pl-10 bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#666] focus:border-[#1aff6e] focus:ring-[#1aff6e]/20"
                required
                minLength={3}
                maxLength={20}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[#b3b3b3] text-sm font-medium">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="pl-10 pr-10 bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#666] focus:border-[#1aff6e] focus:ring-[#1aff6e]/20"
                required
                minLength={4}
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {activeTab === 'register' && (
            <div className="space-y-2">
              <label className="text-[#b3b3b3] text-sm font-medium">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  className="pl-10 bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#666] focus:border-[#1aff6e] focus:ring-[#1aff6e]/20"
                  required
                  minLength={4}
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#1aff6e] to-[#00d9a3] text-[#0a0a0a] font-bold py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {activeTab === 'login' ? 'Connexion...' : 'Inscription...'}
              </>
            ) : (
              activeTab === 'login' ? 'Se connecter' : 'Créer mon compte'
            )}
          </Button>

          {/* Register Benefits */}
          {activeTab === 'register' && (
            <div className="pt-4 border-t border-[#2a2a2a]">
              <p className="text-[#666] text-xs text-center mb-3">En créant un compte, vous bénéficiez de :</p>
              <div className="flex justify-center gap-6 text-xs">
                <div className="flex items-center gap-2 text-[#1aff6e]">
                  <span className="w-2 h-2 bg-[#1aff6e] rounded-full" />
                  1000€ fictifs offerts
                </div>
                <div className="flex items-center gap-2 text-[#1aff6e]">
                  <span className="w-2 h-2 bg-[#1aff6e] rounded-full" />
                  Historique des paris
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
