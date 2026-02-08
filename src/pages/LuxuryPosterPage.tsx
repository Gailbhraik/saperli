import { useEffect } from 'react';

interface LuxuryPosterPageProps {
  onBack: () => void;
}

export function LuxuryPosterPage({ onBack }: LuxuryPosterPageProps) {
  useEffect(() => {
    document.title = 'I Am Stupid — Luxury Poster';
    return () => {
      document.title = 'Saperli';
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: '#08091a' }}>
      {/* Inline styles for animations and custom effects */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        .poster-container {
          font-family: 'Playfair Display', 'Cormorant Garamond', 'Georgia', serif;
        }

        /* Marble texture overlay */
        .marble-texture {
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(255,215,140,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(255,215,140,0.02) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 80%, rgba(180,160,200,0.02) 0%, transparent 40%);
        }

        /* Noise texture */
        .noise-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
          pointer-events: none;
          z-index: 1;
        }

        /* Golden glow effect */
        .golden-glow {
          box-shadow:
            0 0 80px rgba(212,175,55,0.08),
            0 0 160px rgba(212,175,55,0.04),
            inset 0 0 120px rgba(212,175,55,0.03);
        }

        /* Main title styling */
        .luxury-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: linear-gradient(
            135deg,
            #c9a84c 0%,
            #f7e89e 18%,
            #d4af37 35%,
            #f7e89e 50%,
            #c9a84c 65%,
            #f7e89e 82%,
            #d4af37 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 8px rgba(212,175,55,0.4))
                  drop-shadow(0 0 40px rgba(212,175,55,0.15));
          animation: shimmer 6s ease-in-out infinite;
          background-size: 200% 100%;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Embossed effect via text shadow layers */
        .embossed-text {
          text-shadow:
            0 1px 0 rgba(255,255,255,0.05),
            0 -1px 0 rgba(0,0,0,0.6),
            0 2px 4px rgba(0,0,0,0.4),
            0 4px 8px rgba(0,0,0,0.2),
            0 0 60px rgba(212,175,55,0.15);
        }

        /* Decorative line with gold gradient */
        .gold-line {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212,175,55,0.1) 15%,
            rgba(212,175,55,0.6) 40%,
            rgba(247,232,158,0.9) 50%,
            rgba(212,175,55,0.6) 60%,
            rgba(212,175,55,0.1) 85%,
            transparent 100%
          );
        }

        /* Corner accents */
        .corner-accent {
          border-color: rgba(212,175,55,0.3);
        }

        .corner-accent::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, rgba(247,232,158,0.8), rgba(212,175,55,0.4));
          border-radius: 50%;
        }

        .corner-tl { border-top: 1px solid; border-left: 1px solid; }
        .corner-tl::after { top: -4px; left: -4px; }

        .corner-tr { border-top: 1px solid; border-right: 1px solid; }
        .corner-tr::after { top: -4px; right: -4px; }

        .corner-bl { border-bottom: 1px solid; border-left: 1px solid; }
        .corner-bl::after { bottom: -4px; left: -4px; }

        .corner-br { border-bottom: 1px solid; border-right: 1px solid; }
        .corner-br::after { bottom: -4px; right: -4px; }

        /* Light flare */
        .light-flare {
          background: radial-gradient(
            ellipse at center,
            rgba(247,232,158,0.15) 0%,
            rgba(212,175,55,0.05) 30%,
            transparent 70%
          );
          animation: pulse-flare 8s ease-in-out infinite;
        }

        @keyframes pulse-flare {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        /* Vertical decorative lines */
        .vertical-gold-line {
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(212,175,55,0.05) 10%,
            rgba(212,175,55,0.2) 30%,
            rgba(212,175,55,0.4) 50%,
            rgba(212,175,55,0.2) 70%,
            rgba(212,175,55,0.05) 90%,
            transparent 100%
          );
        }

        /* Subtle grid pattern */
        .grid-pattern {
          background-image:
            linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Back button */
        .back-btn {
          font-family: 'Cormorant Garamond', serif;
          letter-spacing: 0.15em;
          transition: all 0.4s ease;
        }
        .back-btn:hover {
          color: #f7e89e;
          border-color: rgba(212,175,55,0.6);
        }

        /* Diamond decorative element */
        .diamond {
          width: 6px;
          height: 6px;
          transform: rotate(45deg);
          background: linear-gradient(135deg, #d4af37, #f7e89e);
          box-shadow: 0 0 12px rgba(212,175,55,0.5);
        }

        /* Subtitle styling */
        .subtitle-text {
          font-family: 'Cormorant Garamond', serif;
          letter-spacing: 0.5em;
          color: rgba(212,175,55,0.4);
        }

        /* Outer border frame */
        .outer-frame {
          border: 1px solid rgba(212,175,55,0.08);
          box-shadow:
            inset 0 0 100px rgba(8,9,26,0.8),
            0 0 100px rgba(212,175,55,0.03);
        }

        .inner-frame {
          border: 1px solid rgba(212,175,55,0.15);
        }
      `}</style>

      {/* Background layers */}
      <div className="absolute inset-0 marble-texture" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Ambient golden light — top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] light-flare"
        style={{ borderRadius: '50%', filter: 'blur(80px)' }}
      />

      {/* Ambient golden light — bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
        style={{
          borderRadius: '50%',
          filter: 'blur(100px)',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Back button */}
      <button
        onClick={onBack}
        className="back-btn fixed top-8 left-8 z-50 px-5 py-2 text-xs uppercase border border-white/10 text-white/40 rounded-none bg-black/30 backdrop-blur-sm"
      >
        Retour
      </button>

      {/* Main poster area */}
      <div className="poster-container relative z-10 flex items-center justify-center min-h-screen px-8 py-16">
        {/* Outer decorative frame */}
        <div className="outer-frame relative w-full max-w-4xl mx-auto golden-glow" style={{ aspectRatio: '3/4', maxHeight: '90vh' }}>

          {/* Inner frame */}
          <div className="inner-frame absolute inset-6 sm:inset-10 md:inset-16 flex flex-col items-center justify-center">

            {/* Corner accents */}
            <div className="corner-accent corner-tl absolute top-0 left-0 w-12 h-12" />
            <div className="corner-accent corner-tr absolute top-0 right-0 w-12 h-12" />
            <div className="corner-accent corner-bl absolute bottom-0 left-0 w-12 h-12" />
            <div className="corner-accent corner-br absolute bottom-0 right-0 w-12 h-12" />

            {/* Vertical decorative lines — left */}
            <div className="vertical-gold-line absolute left-[30%] top-[10%] w-[1px] h-[80%]" />
            {/* Vertical decorative lines — right */}
            <div className="vertical-gold-line absolute right-[30%] top-[10%] w-[1px] h-[80%]" />

            {/* Top decorative line */}
            <div className="gold-line absolute top-[20%] left-[10%] right-[10%] h-[1px]" />

            {/* Top subtitle */}
            <div className="subtitle-text absolute top-[13%] text-[10px] sm:text-xs tracking-widest uppercase">
              A Statement of Truth
            </div>

            {/* Diamond — top */}
            <div className="diamond absolute top-[19.3%]" />

            {/* Central text group */}
            <div className="flex flex-col items-center gap-4 text-center px-4">
              {/* Small decorative text above */}
              <span
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.6em] text-white/20"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Maison de Verite
              </span>

              {/* Main title */}
              <h1 className="luxury-title embossed-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight">
                I Am Stupid
              </h1>

              {/* Small decorative text below */}
              <span
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.6em] text-white/20"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Collection Priv&eacute;e &mdash; MMXXVI
              </span>
            </div>

            {/* Bottom decorative line */}
            <div className="gold-line absolute bottom-[20%] left-[10%] right-[10%] h-[1px]" />

            {/* Diamond — bottom */}
            <div className="diamond absolute bottom-[19.3%]" />

            {/* Bottom subtitle */}
            <div className="subtitle-text absolute bottom-[13%] text-[10px] sm:text-xs tracking-widest uppercase">
              Limited Edition
            </div>

            {/* Horizontal thin accent lines near center */}
            <div
              className="absolute left-[10%] w-[15%] h-[1px]"
              style={{
                top: '50%',
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15))',
              }}
            />
            <div
              className="absolute right-[10%] w-[15%] h-[1px]"
              style={{
                top: '50%',
                background: 'linear-gradient(-90deg, transparent, rgba(212,175,55,0.15))',
              }}
            />
          </div>

          {/* Edge metallic accents — four sides */}
          <div
            className="absolute top-0 left-[20%] right-[20%] h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)',
            }}
          />
          <div
            className="absolute bottom-0 left-[20%] right-[20%] h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)',
            }}
          />
          <div
            className="absolute left-0 top-[20%] bottom-[20%] w-[1px]"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.25), transparent)',
            }}
          />
          <div
            className="absolute right-0 top-[20%] bottom-[20%] w-[1px]"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.25), transparent)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
