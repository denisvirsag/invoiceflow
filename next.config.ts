import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "*.loca.lt",
    "*.localtunnel.me",
    "192.168.1.4"
  ]
};

export default nextConfig;
