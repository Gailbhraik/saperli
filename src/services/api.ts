import type { EsportsMatch } from '@/types';

// API Configuration
const PANDASCORE_KEY = 'SA5CWOJW9B8NMlbuQ54qAMEV_2rnoRi43w7k6T0MvdUsm7_4HF4';
const PANDASCORE_BASE = 'https://api.pandascore.co';

// Données de fallback LEC (League of Legends European Championship)
const FALLBACK_LEC_MATCHES: EsportsMatch[] = [
  {
    id: 'lec-1',
    homeTeam: { id: 'g2', name: 'G2 Esports', logo: 'https://cdn-api.pandascore.co/images/team/image/1301/g2_esportslogo_square.png', country: 'EU' },
    awayTeam: { id: 'fnc', name: 'Fnatic', logo: 'https://cdn-api.pandascore.co/images/team/image/99/fnaticlogo_square.png', country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.75, away: 2.05 },
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lec-2',
    homeTeam: { id: 'mad', name: 'MAD Lions KOI', logo: 'https://cdn-api.pandascore.co/images/team/image/126313/mad_lions_koilogo_square.png', country: 'EU' },
    awayTeam: { id: 'kc', name: 'Karmine Corp', logo: 'https://cdn-api.pandascore.co/images/team/image/129382/karmine_corplogo_square.png', country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 172800000).toISOString(),
    status: 'upcoming',
    odds: { home: 2.10, away: 1.70 },
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lec-3',
    homeTeam: { id: 'th', name: 'Team Heretics', logo: 'https://cdn-api.pandascore.co/images/team/image/129467/team_hereticslogo_square.png', country: 'EU' },
    awayTeam: { id: 'vit', name: 'Team Vitality', logo: 'https://cdn-api.pandascore.co/images/team/image/1244/team_vitalitylogo_square.png', country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 259200000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.90, away: 1.90 },
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lec-4',
    homeTeam: { id: 'bds', name: 'Team BDS', logo: 'https://cdn-api.pandascore.co/images/team/image/129366/team_bdslogo_square.png', country: 'EU' },
    awayTeam: { id: 'sk', name: 'SK Gaming', logo: 'https://cdn-api.pandascore.co/images/team/image/100/sk_gaminglogo_square.png', country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 345600000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.55, away: 2.40 },
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lec-5',
    homeTeam: { id: 'gx', name: 'GIANTX', logo: 'https://cdn-api.pandascore.co/images/team/image/129584/giantxlogo_square.png', country: 'EU' },
    awayTeam: { id: 'rge', name: 'Rogue', logo: 'https://cdn-api.pandascore.co/images/team/image/126329/roguelogo_square.png', country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 432000000).toISOString(),
    status: 'upcoming',
    odds: { home: 2.30, away: 1.60 },
    game: 'lol',
    format: 'bo3'
  },
];

// Données de fallback LFL (Ligue Française de League of Legends)
const FALLBACK_LFL_MATCHES: EsportsMatch[] = [
  {
    id: 'lfl-1',
    homeTeam: { id: 'kc-lfl', name: 'Karmine Corp', logo: 'https://cdn-api.pandascore.co/images/team/image/129382/karmine_corplogo_square.png', country: 'FR' },
    awayTeam: { id: 'gen', name: 'Gentle Mates', logo: 'https://cdn-api.pandascore.co/images/team/image/130073/gentle_mateslogo_square.png', country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 43200000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.40, away: 2.90 },
    game: 'lol',
    format: 'bo1'
  },
  {
    id: 'lfl-2',
    homeTeam: { id: 'ldlc', name: 'LDLC OL', logo: 'https://cdn-api.pandascore.co/images/team/image/1686/ldlc_ollogo_square.png', country: 'FR' },
    awayTeam: { id: 'sol', name: 'Solary', logo: 'https://cdn-api.pandascore.co/images/team/image/126634/solarylogo_square.png', country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.85, away: 1.95 },
    game: 'lol',
    format: 'bo1'
  },
  {
    id: 'lfl-3',
    homeTeam: { id: 'vit-b', name: 'Vitality.Bee', logo: 'https://cdn-api.pandascore.co/images/team/image/126630/team_vitality_beelogo_square.png', country: 'FR' },
    awayTeam: { id: 'bds-a', name: 'BDS Academy', logo: 'https://cdn-api.pandascore.co/images/team/image/129368/team_bds_academylogo_square.png', country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 129600000).toISOString(),
    status: 'upcoming',
    odds: { home: 2.20, away: 1.65 },
    game: 'lol',
    format: 'bo1'
  },
  {
    id: 'lfl-4',
    homeTeam: { id: 'mand', name: 'Mandragore', logo: 'https://cdn-api.pandascore.co/images/team/image/131200/mandragorelogo_square.png', country: 'FR' },
    awayTeam: { id: 'sly', name: 'Stormly', logo: 'https://cdn-api.pandascore.co/images/team/image/131201/stormlylogo_square.png', country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 172800000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.75, away: 2.05 },
    game: 'lol',
    format: 'bo1'
  },
  {
    id: 'lfl-5',
    homeTeam: { id: 'gm-lfl', name: 'GameWard', logo: 'https://cdn-api.pandascore.co/images/team/image/126625/gamewardlogo_square.png', country: 'FR' },
    awayTeam: { id: 'bk', name: 'BK ROG', logo: 'https://cdn-api.pandascore.co/images/team/image/126627/bk_roglogo_square.png', country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 216000000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.95, away: 1.85 },
    game: 'lol',
    format: 'bo1'
  },
];

