import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite abrir o servidor de dev pelo celular na mesma rede Wi-Fi.
  allowedDevOrigins: ["192.168.4.171"],
  transpilePackages: [
    "@calafrio/core",
    "@calafrio/ficha-app",
    "@calafrio/tema",
  ],
};

export default nextConfig;
