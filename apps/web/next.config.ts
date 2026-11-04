import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@calafrio/core", "@calafrio/ficha-app", "@calafrio/tema"],
};

export default nextConfig;
