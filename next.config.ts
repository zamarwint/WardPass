import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/api/profile/avatar": [
      "./node_modules/@img/sharp-libvips-linux-x64/**/*",
      "./node_modules/@img/sharp-linux-x64/**/*",
    ],
  },
  typescript: {
    tsconfigPath: "./tsconfig.build.json",
  },
};

export default nextConfig;
