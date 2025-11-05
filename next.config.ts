import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images from Unsplash used in listings and placeholders.
  // Note: `images.domains` is deprecated in newer Next.js versions in favor of
  // `images.remotePatterns`. Keep `domains` for compatibility; migrate to
  // `remotePatterns` if you upgrade Next.js and need stricter pattern matching.
  // See: https://nextjs.org/docs/basic-features/image-optimization#remote-patterns
  images: {
    domains: ["images.unsplash.com", "picsum.photos", "res.cloudinary.com"],
    // Keep remotePatterns for stricter control and future Next.js versions
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
