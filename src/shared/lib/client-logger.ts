/**
 * Tiny client-side logger used from `'use client'` components.
 *
 * Importing the server `pino` logger from a client component pulls the whole
 * pino runtime into the browser bundle. This wrapper exposes a compatible
 * `{ error, warn, info }` shape backed by `console` so client code can log
 * without that bundle cost. In production it degrades to `console.error`
 * only (warnings/info are silenced to keep the devtools console clean).
 */

type LogContext = Record<string, unknown>;

const isProd = process.env.NODE_ENV === 'production';

function format(context: LogContext | undefined, message: string | undefined): unknown[] {
  if (context === undefined && message === undefined) return [];
  if (message === undefined) return [context];
  if (context === undefined) return [message];
  return [message, context];
}

export const clientLogger = {
  error(context?: LogContext, message?: string): void {
    console.error(...format(context, message));
  },
  warn(context?: LogContext, message?: string): void {
    if (isProd) return;
    console.warn(...format(context, message));
  },
  info(context?: LogContext, message?: string): void {
    if (isProd) return;
    console.info(...format(context, message));
  },
};
