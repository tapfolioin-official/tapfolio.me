import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/portfolio/nibras",
        destination: "/nibrasulhaqq",
        permanent: true,
      },
      {
        source: "/portfolio/nibrasulhaqq",
        destination: "/nibrasulhaqq",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
