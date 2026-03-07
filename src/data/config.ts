// src/data/config.ts

export type ServerConfig = {
  javaIp: string;
  bedrockIp: string;
  javaPort: number;
  bedrockPort: number;
};

export const config: ServerConfig = {
  javaIp: "nexusmines.minekeep.gg",
  bedrockIp: "nexusmines.bedrock.minekeep.gg",
  javaPort: 25565,
  bedrockPort: 19132,
};
