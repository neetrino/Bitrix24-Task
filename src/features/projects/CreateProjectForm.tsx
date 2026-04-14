import { createProject } from '@/features/projects/project-actions';

export function CreateProjectForm() {
  return (
    <form action={createProject} className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm font-medium text-slate-700" htmlFor="name">
        New project
        <input
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          id="name"
          name="name"
          placeholder="Project name"
          required
          type="text"
        />
      </label>
      <button
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        type="submit"
      >
        Create
      </button>
    </form>
  );
}
