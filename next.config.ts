import type { NextConfig } from 'next';
import { getGlobalSecurityHeaders } from './src/shared/lib/security-headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: getGlobalSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