// Autres matchs internationaux (LCK, LPL, etc.)
const FALLBACK_INTERNATIONAL_MATCHES: EsportsMatch[] = [
  {
    id: 'lck-1',
    homeTeam: { id: 't1', name: 'T1', logo: 'https://cdn-api.pandascore.co/images/team/image/126311/t1logo_square.png', country: 'KR' },
    awayTeam: { id: 'geng', name: 'Gen.G', logo: 'https://cdn-api.pandascore.co/images/team/image/2882/gen_glogo_square.png', country: 'KR' },
    sport: 'esports',
    league: 'LCK Spring 2025',
    startTime: new Date(Date.now() + 518400000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.85, away: 1.95 },
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lck-2',
    homeTeam: { id: 'hle', name: 'Hanwha Life Esports', logo: 'https://cdn-api.pandascore.co/images/team/image/2905/hanwha_life_esportslogo_square.png', country: 'KR' },
    awayTeam: { id: 'dk', name: 'Dplus KIA', logo: 'https://cdn-api.pandascore.co/images/team/image/128450/dplus_kialogo_square.png', country: 'KR' },
    sport: 'esports',
    league: 'LCK Spring 2025',
    startTime: new Date(Date.now() + 604800000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.70, away: 2.15 },
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lpl-1',
    homeTeam: { id: 'blg', name: 'Bilibili Gaming', logo: 'https://cdn-api.pandascore.co/images/team/image/126061/bilibili_gaminglogo_square.png', country: 'CN' },
    awayTeam: { id: 'tes', name: 'Top Esports', logo: 'https://cdn-api.pandascore.co/images/team/image/3161/top_esportslogo_square.png', country: 'CN' },
    sport: 'esports',
    league: 'LPL Spring 2025',
    startTime: new Date(Date.now() + 691200000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.55, away: 2.40 },
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lpl-2',
    homeTeam: { id: 'jdg', name: 'JD Gaming', logo: 'https://cdn-api.pandascore.co/images/team/image/3000/jd_gaminglogo_square.png', country: 'CN' },
    awayTeam: { id: 'wbg', name: 'Weibo Gaming', logo: 'https://cdn-api.pandascore.co/images/team/image/128435/weibo_gaminglogo_square.png', country: 'CN' },
    sport: 'esports',
    league: 'LPL Spring 2025',
    startTime: new Date(Date.now() + 777600000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.80, away: 2.00 },
    game: 'lol',
    format: 'bo3'
  },
];

