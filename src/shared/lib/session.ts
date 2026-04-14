import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function requireSessionUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) {
    redirect('/auth/signin');
  }
  return id;
}
