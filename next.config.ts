import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dynamic listings pull image URLs from many external CDNs, so allow any
    // HTTPS hostname instead of hand-listing them. Safety comes from the
    // protocol constraint (no plain HTTP) plus runtime validation in
    // src/lib/images.ts: img() parses pass-through URLs, upgrades them to
    // https, and falls back to the placeholder when malformed.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
