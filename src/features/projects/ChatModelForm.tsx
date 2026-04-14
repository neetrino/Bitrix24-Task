import { updateProjectChatModel } from '@/features/projects/chat-model-actions';
import {
  DEFAULT_CHAT_MODEL_ID,
  getEffectiveChatModel,
  OPENAI_CHAT_MODEL_OPTIONS,
} from '@/shared/lib/openai-model';
import {
  WORKSPACE_ACCENT_BTN_CLASS,
  WORKSPACE_BODY_CLASS,
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_LABEL_CLASS,
} from '@/shared/ui/workspace-ui';

type ProjectModelFields = {
  id: string;
  openaiChatModel: string | null;
};

export function ChatModelForm({ project }: { project: ProjectModelFields }) {
  const selectId = `openai-chat-model-select-${project.id}`;
  const effective = getEffectiveChatModel(project);

  return (
    <form action={updateProjectChatModel.bind(null, project.id)} className="flex flex-col gap-3">
      <p className={WORKSPACE_BODY_CLASS}>
        Choose one model for AI chat on this project. The default recommendation is{' '}
        <strong className="text-slate-200">{DEFAULT_CHAT_MODEL_ID}</strong> (preselected for new
        projects).
      </p>
      <label className={WORKSPACE_LABEL_CLASS} htmlFor={selectId}>
        Model
      </label>
      <select
        className={`max-w-xl ${WORKSPACE_FIELD_CLASS}`}
        defaultValue={effective}
        id={selectId}
        name="openaiChatModel"
        required
      >
        {OPENAI_CHAT_MODEL_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label} — {opt.description}
          </option>
        ))}
      </select>
      <div className="flex justify-end">
        <button className={WORKSPACE_ACCENT_BTN_CLASS} type="submit">
          Save model
        </button>
      </div>
    </form>
  );
}