// Live matches (simulés)
const FALLBACK_LIVE_MATCHES: EsportsMatch[] = [
  {
    id: 'live-1',
    homeTeam: { id: 'g2', name: 'G2 Esports', logo: 'https://cdn-api.pandascore.co/images/team/image/1301/g2_esportslogo_square.png', country: 'EU' },
    awayTeam: { id: 'mad', name: 'MAD Lions KOI', logo: 'https://cdn-api.pandascore.co/images/team/image/126313/mad_lions_koilogo_square.png', country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date().toISOString(),
    status: 'live',
    score: { home: 1, away: 0 },
    time: 'Game 2',
    odds: { home: 1.45, away: 2.75 },
    game: 'lol',
    format: 'bo3',
    currentGame: 2
  },
  {
    id: 'live-2',
    homeTeam: { id: 'kc-lfl', name: 'Karmine Corp', logo: 'https://cdn-api.pandascore.co/images/team/image/129382/karmine_corplogo_square.png', country: 'FR' },
    awayTeam: { id: 'ldlc', name: 'LDLC OL', logo: 'https://cdn-api.pandascore.co/images/team/image/1686/ldlc_ollogo_square.png', country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date().toISOString(),
    status: 'live',
    score: { home: 12, away: 8 },
    time: '28:45',
    odds: { home: 1.30, away: 3.50 },
    game: 'lol',
    format: 'bo1'
  },
];

// Esports API (PandaScore)
export async function fetchEsportsMatches(): Promise<EsportsMatch[]> {
  try {
    const allMatches: EsportsMatch[] = [];

    // Essayer de récupérer les matchs LoL de l'API
    try {
      const response = await fetch(
        `${PANDASCORE_BASE}/lol/matches/upcoming?sort=begin_at&page[size]=20&filter[league_id]=4197,4198,293,294,4199`, // LEC, LFL, LCK, LPL
        {
          headers: {
            'Authorization': `Bearer ${PANDASCORE_KEY}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const matches = transformPandaScoreData(data);
        allMatches.push(...matches);
      }
    } catch (err) {
      console.log('Erreur lors de la récupération des matchs LoL:', err);
    }

    // Essayer de récupérer les matchs en cours
    try {
      const liveResponse = await fetch(
        `${PANDASCORE_BASE}/lol/matches/running`,
        {
          headers: {
            'Authorization': `Bearer ${PANDASCORE_KEY}`,
            'Accept': 'application/json'
          }
        }
      );

      if (liveResponse.ok) {
        const liveData = await liveResponse.json();
        const liveMatches = transformPandaScoreData(liveData, true);
        allMatches.push(...liveMatches);
      }
    } catch (err) {
      console.log('Erreur lors de la récupération des matchs live:', err);
    }

    if (allMatches.length > 0) {
      return allMatches;
    }

    // Fallback si l'API ne retourne rien
    return [...FALLBACK_LIVE_MATCHES, ...FALLBACK_LFL_MATCHES, ...FALLBACK_LEC_MATCHES, ...FALLBACK_INTERNATIONAL_MATCHES];
  } catch (error) {
    console.log('Erreur API Esports:', error);
    return [...FALLBACK_LIVE_MATCHES, ...FALLBACK_LFL_MATCHES, ...FALLBACK_LEC_MATCHES, ...FALLBACK_INTERNATIONAL_MATCHES];
  }
}

function transformPandaScoreData(apiData: any[], isLive = false): EsportsMatch[] {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((match: any) => {
    const homeTeam = match.opponents?.[0]?.opponent;
    const awayTeam = match.opponents?.[1]?.opponent;

    if (!homeTeam || !awayTeam) return null;

    // Déterminer le format (bo1, bo3, bo5)
    let format: 'bo1' | 'bo3' | 'bo5' = 'bo3';
    if (match.number_of_games === 1) format = 'bo1';
    else if (match.number_of_games === 5) format = 'bo5';

    // Générer des cotes réalistes
    const homeOdds = 1.5 + Math.random() * 1.5;
    const awayOdds = 1.5 + Math.random() * 1.5;

    return {
      id: `es-${match.id}`,
      homeTeam: {
        id: String(homeTeam.id),
        name: homeTeam.name,
        logo: homeTeam.image_url || '',
        country: homeTeam.location || 'International',
      },
      awayTeam: {
        id: String(awayTeam.id),
        name: awayTeam.name,
        logo: awayTeam.image_url || '',
        country: awayTeam.location || 'International',
      },
      sport: 'esports',
      league: match.league?.name || match.tournament?.name || 'League of Legends',
      startTime: match.begin_at || match.scheduled_at || new Date().toISOString(),
      status: isLive || match.status === 'running' ? 'live' : 'upcoming',
      score: (isLive || match.status === 'running') && match.results?.[0] ? {
        home: match.results[0].score,
        away: match.results[1]?.score || 0,
      } : undefined,
      time: isLive || match.status === 'running' ? 'LIVE' : undefined,
      odds: {
        home: +homeOdds.toFixed(2),
        away: +awayOdds.toFixed(2),
      },
      game: 'lol' as const,
      format,
      currentGame: match.games?.filter((g: any) => g.finished)?.length + 1 || 1,
    };
  }).filter(Boolean) as EsportsMatch[];
}

// Récupérer tous les matchs (uniquement esport maintenant)
export async function fetchAllMatches(): Promise<{
  esports: EsportsMatch[];
  lec: EsportsMatch[];
  lfl: EsportsMatch[];
  international: EsportsMatch[];
  live: EsportsMatch[];
}> {
  const esports = await fetchEsportsMatches();
  
  // Séparer les matchs par ligue
  const lec = esports.filter(m => 
    m.league.toLowerCase().includes('lec') || 
    m.league.toLowerCase().includes('european')
  );
  
  const lfl = esports.filter(m => 
    m.league.toLowerCase().includes('lfl') || 
    m.league.toLowerCase().includes('française') ||
    m.league.toLowerCase().includes('french')
  );
  
  const live = esports.filter(m => m.status === 'live');
  
  const international = esports.filter(m => 
    !m.league.toLowerCase().includes('lec') && 
    !m.league.toLowerCase().includes('lfl') &&
    !m.league.toLowerCase().includes('european') &&
    !m.league.toLowerCase().includes('française') &&
    !m.league.toLowerCase().includes('french') &&
    m.status !== 'live'
  );

  return {
    esports,
    lec: lec.length > 0 ? lec : FALLBACK_LEC_MATCHES,
    lfl: lfl.length > 0 ? lfl : FALLBACK_LFL_MATCHES,
    international: international.length > 0 ? international : FALLBACK_INTERNATIONAL_MATCHES,
    live: live.length > 0 ? live : FALLBACK_LIVE_MATCHES,
  };
}
