import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/abhinand",
        destination: "/portfolio/abhinand",
        permanent: true,
      },
      {
        source: "/nibras",
        destination: "/nibrasulhaqq",
        permanent: true,
      },
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
      {
        source: "/founders/nibras",
        destination: "/founders/mohammed-nibrasul-haqq",
        permanent: true,
      },
      {
        source: "/founders/nibrasulhaqq",
        destination: "/founders/mohammed-nibrasul-haqq",
        permanent: true,
      },
      {
        source: "/founders/abhinand-ks",
        destination: "/founders/abhinand",
        permanent: true,
      },
      {
        source: "/founders/abhinand-k-s",
        destination: "/founders/abhinand",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

