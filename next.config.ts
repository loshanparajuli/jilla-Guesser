import type { NextConfig } from "next";

/**
 * The game is entirely client-side, so it ships as a static export: `next build`
 * writes plain files to ./out. NEXT_PUBLIC_BASE_PATH is set only when the site
 * is served from a repo subpath, as GitHub Pages does; on Vercel it is unset.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  agentRules: false,
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
