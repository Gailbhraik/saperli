import type { EsportsMatch } from '@/types';

// LoL Esports API Configuration
const LOL_ESPORTS_API = 'https://esports-api.lolesports.com/persisted/gw';
const LOL_ESPORTS_API_KEY = '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z';

// IDs des ligues
const LEAGUE_IDS = {
  LEC: '98767991302996019',
  LFL: '105266098308571975',
  LCK: '98767991310872058',
  LPL: '98767991314006698',
};

// Logos des ligues
export const LEAGUE_LOGOS: Record<string, string> = {
  'lec': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/86/LEC_2023_icon_allmode.png',
  'lfl': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d0/LFL_2023_lightmode.png',
  'lck': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a3/LCK_2024_icon_allmode.png',
  'lpl': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/da/LPL_2024_icon_allmode.png',
  'worlds': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/1/17/Worlds_2024_icon_allmode.png',
  'msi': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/c6/MSI_2024_icon_allmode.png',
  'lol': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/48/LoL_icon.png',
};

// Couleurs des ligues
export function getLeagueColor(league: string): string {
  const l = league.toLowerCase();
  if (l.includes('lec')) return '#00d4ff';
  if (l.includes('lfl')) return '#0055A4';
  if (l.includes('lck')) return '#e31c79';
  if (l.includes('lpl')) return '#ff6b35';
  if (l.includes('worlds')) return '#f0b232';
  if (l.includes('msi')) return '#8b5cf6';
  return '#00d4ff';
}

// URLs des logos des équipes
const TEAM_LOGOS: Record<string, string> = {
  // LEC Teams
  'g2': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/77/G2_Esportslogo_square.png',
  'fnatic': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/fc/Fnaticlogo_square.png',
  'mad': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/4a/MAD_Lions_KOIlogo_square.png',
  'karmine': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2f/Karmine_Corplogo_square.png',
  'vitality': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/64/Team_Vitalitylogo_square.png',
  'bds': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a0/Team_BDSlogo_square.png',
  'heretics': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0c/Team_Hereticslogo_square.png',
  'giantx': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/53/GIANTXlogo_square.png',
  'rogue': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/6e/Roguelogo_square.png',
  'sk': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/04/SK_Gaminglogo_square.png',
  // LFL Teams
  'ldlc': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a6/LDLC_OLlogo_square.png',
  'solary': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/40/Solarylogo_square.png',
  'vitality-bee': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/98/Team_Vitality.Beelogo_square.png',
  'bds-academy': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/c9/Team_BDS_Academylogo_square.png',
  'gameward': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/60/GameWardlogo_square.png',
  'gentle-mates': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/82/Gentle_Mateslogo_square.png',
  // LCK Teams
  't1': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a3/T1logo_square.png',
  'geng': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/Gen.Glogo_square.png',
  'hle': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/07/Hanwha_Life_Esportslogo_square.png',
  'dplus': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0b/Dplus_KIAlogo_square.png',
  'kt': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/1/1f/KT_Rolsterlogo_square.png',
  'drx': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9d/DRXlogo_square.png',
  // LPL Teams
  'blg': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/b/b2/Bilibili_Gaminglogo_square.png',
  'tes': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9c/Top_Esportslogo_square.png',
  'jdg': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/21/JD_Gaminglogo_square.png',
  'weibo': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/f6/Weibo_Gaminglogo_square.png',
  'lng': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8f/LNG_Esportslogo_square.png',
  'edg': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/6c/EDward_Gaminglogo_square.png',
};

// Fonction pour obtenir le logo d'une équipe
function getTeamLogo(teamId: string, teamName: string): string {
  const normalizedId = teamId.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (TEAM_LOGOS[normalizedId]) return TEAM_LOGOS[normalizedId];
  
  const normalizedName = teamName.toLowerCase();
  for (const [key, url] of Object.entries(TEAM_LOGOS)) {
    if (normalizedName.includes(key)) return url;
  }
  
  return '';
}

// Générer des cotes réalistes
function generateOdds(team1Strength: number = 50, team2Strength: number = 50): { home: number; away: number } {
  const total = team1Strength + team2Strength;
  const prob1 = team1Strength / total;
  const prob2 = team2Strength / total;
  const margin = 1.05;
  
  return {
    home: Math.max(1.10, +(margin / prob1).toFixed(2)),
    away: Math.max(1.10, +(margin / prob2).toFixed(2))
  };
}

