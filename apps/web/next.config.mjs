/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_STANDALONE === "true" || process.platform !== "win32" ? "standalone" : undefined,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "naachiyars.in",
      },
      {
        protocol: "https",
        hostname: "www.thescmsilk.in",
      },
      {
        protocol: "https",
        hostname: "www.pothys.com",
      },
    ],
  },
};

export default nextConfig;
