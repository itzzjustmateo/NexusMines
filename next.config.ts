import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://dc.gg/technova",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mc-heads.net",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "minotar.net",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "crafatar.com",
        pathname: "/avatars/**",
      },
    ],
  },
};

export default nextConfig;
