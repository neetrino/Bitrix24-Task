import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AccessStatus } from '@prisma/client';
import { auth } from '@/auth';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (session?.user?.accessStatus !== AccessStatus.ACTIVE) {
    redirect('/app/pending');
  }
  return <>{children}</>;
}
