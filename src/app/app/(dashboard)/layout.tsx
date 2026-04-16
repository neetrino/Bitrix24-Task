import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AccessStatus } from '@prisma/client';
import { getSession } from '@/shared/lib/session';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (session?.user?.accessStatus !== AccessStatus.ACTIVE) {
    redirect('/app/pending');
  }
  return <>{children}</>;
}
