import { updateProjectBitrix } from '@/features/projects/project-actions';

type ProjectBitrixFields = {
  id: string;
  bitrixProjectId: string | null;
  taskOwnerId: string | null;
  taskAssigneeId: string | null;
};

export function BitrixSettingsForm({ project }: { project: ProjectBitrixFields }) {
  return (
    <form action={updateProjectBitrix.bind(null, project.id)} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700" htmlFor="bitrixProjectId">
          Bitrix project / group id
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            defaultValue={project.bitrixProjectId ?? ''}
            id="bitrixProjectId"
            name="bitrixProjectId"
            placeholder="e.g. 425"
            type="text"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700" htmlFor="taskOwnerId">
          Task owner id (CREATED_BY)
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            defaultValue={project.taskOwnerId ?? ''}
            id="taskOwnerId"
            name="taskOwnerId"
            placeholder="Bitrix user id"
            type="text"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700" htmlFor="taskAssigneeId">
          Task assignee id (RESPONSIBLE_ID)
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            defaultValue={project.taskAssigneeId ?? ''}
            id="taskAssigneeId"
            name="taskAssigneeId"
            placeholder="Bitrix user id"
            type="text"
          />
        </label>
      </div>
      <div className="flex justify-end">
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          type="submit"
        >
          Save Bitrix settings
        </button>
      </div>
    </form>
  );
}
