import Link from 'next/link';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AiShell } from '@/features/marketing/AiShell';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }
  return (
    <AiShell contentClassName="flex h-dvh min-h-0 flex-col overflow-hidden">
      <header className="shrink-0 border-b border-workspace-hairline bg-workspace-rail">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link className="font-semibold text-neutral-100" href="/app">
              PlanRelay
            </Link>
            <Link className="text-sm text-neutral-400 transition hover:text-neutral-200" href="/">
              Home
            </Link>
            <Link
              className="text-sm text-neutral-400 transition hover:text-neutral-200"
              href="/app/account"
            >
              My account
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col overflow-y-auto px-6 py-8">
        {children}
      </div>
    </AiShell>
  );
}
