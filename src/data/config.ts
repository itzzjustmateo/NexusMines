// src/data/config.ts

export type ServerConfig = {
  javaIp: string;
  bedrockIp: string;
  javaPort: number;
  bedrockPort: number;
};

export const config: ServerConfig = {
  "javaIp": process.env.NEXT_PUBLIC_JAVA_IP || "nexusmines.minekeep.gg",
  "bedrockIp": process.env.NEXT_PUBLIC_BEDROCK_IP || "nexusmines.bedrock.minekeep.gg",
  "javaPort": parseInt(process.env.NEXT_PUBLIC_JAVA_PORT || "25565"),
  "bedrockPort": parseInt(process.env.NEXT_PUBLIC_BEDROCK_PORT || "19132")
};
