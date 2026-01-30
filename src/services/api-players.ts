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

export interface PlayerData {
  id: string;
  name: string;
  gamertag: string;
  role: 'top' | 'jungle' | 'mid' | 'adc' | 'support';
  teamId: string;
  teamName: string;
  teamSlug: string;
  leagueId: string;
  leagueName: string;
  leagueColor: string;
  country: string;
  image?: string;
}

export interface TeamData {
  id: string;
  name: string;
  slug: string;
  leagueId: string;
  leagueName: string;
  leagueColor: string;
  players: PlayerData[];
  logo?: string;
}

const roleMapping: Record<string, 'top' | 'jungle' | 'mid' | 'adc' | 'support'> = {
  'top': 'top',
  'jungle': 'jungle',
  'mid': 'mid',
  'bottom': 'adc',
  'adc': 'adc',
  'support': 'support',
};

const leagueColors: Record<string, string> = {
  'lec': '#00d4ff',
  'lfl': '#0055A4',
  'lck': '#e31c79',
  'lpl': '#ff6b35',
};

// Récupérer les équipes d'une ligue
async function fetchTeamsFromLeague(leagueId: string, leagueName: string): Promise<TeamData[]> {
  try {
    const response = await fetch(`${LOL_ESPORTS_API}/getTeams?hl=fr-FR&leagueId=${leagueId}`, {
      headers: {
        'x-api-key': LOL_ESPORTS_API_KEY,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.warn(`Failed to fetch teams for league ${leagueName}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const teams = data?.data?.teams || [];

    return teams.map((team: any) => {
      const teamSlug = team.slug || team.code || team.id;
      const leagueSlug = leagueName.toLowerCase();
      
      const players: PlayerData[] = (team.players || []).map((player: any) => ({
        id: player.id || `${team.id}-${player.summonerName}`,
        name: player.firstName || player.name || player.summonerName,
        gamertag: player.summonerName || player.name,
        role: roleMapping[player.role?.toLowerCase()] || 'mid',
        teamId: team.id,
        teamName: team.name,
        teamSlug: teamSlug,
        leagueId: leagueId,
        leagueName: leagueName,
        leagueColor: leagueColors[leagueSlug] || '#00d4ff',
        country: player.homeTown || 'Unknown',
        image: player.image,
      }));

      return {
        id: team.id,
        name: team.name,
        slug: teamSlug,
        leagueId: leagueId,
        leagueName: leagueName,
        leagueColor: leagueColors[leagueSlug] || '#00d4ff',
        players: players,
        logo: team.image,
      };
    });
  } catch (error) {
    console.error(`Error fetching teams for ${leagueName}:`, error);
    return [];
  }
}

// Données fallback pour les équipes
const FALLBACK_TEAMS: TeamData[] = [
  // G2 Esports
  {
    id: 'g2',
    name: 'G2 Esports',
    slug: 'g2',
    leagueId: LEAGUE_IDS.LEC,
    leagueName: 'LEC',
    leagueColor: '#00d4ff',
    players: [
      { id: 'g2-bb', name: 'BrokenBlade', gamertag: 'BB', role: 'top', teamId: 'g2', teamName: 'G2 Esports', teamSlug: 'g2', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'Allemagne' },
      { id: 'g2-yike', name: 'Yike', gamertag: 'Yike', role: 'jungle', teamId: 'g2', teamName: 'G2 Esports', teamSlug: 'g2', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'France' },
      { id: 'g2-caps', name: 'Caps', gamertag: 'Caps', role: 'mid', teamId: 'g2', teamName: 'G2 Esports', teamSlug: 'g2', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'Danemark' },
      { id: 'g2-hans', name: 'Hans Sama', gamertag: 'Hans Sama', role: 'adc', teamId: 'g2', teamName: 'G2 Esports', teamSlug: 'g2', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'France' },
      { id: 'g2-labrov', name: 'Labrov', gamertag: 'Labrov', role: 'support', teamId: 'g2', teamName: 'G2 Esports', teamSlug: 'g2', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'Grèce' },
    ],
  },
  // Fnatic
  {
    id: 'fnatic',
    name: 'Fnatic',
    slug: 'fnatic',
    leagueId: LEAGUE_IDS.LEC,
    leagueName: 'LEC',
    leagueColor: '#00d4ff',
    players: [
      { id: 'fnc-oscar', name: 'Oscarinin', gamertag: 'Oscarinin', role: 'top', teamId: 'fnatic', teamName: 'Fnatic', teamSlug: 'fnatic', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'Espagne' },
      { id: 'fnc-razork', name: 'Razork', gamertag: 'Razork', role: 'jungle', teamId: 'fnatic', teamName: 'Fnatic', teamSlug: 'fnatic', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'Espagne' },
      { id: 'fnc-humanoid', name: 'Humanoid', gamertag: 'Humanoid', role: 'mid', teamId: 'fnatic', teamName: 'Fnatic', teamSlug: 'fnatic', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'Tchéquie' },
      { id: 'fnc-upset', name: 'Upset', gamertag: 'Upset', role: 'adc', teamId: 'fnatic', teamName: 'Fnatic', teamSlug: 'fnatic', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'Allemagne' },
      { id: 'fnc-nisqy', name: 'Nisqy', gamertag: 'Nisqy', role: 'support', teamId: 'fnatic', teamName: 'Fnatic', teamSlug: 'fnatic', leagueId: LEAGUE_IDS.LEC, leagueName: 'LEC', leagueColor: '#00d4ff', country: 'Belgique' },
    ],
  },
  // T1
  {
    id: 't1',
    name: 'T1',
    slug: 't1',
    leagueId: LEAGUE_IDS.LCK,
    leagueName: 'LCK',
    leagueColor: '#e31c79',
    players: [
      { id: 't1-zeus', name: 'Zeus', gamertag: 'Zeus', role: 'top', teamId: 't1', teamName: 'T1', teamSlug: 't1', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
      { id: 't1-oner', name: 'Oner', gamertag: 'Oner', role: 'jungle', teamId: 't1', teamName: 'T1', teamSlug: 't1', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
      { id: 't1-faker', name: 'Faker', gamertag: 'Faker', role: 'mid', teamId: 't1', teamName: 'T1', teamSlug: 't1', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
      { id: 't1-gumayusi', name: 'Gumayusi', gamertag: 'Gumayusi', role: 'adc', teamId: 't1', teamName: 'T1', teamSlug: 't1', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
      { id: 't1-keria', name: 'Keria', gamertag: 'Keria', role: 'support', teamId: 't1', teamName: 'T1', teamSlug: 't1', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
    ],
  },
  // Gen.G
  {
    id: 'geng',
    name: 'Gen.G',
    slug: 'geng',
    leagueId: LEAGUE_IDS.LCK,
    leagueName: 'LCK',
    leagueColor: '#e31c79',
    players: [
      { id: 'geng-kiin', name: 'Kiin', gamertag: 'Kiin', role: 'top', teamId: 'geng', teamName: 'Gen.G', teamSlug: 'geng', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
      { id: 'geng-canyon', name: 'Canyon', gamertag: 'Canyon', role: 'jungle', teamId: 'geng', teamName: 'Gen.G', teamSlug: 'geng', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
      { id: 'geng-chovy', name: 'Chovy', gamertag: 'Chovy', role: 'mid', teamId: 'geng', teamName: 'Gen.G', teamSlug: 'geng', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
      { id: 'geng-ruler', name: 'Ruler', gamertag: 'Ruler', role: 'adc', teamId: 'geng', teamName: 'Gen.G', teamSlug: 'geng', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
      { id: 'geng-duro', name: 'Duro', gamertag: 'Duro', role: 'support', teamId: 'geng', teamName: 'Gen.G', teamSlug: 'geng', leagueId: LEAGUE_IDS.LCK, leagueName: 'LCK', leagueColor: '#e31c79', country: 'Corée du Sud' },
    ],
  },
  // BLG
  {
    id: 'blg',
    name: 'Bilibili Gaming',
    slug: 'blg',
    leagueId: LEAGUE_IDS.LPL,
    leagueName: 'LPL',
    leagueColor: '#ff6b35',
    players: [
      { id: 'blg-bin', name: 'Bin', gamertag: 'Bin', role: 'top', teamId: 'blg', teamName: 'Bilibili Gaming', teamSlug: 'blg', leagueId: LEAGUE_IDS.LPL, leagueName: 'LPL', leagueColor: '#ff6b35', country: 'Chine' },
      { id: 'blg-wei', name: 'Wei', gamertag: 'Wei', role: 'jungle', teamId: 'blg', teamName: 'Bilibili Gaming', teamSlug: 'blg', leagueId: LEAGUE_IDS.LPL, leagueName: 'LPL', leagueColor: '#ff6b35', country: 'Chine' },
      { id: 'blg-knight', name: 'Knight', gamertag: 'Knight', role: 'mid', teamId: 'blg', teamName: 'Bilibili Gaming', teamSlug: 'blg', leagueId: LEAGUE_IDS.LPL, leagueName: 'LPL', leagueColor: '#ff6b35', country: 'Chine' },
      { id: 'blg-elk', name: 'Elk', gamertag: 'Elk', role: 'adc', teamId: 'blg', teamName: 'Bilibili Gaming', teamSlug: 'blg', leagueId: LEAGUE_IDS.LPL, leagueName: 'LPL', leagueColor: '#ff6b35', country: 'Chine' },
      { id: 'blg-on', name: 'ON', gamertag: 'ON', role: 'support', teamId: 'blg', teamName: 'Bilibili Gaming', teamSlug: 'blg', leagueId: LEAGUE_IDS.LPL, leagueName: 'LPL', leagueColor: '#ff6b35', country: 'Chine' },
    ],
  },
];

// Récupérer toutes les équipes et joueurs
export async function fetchTeamsAndPlayers(): Promise<{
  teams: TeamData[];
  players: PlayerData[];
  byLeague: Record<string, TeamData[]>;
}> {
  const allTeams: TeamData[] = [];
  const byLeague: Record<string, TeamData[]> = {
    lec: [],
    lfl: [],
    lck: [],
    lpl: [],
  };

  // Essayer de récupérer depuis l'API
  const leagues = [
    { id: LEAGUE_IDS.LEC, name: 'LEC' },
    { id: LEAGUE_IDS.LFL, name: 'LFL' },
    { id: LEAGUE_IDS.LCK, name: 'LCK' },
    { id: LEAGUE_IDS.LPL, name: 'LPL' },
  ];

  for (const league of leagues) {
    try {
      const teams = await fetchTeamsFromLeague(league.id, league.name);
      if (teams.length > 0) {
        allTeams.push(...teams);
        byLeague[league.name.toLowerCase()] = teams;
      }
    } catch (error) {
      console.warn(`Could not fetch teams for ${league.name}:`, error);
    }
  }

  // Si aucune donnée API, utiliser les fallback
  if (allTeams.length === 0) {
    console.log('Using fallback team data');
    allTeams.push(...FALLBACK_TEAMS);
    byLeague['lec'] = FALLBACK_TEAMS.filter(t => t.leagueId === LEAGUE_IDS.LEC);
    byLeague['lck'] = FALLBACK_TEAMS.filter(t => t.leagueId === LEAGUE_IDS.LCK);
    byLeague['lpl'] = FALLBACK_TEAMS.filter(t => t.leagueId === LEAGUE_IDS.LPL);
  }

  // Aplatir tous les joueurs
  const allPlayers: PlayerData[] = allTeams.flatMap(team => team.players);

  return {
    teams: allTeams,
    players: allPlayers,
    byLeague,
  };
}

// Rechercher des joueurs
export function searchPlayers(players: PlayerData[], query: string): PlayerData[] {
  const lowerQuery = query.toLowerCase();
  return players.filter(player =>
    player.gamertag.toLowerCase().includes(lowerQuery) ||
    player.name.toLowerCase().includes(lowerQuery) ||
    player.teamName.toLowerCase().includes(lowerQuery)
  );
}

// Filtrer les joueurs par ligue
export function filterPlayersByLeague(players: PlayerData[], leagueId: string): PlayerData[] {
  return players.filter(player => player.leagueId === leagueId);
}

// Filtrer les joueurs par équipe
export function filterPlayersByTeam(players: PlayerData[], teamId: string): PlayerData[] {
  return players.filter(player => player.teamId === teamId);
}

export { LEAGUE_IDS };