// Données LEC Winter 2025
const FALLBACK_LEC_MATCHES: EsportsMatch[] = [
  {
    id: 'lec-1',
    homeTeam: { id: 'g2', name: 'G2 Esports', logo: TEAM_LOGOS['g2'], country: 'EU' },
    awayTeam: { id: 'fnatic', name: 'Fnatic', logo: TEAM_LOGOS['fnatic'], country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(55, 45),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lec-2',
    homeTeam: { id: 'mad', name: 'MAD Lions KOI', logo: TEAM_LOGOS['mad'], country: 'EU' },
    awayTeam: { id: 'karmine', name: 'Karmine Corp', logo: TEAM_LOGOS['karmine'], country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 172800000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(45, 55),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lec-3',
    homeTeam: { id: 'heretics', name: 'Team Heretics', logo: TEAM_LOGOS['heretics'], country: 'EU' },
    awayTeam: { id: 'vitality', name: 'Team Vitality', logo: TEAM_LOGOS['vitality'], country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 259200000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(50, 50),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lec-4',
    homeTeam: { id: 'bds', name: 'Team BDS', logo: TEAM_LOGOS['bds'], country: 'EU' },
    awayTeam: { id: 'sk', name: 'SK Gaming', logo: TEAM_LOGOS['sk'], country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 345600000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(60, 40),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lec-5',
    homeTeam: { id: 'giantx', name: 'GIANTX', logo: TEAM_LOGOS['giantx'], country: 'EU' },
    awayTeam: { id: 'rogue', name: 'Rogue', logo: TEAM_LOGOS['rogue'], country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 432000000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(40, 60),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lec-6',
    homeTeam: { id: 'fnatic', name: 'Fnatic', logo: TEAM_LOGOS['fnatic'], country: 'EU' },
    awayTeam: { id: 'karmine', name: 'Karmine Corp', logo: TEAM_LOGOS['karmine'], country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date(Date.now() + 518400000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(52, 48),
    game: 'lol',
    format: 'bo3'
  },
];

// Données LFL Division 1 2025
const FALLBACK_LFL_MATCHES: EsportsMatch[] = [
  {
    id: 'lfl-1',
    homeTeam: { id: 'karmine', name: 'Karmine Corp Blue', logo: TEAM_LOGOS['karmine'], country: 'FR' },
    awayTeam: { id: 'gentle-mates', name: 'Gentle Mates', logo: TEAM_LOGOS['gentle-mates'], country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 43200000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(65, 35),
    game: 'lol',
    format: 'bo1'
  },
  {
    id: 'lfl-2',
    homeTeam: { id: 'ldlc', name: 'LDLC OL', logo: TEAM_LOGOS['ldlc'], country: 'FR' },
    awayTeam: { id: 'solary', name: 'Solary', logo: TEAM_LOGOS['solary'], country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(50, 50),
    game: 'lol',
    format: 'bo1'
  },
  {
    id: 'lfl-3',
    homeTeam: { id: 'vitality-bee', name: 'Vitality.Bee', logo: TEAM_LOGOS['vitality-bee'], country: 'FR' },
    awayTeam: { id: 'bds-academy', name: 'BDS Academy', logo: TEAM_LOGOS['bds-academy'], country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 129600000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(45, 55),
    game: 'lol',
    format: 'bo1'
  },
  {
    id: 'lfl-4',
    homeTeam: { id: 'gameward', name: 'GameWard', logo: TEAM_LOGOS['gameward'], country: 'FR' },
    awayTeam: { id: 'ldlc', name: 'LDLC OL', logo: TEAM_LOGOS['ldlc'], country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 172800000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(48, 52),
    game: 'lol',
    format: 'bo1'
  },
  {
    id: 'lfl-5',
    homeTeam: { id: 'solary', name: 'Solary', logo: TEAM_LOGOS['solary'], country: 'FR' },
    awayTeam: { id: 'gentle-mates', name: 'Gentle Mates', logo: TEAM_LOGOS['gentle-mates'], country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date(Date.now() + 216000000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(52, 48),
    game: 'lol',
    format: 'bo1'
  },
];

// Matchs internationaux
const FALLBACK_INTERNATIONAL_MATCHES: EsportsMatch[] = [
  {
    id: 'lck-1',
    homeTeam: { id: 't1', name: 'T1', logo: TEAM_LOGOS['t1'], country: 'KR' },
    awayTeam: { id: 'geng', name: 'Gen.G', logo: TEAM_LOGOS['geng'], country: 'KR' },
    sport: 'esports',
    league: 'LCK Spring 2025',
    startTime: new Date(Date.now() + 518400000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(48, 52),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lck-2',
    homeTeam: { id: 'hle', name: 'Hanwha Life Esports', logo: TEAM_LOGOS['hle'], country: 'KR' },
    awayTeam: { id: 'dplus', name: 'Dplus KIA', logo: TEAM_LOGOS['dplus'], country: 'KR' },
    sport: 'esports',
    league: 'LCK Spring 2025',
    startTime: new Date(Date.now() + 604800000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(55, 45),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lck-3',
    homeTeam: { id: 'kt', name: 'KT Rolster', logo: TEAM_LOGOS['kt'], country: 'KR' },
    awayTeam: { id: 'drx', name: 'DRX', logo: TEAM_LOGOS['drx'], country: 'KR' },
    sport: 'esports',
    league: 'LCK Spring 2025',
    startTime: new Date(Date.now() + 691200000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(50, 50),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lpl-1',
    homeTeam: { id: 'blg', name: 'Bilibili Gaming', logo: TEAM_LOGOS['blg'], country: 'CN' },
    awayTeam: { id: 'tes', name: 'Top Esports', logo: TEAM_LOGOS['tes'], country: 'CN' },
    sport: 'esports',
    league: 'LPL Spring 2025',
    startTime: new Date(Date.now() + 777600000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(58, 42),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lpl-2',
    homeTeam: { id: 'jdg', name: 'JD Gaming', logo: TEAM_LOGOS['jdg'], country: 'CN' },
    awayTeam: { id: 'weibo', name: 'Weibo Gaming', logo: TEAM_LOGOS['weibo'], country: 'CN' },
    sport: 'esports',
    league: 'LPL Spring 2025',
    startTime: new Date(Date.now() + 864000000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(52, 48),
    game: 'lol',
    format: 'bo3'
  },
  {
    id: 'lpl-3',
    homeTeam: { id: 'lng', name: 'LNG Esports', logo: TEAM_LOGOS['lng'], country: 'CN' },
    awayTeam: { id: 'edg', name: 'EDward Gaming', logo: TEAM_LOGOS['edg'], country: 'CN' },
    sport: 'esports',
    league: 'LPL Spring 2025',
    startTime: new Date(Date.now() + 950400000).toISOString(),
    status: 'upcoming',
    odds: generateOdds(48, 52),
    game: 'lol',
    format: 'bo3'
  },
];

// Matchs en direct
const FALLBACK_LIVE_MATCHES: EsportsMatch[] = [
  {
    id: 'live-1',
    homeTeam: { id: 'g2', name: 'G2 Esports', logo: TEAM_LOGOS['g2'], country: 'EU' },
    awayTeam: { id: 'mad', name: 'MAD Lions KOI', logo: TEAM_LOGOS['mad'], country: 'EU' },
    sport: 'esports',
    league: 'LEC Winter 2025',
    startTime: new Date().toISOString(),
    status: 'live',
    score: { home: 1, away: 0 },
    time: 'Game 2',
    odds: generateOdds(60, 40),
    game: 'lol',
    format: 'bo3',
    currentGame: 2
  },
  {
    id: 'live-2',
    homeTeam: { id: 'karmine', name: 'Karmine Corp Blue', logo: TEAM_LOGOS['karmine'], country: 'FR' },
    awayTeam: { id: 'ldlc', name: 'LDLC OL', logo: TEAM_LOGOS['ldlc'], country: 'FR' },
    sport: 'esports',
    league: 'LFL Division 1 2025',
    startTime: new Date().toISOString(),
    status: 'live',
    score: { home: 12, away: 8 },
    time: '28:45',
    odds: generateOdds(70, 30),
    game: 'lol',
    format: 'bo1'
  },
];

// Transformer les données de l'API
function transformLoLEsportsMatch(event: any, isLive: boolean = false): EsportsMatch | null {
  const match = event.match;
  if (!match?.teams || match.teams.length < 2) return null;

  const team1 = match.teams[0];
  const team2 = match.teams[1];
  if (!team1 || !team2) return null;

  let format: 'bo1' | 'bo3' | 'bo5' = 'bo3';
  if (match.strategy?.count === 1) format = 'bo1';
  else if (match.strategy?.count === 5) format = 'bo5';

  let score: { home: number; away: number } | undefined;
  let currentGame: number | undefined;
  
  if (isLive && team1.result && team2.result) {
    score = {
      home: team1.result.gameWins || 0,
      away: team2.result.gameWins || 0
    };
    currentGame = (score.home + score.away) + 1;
  }

  return {
    id: `lol-${match.id}`,
    homeTeam: {
      id: team1.slug || team1.code,
      name: team1.name,
      logo: team1.image || getTeamLogo(team1.slug || '', team1.name),
      country: getCountryFromLeague(event.league?.slug),
    },
    awayTeam: {
      id: team2.slug || team2.code,
      name: team2.name,
      logo: team2.image || getTeamLogo(team2.slug || '', team2.name),
      country: getCountryFromLeague(event.league?.slug),
    },
    sport: 'esports',
    league: event.league?.name || 'League of Legends',
    startTime: event.startTime || new Date().toISOString(),
    status: isLive ? 'live' : 'upcoming',
    score,
    time: isLive ? (currentGame ? `Game ${currentGame}` : 'LIVE') : undefined,
    odds: generateOdds(50 + (Math.random() * 20 - 10), 50 + (Math.random() * 20 - 10)),
    game: 'lol',
    format,
    currentGame,
  };
}

function getCountryFromLeague(leagueSlug?: string): string {
  if (!leagueSlug) return 'INT';
  const slug = leagueSlug.toLowerCase();
  if (slug.includes('lec') || slug.includes('european')) return 'EU';
  if (slug.includes('lfl') || slug.includes('french')) return 'FR';
  if (slug.includes('lck') || slug.includes('korea')) return 'KR';
  if (slug.includes('lpl') || slug.includes('china')) return 'CN';
  return 'INT';
}

// Récupérer les matchs live
async function fetchLiveMatches(): Promise<EsportsMatch[]> {
  try {
    const response = await fetch(`${LOL_ESPORTS_API}/getLive?hl=fr-FR`, {
      headers: {
        'x-api-key': LOL_ESPORTS_API_KEY,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) return FALLBACK_LIVE_MATCHES;

    const data = await response.json();
    const events = data?.data?.schedule?.events || [];
    
    const liveMatches = events
      .filter((e: any) => e.state === 'inProgress' && e.type === 'match')
      .map((e: any) => transformLoLEsportsMatch(e, true))
      .filter(Boolean) as EsportsMatch[];

    return liveMatches.length > 0 ? liveMatches : FALLBACK_LIVE_MATCHES;
  } catch {
    return FALLBACK_LIVE_MATCHES;
  }
}

// Récupérer le calendrier
async function fetchSchedule(leagueId?: string): Promise<EsportsMatch[]> {
  try {
    let url = `${LOL_ESPORTS_API}/getSchedule?hl=fr-FR`;
    if (leagueId) url += `&leagueId=${leagueId}`;

    const response = await fetch(url, {
      headers: {
        'x-api-key': LOL_ESPORTS_API_KEY,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    const events = data?.data?.schedule?.events || [];
    
    return events
      .filter((e: any) => (e.state === 'unstarted' || e.state === 'inProgress') && e.type === 'match')
      .slice(0, 10)
      .map((e: any) => transformLoLEsportsMatch(e, e.state === 'inProgress'))
      .filter(Boolean) as EsportsMatch[];
  } catch {
    return [];
  }
}

// Fonction principale
export async function fetchEsportsMatches(): Promise<EsportsMatch[]> {
  try {
    const allMatches: EsportsMatch[] = [];

    const liveMatches = await fetchLiveMatches();
    allMatches.push(...liveMatches.filter(m => m.status === 'live'));

    for (const leagueId of Object.values(LEAGUE_IDS)) {
      try {
        const matches = await fetchSchedule(leagueId);
        allMatches.push(...matches);
      } catch {
        // Ignorer
      }
    }

    if (allMatches.length > 0) {
      allMatches.sort((a, b) => {
        if (a.status === 'live' && b.status !== 'live') return -1;
        if (b.status === 'live' && a.status !== 'live') return 1;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
      return allMatches;
    }

    return [...FALLBACK_LIVE_MATCHES, ...FALLBACK_LFL_MATCHES, ...FALLBACK_LEC_MATCHES, ...FALLBACK_INTERNATIONAL_MATCHES];
  } catch {
    return [...FALLBACK_LIVE_MATCHES, ...FALLBACK_LFL_MATCHES, ...FALLBACK_LEC_MATCHES, ...FALLBACK_INTERNATIONAL_MATCHES];
  }
}

// Export avec catégorisation
export async function fetchAllMatches(): Promise<{
  esports: EsportsMatch[];
  lec: EsportsMatch[];
  lfl: EsportsMatch[];
  international: EsportsMatch[];
  live: EsportsMatch[];
}> {
  const esports = await fetchEsportsMatches();
  
  const lec = esports.filter(m => {
    const l = m.league.toLowerCase();
    return l.includes('lec') || l.includes('european championship');
  });
  
  const lfl = esports.filter(m => {
    const l = m.league.toLowerCase();
    return l.includes('lfl') || l.includes('française') || l.includes('french');
  });
  
  const live = esports.filter(m => m.status === 'live');
  
  const international = esports.filter(m => {
    const l = m.league.toLowerCase();
    return !l.includes('lec') && !l.includes('lfl') && 
           !l.includes('european championship') && 
           !l.includes('française') && !l.includes('french') &&
           m.status !== 'live';
  });

  return {
    esports,
    lec: lec.length > 0 ? lec : FALLBACK_LEC_MATCHES,
    lfl: lfl.length > 0 ? lfl : FALLBACK_LFL_MATCHES,
    international: international.length > 0 ? international : FALLBACK_INTERNATIONAL_MATCHES,
    live: live.length > 0 ? live : FALLBACK_LIVE_MATCHES,
  };
}

export { fetchLiveMatches, fetchSchedule, LEAGUE_IDS, TEAM_LOGOS };
