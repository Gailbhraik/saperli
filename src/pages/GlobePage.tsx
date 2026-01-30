import { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, Users, MapPin, Info, Globe as GlobeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import Globe from 'react-globe.gl';

interface TeamData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  leagueId: string;
  leagueName: string;
  leagueColor: string;
}

interface LeagueInfo {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  color: string;
  description: string;
}

interface GlobePageProps {
  onBack: () => void;
}

interface LabelData {
  lat: number;
  lng: number;
  text: string;
  size: number;
  color: string;
  team: TeamData;
}

// Informations des ligues
const leaguesInfo: LeagueInfo[] = [
  {
    id: 'lec',
    name: 'LEC',
    country: 'Europe',
    countryCode: 'EU',
    color: '#00d4ff',
    description: 'League of Legends EMEA Championship - La ligue européenne majeure'
  },
  {
    id: 'lfl',
    name: 'LFL',
    country: 'France',
    countryCode: 'FR',
    color: '#0055A4',
    description: 'Ligue Française de League of Legends - Division 1'
  },
  {
    id: 'lck',
    name: 'LCK',
    country: 'Corée du Sud',
    countryCode: 'KR',
    color: '#e31c79',
    description: 'League of Legends Champions Korea - La ligue coréenne, berceau du esport'
  },
  {
    id: 'lpl',
    name: 'LPL',
    country: 'Chine',
    countryCode: 'CN',
    color: '#ff6b35',
    description: 'League of Legends Pro League - La plus grande ligue au monde'
  },
];

