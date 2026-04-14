import { AccessStatus } from '@prisma/client';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function requireActiveUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) {
    redirect('/auth/signin');
  }
  if (session.user.accessStatus !== AccessStatus.ACTIVE) {
    redirect('/app/pending');
  }
  return id;
}

/** For Route Handlers: returns JSON Response when not allowed. */
export async function requireActiveUserForApi(): Promise<
  { userId: string } | { error: Response }
> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (session.user.accessStatus !== AccessStatus.ACTIVE) {
    return { error: Response.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { userId };
}
