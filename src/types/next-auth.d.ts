import type { DefaultSession } from 'next-auth';
import type { AccessStatus } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: { id: string; accessStatus: AccessStatus } & DefaultSession['user'];
  }
}
