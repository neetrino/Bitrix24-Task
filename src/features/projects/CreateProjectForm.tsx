import { createProject } from '@/features/projects/project-actions';
import {
  WORKSPACE_ACCENT_BTN_CLASS,
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_LABEL_CLASS,
  WORKSPACE_PANEL_CLASS,
} from '@/shared/ui/workspace-ui';

export function CreateProjectForm() {
  return (
    <form
      action={createProject}
      className={`flex flex-wrap items-end gap-4 p-5 ${WORKSPACE_PANEL_CLASS}`}
    >
      <label className={`flex min-w-[200px] flex-1 flex-col gap-2 ${WORKSPACE_LABEL_CLASS}`} htmlFor="name">
        New project
        <input
          className={WORKSPACE_FIELD_CLASS}
          id="name"
          name="name"
          placeholder="Project name"
          required
          type="text"
        />
      </label>
      <button className={WORKSPACE_ACCENT_BTN_CLASS} type="submit">
        Create
      </button>
    </form>
  );
}