// Toutes les équipes avec leurs coordonnées géographiques
const teamsData: TeamData[] = [
  // LEC - Europe (coordonnées basées sur les sièges sociaux)
  { id: 'g2', name: 'G2 Esports', lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Allemagne', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  { id: 'fnatic', name: 'Fnatic', lat: 51.5074, lng: -0.1278, city: 'Londres', country: 'Royaume-Uni', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  { id: 'mad', name: 'MAD Lions KOI', lat: 40.4168, lng: -3.7038, city: 'Madrid', country: 'Espagne', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  { id: 'karmine', name: 'Karmine Corp', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  { id: 'vitality', name: 'Team Vitality', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  { id: 'bds', name: 'Team BDS', lat: 46.2044, lng: 6.1432, city: 'Genève', country: 'Suisse', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  { id: 'heretics', name: 'Team Heretics', lat: 40.4168, lng: -3.7038, city: 'Madrid', country: 'Espagne', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  { id: 'giantx', name: 'GIANTX', lat: 51.5074, lng: -0.1278, city: 'Londres', country: 'Royaume-Uni', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  { id: 'rogue', name: 'Rogue', lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Allemagne', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  { id: 'sk', name: 'SK Gaming', lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Allemagne', leagueId: 'lec', leagueName: 'LEC', leagueColor: '#00d4ff' },
  
  // LFL - France
  { id: 'kcblue', name: 'Karmine Corp Blue', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', leagueId: 'lfl', leagueName: 'LFL', leagueColor: '#0055A4' },
  { id: 'gentlemates', name: 'Gentle Mates', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', leagueId: 'lfl', leagueName: 'LFL', leagueColor: '#0055A4' },
  { id: 'ldlc', name: 'LDLC OL', lat: 45.7640, lng: 4.8357, city: 'Lyon', country: 'France', leagueId: 'lfl', leagueName: 'LFL', leagueColor: '#0055A4' },
  { id: 'solary', name: 'Solary', lat: 47.2184, lng: -1.5536, city: 'Nantes', country: 'France', leagueId: 'lfl', leagueName: 'LFL', leagueColor: '#0055A4' },
  { id: 'vitalitybee', name: 'Vitality.Bee', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', leagueId: 'lfl', leagueName: 'LFL', leagueColor: '#0055A4' },
  { id: 'bdsacademy', name: 'BDS Academy', lat: 46.2044, lng: 6.1432, city: 'Genève', country: 'Suisse', leagueId: 'lfl', leagueName: 'LFL', leagueColor: '#0055A4' },
  { id: 'gameward', name: 'GameWard', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', leagueId: 'lfl', leagueName: 'LFL', leagueColor: '#0055A4' },
  
  // LCK - Corée du Sud
  { id: 't1', name: 'T1', lat: 37.5665, lng: 126.9780, city: 'Séoul', country: 'Corée du Sud', leagueId: 'lck', leagueName: 'LCK', leagueColor: '#e31c79' },
  { id: 'geng', name: 'Gen.G', lat: 37.5665, lng: 126.9780, city: 'Séoul', country: 'Corée du Sud', leagueId: 'lck', leagueName: 'LCK', leagueColor: '#e31c79' },
  { id: 'hle', name: 'Hanwha Life Esports', lat: 37.5665, lng: 126.9780, city: 'Séoul', country: 'Corée du Sud', leagueId: 'lck', leagueName: 'LCK', leagueColor: '#e31c79' },
  { id: 'dplus', name: 'Dplus KIA', lat: 35.1796, lng: 129.0756, city: 'Busan', country: 'Corée du Sud', leagueId: 'lck', leagueName: 'LCK', leagueColor: '#e31c79' },
  { id: 'kt', name: 'KT Rolster', lat: 37.5665, lng: 126.9780, city: 'Séoul', country: 'Corée du Sud', leagueId: 'lck', leagueName: 'LCK', leagueColor: '#e31c79' },
  { id: 'drx', name: 'DRX', lat: 37.5665, lng: 126.9780, city: 'Séoul', country: 'Corée du Sud', leagueId: 'lck', leagueName: 'LCK', leagueColor: '#e31c79' },
  
  // LPL - Chine
  { id: 'blg', name: 'Bilibili Gaming', lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'Chine', leagueId: 'lpl', leagueName: 'LPL', leagueColor: '#ff6b35' },
  { id: 'tes', name: 'Top Esports', lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'Chine', leagueId: 'lpl', leagueName: 'LPL', leagueColor: '#ff6b35' },
  { id: 'jdg', name: 'JD Gaming', lat: 39.9042, lng: 116.4074, city: 'Pékin', country: 'Chine', leagueId: 'lpl', leagueName: 'LPL', leagueColor: '#ff6b35' },
  { id: 'weibo', name: 'Weibo Gaming', lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'Chine', leagueId: 'lpl', leagueName: 'LPL', leagueColor: '#ff6b35' },
  { id: 'lng', name: 'LNG Esports', lat: 30.5728, lng: 104.0668, city: 'Chengdu', country: 'Chine', leagueId: 'lpl', leagueName: 'LPL', leagueColor: '#ff6b35' },
  { id: 'edg', name: 'EDward Gaming', lat: 23.1291, lng: 113.2644, city: 'Guangzhou', country: 'Chine', leagueId: 'lpl', leagueName: 'LPL', leagueColor: '#ff6b35' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GlobeMethods = any;

export function GlobePage({ onBack }: GlobePageProps) {
  const [selectedLeague, setSelectedLeague] = useState<LeagueInfo | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [hoveredTeam, setHoveredTeam] = useState<TeamData | null>(null);
  const globeRef = useRef<GlobeMethods>(null);

  // Données des labels pour toutes les équipes
  const labelsData = useMemo(() => {
    return teamsData.map(team => ({
      lat: team.lat,
      lng: team.lng,
      text: team.name,
      size: 0.8,
      color: team.leagueColor,
      team: team,
    }));
  }, []);

  useEffect(() => {
    // Auto-rotate globe
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const handleMarkerClick = (label: LabelData | null) => {
    if (!label) return;
    setSelectedTeam(label.team);
    const league = leaguesInfo.find(l => l.id === label.team.leagueId) || null;
    setSelectedLeague(league);
    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: label.lat, lng: label.lng, altitude: 1.2 },
        1000
      );
    }
  };

  const handleLeagueClick = (league: LeagueInfo) => {
    setSelectedLeague(league);
    setSelectedTeam(null);
    // Centrer sur la première équipe de cette ligue
    const firstTeam = teamsData.find(t => t.leagueId === league.id);
    if (firstTeam && globeRef.current) {
      globeRef.current.pointOfView(
        { lat: firstTeam.lat, lng: firstTeam.lng, altitude: 1.5 },
        1000
      );
    }
  };

  // Obtenir les équipes d'une ligue
  const getTeamsByLeague = (leagueId: string) => {
    return teamsData.filter(team => team.leagueId === leagueId);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-[#b3b3b3] hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <div className="h-6 w-px bg-[#2a2a2a]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                <GlobeIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Carte des Équipes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 h-screen flex">
        {/* Globe Section */}
        <div className="flex-1 relative">
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            labelsData={labelsData}
            labelLat={(d: object) => (d as LabelData).lat}
            labelLng={(d: object) => (d as LabelData).lng}
            labelText={(d: object) => (d as LabelData).text}
            labelSize={(d: object) => (d as LabelData).size}
            labelColor={(d: object) => (d as LabelData).color}
            labelAltitude={0.02}
            onLabelClick={(label: object) => handleMarkerClick(label as LabelData)}
            onLabelHover={(label: object | null) => setHoveredTeam((label as LabelData | null)?.team || null)}
            labelLabel={(d: object) => {
              const label = d as LabelData;
              return `
              <div style="
                background: rgba(10, 10, 10, 0.9);
                border: 1px solid ${label.color};
                border-radius: 8px;
                padding: 8px 12px;
                color: white;
                font-family: sans-serif;
                font-size: 14px;
                max-width: 200px;
              ">
                <strong style="color: ${label.color}">${label.team.name}</strong><br/>
                <span style="font-size: 12px; color: #b3b3b3;">${label.team.city}, ${label.team.country}</span><br/>
                <span style="font-size: 11px; color: ${label.color};">${label.team.leagueName}</span>
              </div>
            `}}
            width={window.innerWidth * 0.7}
            height={window.innerHeight - 64}
          />

          {/* Hover Tooltip */}
          {hoveredTeam && !selectedTeam && (
            <div className="absolute top-4 left-4 bg-[#141414]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-lg p-4 max-w-xs pointer-events-none">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: hoveredTeam.leagueColor }}
                />
                <span className="font-bold text-white">{hoveredTeam.name}</span>
              </div>
              <p className="text-sm text-[#b3b3b3]">{hoveredTeam.city}, {hoveredTeam.country}</p>
              <p className="text-xs mt-1" style={{ color: hoveredTeam.leagueColor }}>{hoveredTeam.leagueName}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-[400px] bg-[#141414] border-l border-[#2a2a2a] flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {!selectedLeague ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Explorez les équipes
                  </h3>
                  <p className="text-[#b3b3b3]">
                    Cliquez sur un marqueur du globe ou sélectionnez une ligue pour voir les équipes
                  </p>
                  
                  <div className="mt-8 space-y-3">
                    {leaguesInfo.map((league) => {
                      const teamCount = getTeamsByLeague(league.id).length;
                      return (
                        <button
                          key={league.id}
                          onClick={() => handleLeagueClick(league)}
                          className="w-full flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-lg transition-all duration-200 text-left"
                        >
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: league.color }}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-white">{league.name}</p>
                            <p className="text-sm text-[#b3b3b3]">{league.country}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            style={{ borderColor: league.color, color: league.color }}
                          >
                            {teamCount} équipes
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* League Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: selectedLeague.color }}
                        />
                        <Badge 
                          variant="outline" 
                          style={{ borderColor: selectedLeague.color, color: selectedLeague.color }}
                        >
                          {selectedLeague.countryCode}
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedLeague.name}
                      </h2>
                      <p className="text-[#b3b3b3] mt-1">{selectedLeague.country}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLeague(null);
                        setSelectedTeam(null);
                      }}
                      className="text-[#b3b3b3] hover:text-white"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Description */}
                  <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
                    <CardContent className="p-4">
                      <p className="text-[#b3b3b3]">{selectedLeague.description}</p>
                    </CardContent>
                  </Card>

                  {/* Selected Team Info */}
                  {selectedTeam && selectedTeam.leagueId === selectedLeague.id && (
                    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-[#2a2a2a] border-l-4"
                      style={{ borderLeftColor: selectedTeam.leagueColor }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${selectedTeam.leagueColor}20` }}
                          >
                            <MapPin className="w-5 h-5" style={{ color: selectedTeam.leagueColor }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-lg">{selectedTeam.name}</h4>
                            <p className="text-sm text-[#b3b3b3]">{selectedTeam.city}, {selectedTeam.country}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                style={{ borderColor: selectedTeam.leagueColor, color: selectedTeam.leagueColor }}
                              >
                                {selectedTeam.leagueName}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Teams List */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-[#00d4ff]" />
                      <h3 className="font-bold text-white">Équipes</h3>
                      <Badge variant="secondary" className="bg-[#1a1a1a] text-[#b3b3b3]">
                        {getTeamsByLeague(selectedLeague.id).length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {getTeamsByLeague(selectedLeague.id).map((team, index) => (
                        <button
                          key={team.id}
                          onClick={() => {
                            setSelectedTeam(team);
                            if (globeRef.current) {
                              globeRef.current.pointOfView(
                                { lat: team.lat, lng: team.lng, altitude: 1.2 },
                                800
                              );
                            }
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${
                            selectedTeam?.id === team.id 
                              ? 'bg-[#2a2a2a] border border-[#3a3a3a]' 
                              : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a]'
                          }`}
                        >
                          <span 
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ 
                              backgroundColor: `${team.leagueColor}20`,
                              color: team.leagueColor 
                            }}
                          >
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-white block truncate">{team.name}</span>
                            <span className="text-xs text-[#b3b3b3] block">{team.city}</span>
                          </div>
                          <MapPin className="w-4 h-4 text-[#666] flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-[#2a2a2a]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-[#b3b3b3]">
                        Statistiques
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-[#0a0a0a] rounded-lg">
                          <p className="text-2xl font-bold" style={{ color: selectedLeague.color }}>
                            {getTeamsByLeague(selectedLeague.id).length}
                          </p>
                          <p className="text-xs text-[#b3b3b3]">Équipes</p>
                        </div>
                        <div className="text-center p-3 bg-[#0a0a0a] rounded-lg">
                          <p className="text-2xl font-bold" style={{ color: selectedLeague.color }}>
                            {selectedLeague.id === 'lec' || selectedLeague.id === 'lck' || selectedLeague.id === 'lpl' ? 'BO3' : 'BO1'}
                          </p>
                          <p className="text-xs text-[#b3b3b3]">Format</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Back Button */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedLeague(null);
                      setSelectedTeam(null);
                    }}
                    className="w-full border-[#2a2a2a] hover:bg-[#1a1a1a] text-white"
                  >
                    Voir toutes les ligues
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
