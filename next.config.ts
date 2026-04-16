import type { NextConfig } from 'next';
import { getGlobalSecurityHeaders } from './src/shared/lib/security-headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Strip the default `X-Powered-By: Next.js` header (tiny bandwidth + fingerprint win).
  poweredByHeader: false,
  /**
   * Keep heavy server-only runtimes out of client bundles. If a `'use client'`
   * file accidentally imports one of these, Next will throw at build time
   * instead of silently shipping megabytes to the browser.
   */
  serverExternalPackages: ['pino', 'nodemailer', '@prisma/client'],
  experimental: {
    /**
     * Tree-shake barrel re-exports of these packages so the client only
     * pulls the functions it actually references. Saves noticeable JS on
     * pages that import a handful of utilities from large packages.
     */
    optimizePackageImports: ['zod', 'sonner', 'date-fns', 'yaml'],
  },
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
