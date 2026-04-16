import { PROJECT_TASKS_CHAT_GRID_CLASS } from '@/features/projects/plan-tasks-layout';

/**
 * Streaming skeleton for the project workspace. Lets Next render the chrome
 * (header, nav, shell) immediately while the server component fetches
 * session, project, phases, messages, and plan snapshot in parallel.
 */
export default function ProjectPageLoading() {
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className={PROJECT_TASKS_CHAT_GRID_CLASS}>
        <aside className="order-2 flex min-h-0 flex-1 flex-col overflow-hidden bg-workspace-rail lg:order-1 lg:border-r lg:border-workspace-hairline lg:px-5">
          <div className="flex flex-col gap-3 px-2 py-4">
            <div className="h-5 w-40 animate-pulse rounded bg-white/[0.08]" />
            <div className="h-4 w-24 animate-pulse rounded bg-white/[0.05]" />
          </div>
          <nav className="flex flex-col gap-2 px-2 py-3" aria-hidden>
            <div className="h-10 animate-pulse rounded-xl bg-white/[0.04]" />
            <div className="h-10 animate-pulse rounded-xl bg-white/[0.04]" />
            <div className="h-10 animate-pulse rounded-xl bg-white/[0.04]" />
          </nav>
        </aside>

        <section className="order-1 flex min-h-0 flex-1 flex-col lg:order-2 lg:h-full lg:min-h-0 lg:pr-6">
          <div className="flex flex-1 flex-col items-center justify-center px-5 pt-6">
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/[0.08]" />
          </div>
        </section>
      </div>
    </div>
  );
}
