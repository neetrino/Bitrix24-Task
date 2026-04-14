import Link from 'next/link';
import { CreateProjectForm } from '@/features/projects/CreateProjectForm';
import { listProjectsForUser } from '@/features/projects/project-queries';
import { requireSessionUserId } from '@/shared/lib/session';

export default async function AppDashboardPage() {
  const userId = await requireSessionUserId();
  const projects = await listProjectsForUser(userId);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-slate-600">Create a project to start planning with AI.</p>
      </div>
      <CreateProjectForm />
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-100">
          {projects.length === 0 ? (
            <li className="px-4 py-6 text-sm text-slate-600">No projects yet.</li>
          ) : (
            projects.map((p) => (
              <li key={p.id}>
                <Link
                  className="flex items-center justify-between px-4 py-4 hover:bg-slate-50"
                  href={`/app/projects/${p.slug}`}
                >
                  <span className="font-medium text-slate-900">{p.name}</span>
                  <span className="text-xs text-slate-500">
                    {p.updatedAt.toISOString().slice(0, 10)}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
