/**
 * Global HTTP security headers for Next.js (`next.config` → `headers()`).
 * CSP is a baseline for App Router; adjust if a third-party script/font is added.
 */

const DEV_UNSAFE_EVAL = "'unsafe-eval'";
const UNSAFE_INLINE = "'unsafe-inline'";

/** Seconds — align with common HSTS guidance on HTTPS deployments. */
const HSTS_MAX_AGE = 31_536_000;

function isProductionNodeEnv(): boolean {
  return process.env.NODE_ENV === 'production';
}

function isVercelDeployment(): boolean {
  return process.env.VERCEL === '1';
}

/**
 * Content-Security-Policy: default baseline for Next.js 15 + Tailwind (no third-party scripts in layout).
 * In development, `unsafe-eval` is included because the Next.js dev bundler relies on it.
 */
export function buildContentSecurityPolicy(): string {
  const scriptSrc = [
    "'self'",
    UNSAFE_INLINE,
    ...(isProductionNodeEnv() ? [] : [DEV_UNSAFE_EVAL]),
  ].join(' ');

  const directives: string[] = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src 'self' ${UNSAFE_INLINE}`,
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "connect-src 'self'",
  ];

  if (isProductionNodeEnv()) {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

export type SecurityHeader = { key: string; value: string };

/**
 * Headers applied to all routes (`/:path*`).
 */
export function getGlobalSecurityHeaders(): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy() },
  ];

  if (isProductionNodeEnv() && isVercelDeployment()) {
    headers.push({
      key: 'Strict-Transport-Security',
      value: `max-age=${HSTS_MAX_AGE}; includeSubDomains; preload`,
    });
  }

  return headers;
}
