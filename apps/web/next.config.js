/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@signalicity/shared", "@signalicity/ai"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.scw.cloud" },
    ],
  },
};

module.exports = nextConfig;
