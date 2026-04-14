import { updateProjectBitrix } from '@/features/projects/project-actions';
import {
  WORKSPACE_ACCENT_BTN_CLASS,
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_LABEL_CLASS,
} from '@/shared/ui/workspace-ui';

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
        <label className={`flex flex-col gap-1 ${WORKSPACE_LABEL_CLASS}`} htmlFor="bitrixProjectId">
          Bitrix project / group id
          <input
            className={WORKSPACE_FIELD_CLASS}
            defaultValue={project.bitrixProjectId ?? ''}
            id="bitrixProjectId"
            name="bitrixProjectId"
            placeholder="e.g. 425"
            type="text"
          />
        </label>
        <label className={`flex flex-col gap-1 ${WORKSPACE_LABEL_CLASS}`} htmlFor="taskOwnerId">
          Task owner id (CREATED_BY)
          <input
            className={WORKSPACE_FIELD_CLASS}
            defaultValue={project.taskOwnerId ?? ''}
            id="taskOwnerId"
            name="taskOwnerId"
            placeholder="Bitrix user id"
            type="text"
          />
        </label>
        <label className={`flex flex-col gap-1 ${WORKSPACE_LABEL_CLASS}`} htmlFor="taskAssigneeId">
          Task assignee id (RESPONSIBLE_ID)
          <input
            className={WORKSPACE_FIELD_CLASS}
            defaultValue={project.taskAssigneeId ?? ''}
            id="taskAssigneeId"
            name="taskAssigneeId"
            placeholder="Bitrix user id"
            type="text"
          />
        </label>
      </div>
      <div className="flex justify-end">
        <button className={WORKSPACE_ACCENT_BTN_CLASS} type="submit">
          Save Bitrix settings
        </button>
      </div>
    </form>
  );
}
