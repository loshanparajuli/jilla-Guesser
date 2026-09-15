import type { NextConfig } from "next";

/**
 * Static export so the whole game ships to GitHub Pages as plain files.
 * BASE_PATH is set by CI when the site is served from a repo subpath.
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
