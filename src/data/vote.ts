export type VoteSite = {
  name: string;
  href: string;
  icon: string;
  color: string;
  desc: string;
  enabled: boolean;
};

export const voteSites: VoteSite[] = [
  {
    "name": "PlanetMinecraft",
    "href": "https://www.planetminecraft.com/server/nexusmines/",
    "icon": "Star",
    "color": "text-yellow-500",
    "desc": "Vote for us and help us climb the rankings.",
    "enabled": true
  },
  {
    "name": "MinecraftServers.org",
    "href": "https://minecraftservers.org/server/681467",
    "icon": "Rocket",
    "color": "text-blue-500",
    "desc": "Support NexusMines and spread the word.",
    "enabled": true
  }
];
