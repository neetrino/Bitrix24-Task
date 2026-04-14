import Link from 'next/link';
import { CreateProjectForm } from '@/features/projects/CreateProjectForm';
import { listProjectsForUser } from '@/features/projects/project-queries';
import { requireActiveUserId } from '@/shared/lib/session';
import { SparklesGlyph } from '@/shared/ui/brand-icons';
import { WORKSPACE_BODY_CLASS, WORKSPACE_PANEL_CLASS } from '@/shared/ui/workspace-ui';

export default async function AppDashboardPage() {
  const userId = await requireActiveUserId();
  const projects = await listProjectsForUser(userId);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200/95 backdrop-blur-sm">
          <SparklesGlyph className="h-3.5 w-3.5 text-cyan-300" />
          Workspace
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your{' '}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent">
              projects
            </span>
          </h1>
          <p className={`max-w-2xl ${WORKSPACE_BODY_CLASS} text-base leading-relaxed`}>
            Create a project to plan with AI, manage phases, and export or sync to Bitrix24 when you are
            ready.
          </p>
        </div>
      </section>

      <CreateProjectForm />

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-[1.25rem] bg-gradient-to-br from-violet-500/15 via-transparent to-cyan-500/10 blur-2xl"
        />
        <div className={`relative overflow-hidden ${WORKSPACE_PANEL_CLASS}`}>
          <div className="border-b border-white/10 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-5 py-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-violet-200/90">
              <SparklesGlyph className="h-4 w-4 text-cyan-300" />
              All projects
            </div>
            <p className="mt-1 text-sm text-slate-400">Open a project to continue planning.</p>
          </div>
          <ul className="divide-y divide-white/5">
            {projects.length === 0 ? (
              <li className="px-5 py-8 text-sm text-slate-400">No projects yet — add one above.</li>
            ) : (
              projects.map((p) => (
                <li key={p.id}>
                  <Link
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.04]"
                    href={`/app/projects/${p.slug}`}
                  >
                    <span className="font-medium text-slate-100">{p.name}</span>
                    <span className="shrink-0 text-xs tabular-nums text-slate-500">
                      {p.updatedAt.toISOString().slice(0, 10)}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
