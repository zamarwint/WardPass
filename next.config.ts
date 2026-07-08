import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
    ],
    remotePatterns: [
      new URL("https://lh3.googleusercontent.com/**")
    ]
  },
};

export default nextConfig;
