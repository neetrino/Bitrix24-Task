'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { sendChatMessage } from '@/features/chat/chat-actions';

function SendControl() {
  const { pending } = useFormStatus();
  return (
    <button
      aria-label="Send message"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-50"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="text-xs">…</span>
      ) : (
        <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 19V5m0 0l-7 7m7-7l7 7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      )}
    </button>
  );
}

function formatModelLabel(id: string): string {
  if (id.length <= 28) return id;
  return `${id.slice(0, 14)}…${id.slice(-10)}`;
}

export function ChatComposer({
  projectId,
  phaseId,
  activeModel,
}: {
  projectId: string;
  phaseId: string | null;
  activeModel: string;
}) {
  const [state, formAction] = useActionState(
    sendChatMessage.bind(null, projectId, phaseId),
    undefined,
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-2">
      <div className="flex w-full items-end gap-2 rounded-[1.75rem] border border-white/12 bg-slate-950/90 px-2 py-2 shadow-[0_12px_48px_-16px_rgba(0,0,0,0.75)] backdrop-blur-xl">
        <button
          className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg leading-none text-slate-500 transition hover:bg-white/10 hover:text-slate-300"
          disabled
          title="Attachments (coming soon)"
          type="button"
        >
          +
        </button>
        <label className="sr-only" htmlFor="project-chat-message">
          Message
        </label>
        <textarea
          className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-snug text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
          id="project-chat-message"
          name="message"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Reply…"
          required
          rows={1}
        />
        <div className="mb-1 flex shrink-0 items-center gap-2 pl-1">
          <span
            className="max-w-[6.5rem] truncate text-right text-[10px] text-slate-500 sm:max-w-[10rem] sm:text-[11px]"
            title={activeModel}
          >
            {formatModelLabel(activeModel)}
          </span>
          <SendControl />
        </div>
      </div>

      <details className="group px-1 text-xs text-slate-500">
        <summary className="cursor-pointer select-none list-none text-violet-300/70 hover:text-violet-200 [&::-webkit-details-marker]:hidden">
          Optional context
        </summary>
        <label className="sr-only" htmlFor="pastedContext">
          Optional pasted text
        </label>
        <textarea
          className="mt-2 min-h-[64px] w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-400/40 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          id="pastedContext"
          name="pastedContext"
          placeholder="Paste specs or notes (optional)"
          rows={3}
        />
      </details>
      {state?.error ? <p className="px-1 text-sm text-red-400">{state.error}</p> : null}
    </form>
  );
}
