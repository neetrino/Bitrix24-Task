import { AppHeaderAccount } from '@/shared/ui/app-header-account';
import { WorkspaceHomeLogoLink, WorkspaceProjectsNavLink } from '@/shared/ui/workspace-shell-nav';

type WorkspaceShellHeaderProps = {
  accountLabel: string;
};

/**
 * Full-width app bar: logo, Projects, account — used on dashboard and account routes.
 */
export function WorkspaceShellHeader({ accountLabel }: WorkspaceShellHeaderProps) {
  return (
    <header className="shrink-0 w-full border-b border-workspace-hairline bg-workspace-rail">
      <div className="flex w-full min-w-0 items-center justify-between gap-3 py-4 pl-3 pr-6 sm:pl-4 lg:pl-5">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-8">
          <WorkspaceHomeLogoLink priority />
          <WorkspaceProjectsNavLink />
        </div>
        <AppHeaderAccount accountLabel={accountLabel} />
      </div>
    </header>
  );
}
