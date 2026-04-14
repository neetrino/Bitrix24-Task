'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { sendChatMessage } from '@/features/chat/chat-actions';
import {
  WORKSPACE_ACCENT_BTN_CLASS,
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_LABEL_CLASS,
} from '@/shared/ui/workspace-ui';

function SubmitChat() {
  const { pending } = useFormStatus();
  return (
    <button className={WORKSPACE_ACCENT_BTN_CLASS} disabled={pending} type="submit">
      {pending ? 'Sending…' : 'Send'}
    </button>
  );
}

export function ChatPanel({
  projectId,
  phaseId,
  activeModel,
}: {
  projectId: string;
  phaseId: string | null;
  /** Effective model id used for API calls (env or project override). */
  activeModel: string;
}) {
  const [state, formAction] = useActionState(
    sendChatMessage.bind(null, projectId, phaseId),
    undefined,
  );
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <p className="text-xs text-slate-500">
        Model: <span className="font-mono text-slate-300">{activeModel}</span>
      </p>
      <label className={WORKSPACE_LABEL_CLASS} htmlFor="message">
        Message
      </label>
      <textarea
        className={`min-h-[96px] ${WORKSPACE_FIELD_CLASS}`}
        id="message"
        name="message"
        placeholder="Describe goals, constraints, or edits to the plan…"
        required
      />
      <label className={WORKSPACE_LABEL_CLASS} htmlFor="pastedContext">
        Optional: paste file or spec text
      </label>
      <textarea
        className={`min-h-[72px] ${WORKSPACE_FIELD_CLASS}`}
        id="pastedContext"
        name="pastedContext"
        placeholder="Paste supporting text (size limits apply at deployment)"
      />
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      <div className="flex justify-end">
        <SubmitChat />
      </div>
    </form>
  );
}
