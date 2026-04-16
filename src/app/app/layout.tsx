import Link from 'next/link';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/shared/lib/session';
import { AiShell } from '@/features/marketing/AiShell';
import { AppHeaderAccount } from '@/shared/ui/app-header-account';
import { SiteLogoImage } from '@/shared/ui/site-logo';
import { WORKSPACE_GHOST_BTN_CLASS } from '@/shared/ui/workspace-ui';

/** Projects nav — same neutral “ghost” language as the workspace rail, not violet accent. */
const PROJECTS_NAV_CLASS = `inline-flex items-center gap-2 ${WORKSPACE_GHOST_BTN_CLASS}`;

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }
  const accountLabel =
    session.user.name?.trim() ||
    session.user.email?.split('@')[0]?.trim() ||
    'Account';

  return (
    <AiShell contentClassName="flex h-dvh min-h-0 flex-col overflow-hidden">
      <header className="shrink-0 w-full border-b border-workspace-hairline bg-workspace-rail">
        {/** Full-bleed row — no mx-auto/max-w so logo stays at the viewport left on ultra-wide screens. */}
        <div className="flex w-full min-w-0 items-center justify-between gap-3 py-4 pl-3 pr-6 sm:pl-4 lg:pl-5">
          <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-8">
            <Link
              className="flex shrink-0 items-center gap-2 font-semibold text-neutral-100"
              href="/app"
            >
              <SiteLogoImage className="h-7 w-auto" heightPx={28} priority />
              Aibonacci
            </Link>
            <Link className={PROJECTS_NAV_CLASS} href="/app">
              <svg aria-hidden className="h-4 w-4 shrink-0 opacity-90" fill="none" viewBox="0 0 24 24">
                <path
                  className="stroke-current"
                  d="M3 7.5V6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v1.5M3 7.5h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                />
              </svg>
              Projects
            </Link>
          </div>
          <AppHeaderAccount accountLabel={accountLabel} />
        </div>
      </header>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">{children}</div>
    </AiShell>
  );
}
