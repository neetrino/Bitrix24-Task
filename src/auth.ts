import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Email from 'next-auth/providers/email';
import { Resend } from 'resend';
import { prisma } from '@/shared/lib/prisma';
import { logger } from '@/shared/lib/logger';

const fromFallback = 'PlanRelay <onboarding@resend.dev>';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: process.env.AUTH_TRUST_HOST === 'true' || process.env.VERCEL === '1',
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  providers: [
    Email({
      // Required by the Email provider (Nodemailer wiring); actual delivery uses Resend below.
      server: {
        host: 'localhost',
        port: 587,
        auth: { user: 'unused', pass: 'unused' },
      },
      from: process.env.RESEND_FROM_EMAIL ?? fromFallback,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          logger.info({ email: identifier, url }, 'Magic link (dev — set RESEND_API_KEY to send email)');
          return;
        }
        const resend = new Resend(apiKey);
        const from = typeof provider.from === 'string' ? provider.from : fromFallback;
        const { error } = await resend.emails.send({
          from,
          to: identifier,
          subject: 'Sign in to PlanRelay',
          html: `<p><a href="${url}">Sign in to PlanRelay</a></p>`,
        });
        if (error) {
          logger.error({ err: error, email: identifier }, 'Resend send failed');
          throw new Error(error.message);
        }
      },
    }),
  ],
});
