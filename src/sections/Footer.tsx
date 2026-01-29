import { useState, useEffect } from 'react';
import { Send, Twitter, Instagram, Youtube, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  sports: [
    { label: 'Football', href: '#' },
    { label: 'Tennis', href: '#' },
    { label: 'Basketball', href: '#' },
    { label: 'Esports', href: '#' },
    { label: 'Rugby', href: '#' },
    { label: 'F1', href: '#' },
  ],
  help: [
    { label: 'FAQ', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Règles', href: '#' },
    { label: 'Paris responsables', href: '#' },
  ],
  legal: [
    { label: 'CGU', href: '#' },
    { label: 'Confidentialité', href: '#' },
    { label: 'Licence', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter', color: '#1DA1F2' },
  { icon: Instagram, href: '#', label: 'Instagram', color: '#E4405F' },
  { icon: MessageCircle, href: '#', label: 'Discord', color: '#5865F2' },
  { icon: Youtube, href: '#', label: 'YouTube', color: '#FF0000' },
];

export function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footer = document.getElementById('footer');
    if (footer) observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer id="footer" className="relative bg-[#0a0a0a] pt-20 pb-8 overflow-hidden">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(26,255,110,0.3) 0%, transparent 70%)',
            top: '-200px',
            left: '10%',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
            bottom: '-100px',
            right: '20%',
            animation: 'float 15s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter */}
        <div
          className={`relative bg-gradient-to-br from-[#141414] to-[#0f1110] border border-[#2a2a2a] rounded-2xl p-8 mb-16 -mt-28 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                RECEVEZ NOS OFFRES EXCLUSIVES
              </h3>
              <p className="text-[#b3b3b3]">
                Inscrivez-vous pour recevoir les meilleures cotes et promotions
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-64 bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#666] focus:border-[#1aff6e]"
                  disabled={isSubscribed}
                />
              </div>
              <Button
                type="submit"
                className={`transition-all duration-300 ${
                  isSubscribed
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-[#1aff6e] to-[#00d9a3] text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(26,255,110,0.4)]'
                }`}
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  '✓ Inscrit!'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    S'INSCRIRE
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div
            className={`col-span-2 md:col-span-4 lg:col-span-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1aff6e] to-[#00d9a3] rounded-lg flex items-center justify-center">
                <span className="text-[#0a0a0a] font-bold text-xl">B</span>
              </div>
              <span className="text-white font-bold text-xl">
                Bet<span className="text-[#1aff6e]">Pro</span>
              </span>
            </a>
            <p className="text-[#666] text-sm mb-4">
              La plateforme de paris sportifs la plus innovante avec les meilleures cotes et un cash-out instantané.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg flex items-center justify-center transition-all duration-300 group"
                  title={social.label}
                >
                  <social.icon
                    className="w-5 h-5 text-[#666] group-hover:text-white transition-colors"
                    style={{ '--hover-color': social.color } as React.CSSProperties}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Sports */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h4 className="text-white font-semibold mb-4">Sports</h4>
            <ul className="space-y-2">
              {footerLinks.sports.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#666] hover:text-[#1aff6e] text-sm transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h4 className="text-white font-semibold mb-4">Aide</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#666] hover:text-[#1aff6e] text-sm transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#666] hover:text-[#1aff6e] text-sm transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t border-[#2a2a2a] flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-[#666] text-sm">
            © 2025 BetPro. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[#666] text-sm">18+</span>
            <span className="text-[#666] text-sm">|</span>
            <span className="text-[#666] text-sm">Jouez de manière responsable</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -30px); }
          50% { transform: translate(-20px, 20px); }
          75% { transform: translate(20px, 10px); }
        }
      `}</style>
    </footer>
  );
}
