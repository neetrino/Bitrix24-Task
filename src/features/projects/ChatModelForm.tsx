import { updateProjectChatModel } from '@/features/projects/chat-model-actions';
import {
  DEFAULT_CHAT_MODEL_ID,
  getEffectiveChatModel,
  OPENAI_CHAT_MODEL_OPTIONS,
} from '@/shared/lib/openai-model';

type ProjectModelFields = {
  id: string;
  openaiChatModel: string | null;
};

export function ChatModelForm({ project }: { project: ProjectModelFields }) {
  const selectId = `openai-chat-model-select-${project.id}`;
  const effective = getEffectiveChatModel(project);

  return (
    <form action={updateProjectChatModel.bind(null, project.id)} className="flex flex-col gap-3">
      <p className="text-sm text-slate-600">
        Choose one model for AI chat on this project. The default recommendation is{' '}
        <strong>{DEFAULT_CHAT_MODEL_ID}</strong> (preselected for new projects).
      </p>
      <label className="text-sm font-medium text-slate-700" htmlFor={selectId}>
        Model
      </label>
      <select
        className="max-w-xl rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          type="submit"
        >
          Save model
        </button>
      </div>
    </form>
  );
}
