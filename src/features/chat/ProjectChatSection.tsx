'use client';

import { useActionState, useEffect, useOptimistic, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { sendChatMessage } from '@/features/chat/chat-actions';

export type ChatMessageLine = {
  id: string;
  role: string;
  content: string;
};

const CHAT_CONTENT_MAX = 'max-w-3xl';

function SendControl({ pending }: { pending: boolean }) {
  return (
    <button
      aria-label="Send message"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 transition hover:bg-white disabled:opacity-50"
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

function AssistantPendingRow({ pending }: { pending: boolean }) {
  if (!pending) return null;
  return (
    <div className="text-sm leading-relaxed text-neutral-400">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
        Assistant
      </span>
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block h-2 w-2 animate-pulse rounded-full bg-neutral-500"
        />
        Updating plan…
      </span>
    </div>
  );
}

function formatModelLabel(id: string): string {
  if (id.length <= 28) return id;
  return `${id.slice(0, 14)}…${id.slice(-10)}`;
}

type ProjectChatSectionProps = {
  initialMessages: ChatMessageLine[];
  projectId: string;
  phaseId: string | null;
  activeModel: string;
};

export function ProjectChatSection({
  initialMessages,
  projectId,
  phaseId,
  activeModel,
}: ProjectChatSectionProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatErrorToastedRef = useRef<string | null>(null);

  const [optimisticMessages, addOptimistic] = useOptimistic(
    initialMessages,
    (state, newMessage: ChatMessageLine) => [...state, newMessage],
  );

  const wrappedAction = async (prev: unknown, formData: FormData) =>
    sendChatMessage(projectId, phaseId, prev, formData);

  const [state, formAction] = useActionState(wrappedAction, undefined);
  const [isPending, startTransition] = useTransition();

  const [draft, setDraft] = useState('');
  const [pastedDraft, setPastedDraft] = useState('');

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [optimisticMessages, state, isPending]);

  useEffect(() => {
    if (!state?.error) {
      chatErrorToastedRef.current = null;
      return;
    }
    if (chatErrorToastedRef.current === state.error) return;
    chatErrorToastedRef.current = state.error;
    toast.error(state.error);
    router.refresh();
  }, [state?.error, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = draft.trim();
    if (!message) return;

    const fd = new FormData();
    fd.set('message', message);
    fd.set('pastedContext', pastedDraft.trim());
    setDraft('');
    setPastedDraft('');
    startTransition(() => {
      addOptimistic({
        id: `optimistic-${crypto.randomUUID()}`,
        role: 'user',
        content: message,
      });
      void formAction(fd);
    });
  };

  return (
    <form
      className="relative flex h-full min-h-0 flex-1 flex-col bg-workspace-canvas"
      onSubmit={handleSubmit}
    >
      <div
        className="scrollbar-workspace-subtle min-h-0 flex-1 overflow-y-auto"
        ref={scrollRef}
      >
        <div className={`mx-auto w-full ${CHAT_CONTENT_MAX} px-5 pb-44 pt-4`}>
          {optimisticMessages.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              Describe your goal — the assistant will structure tasks and update the plan. You can paste
              specs under <span className="text-neutral-400">Optional context</span> so the plan reflects
              your document.
            </p>
          ) : (
            <div className="space-y-10">
              {optimisticMessages.map((m) =>
                m.role === 'user' ? (
                  <div className="flex justify-end" key={m.id}>
                    <div className="max-w-[min(100%,85%)] rounded-3xl bg-neutral-700 px-4 py-3 text-sm leading-relaxed text-neutral-100">
                      <span className="whitespace-pre-wrap">{m.content}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed text-neutral-300" key={m.id}>
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      Assistant
                    </span>
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  </div>
                ),
              )}
              <AssistantPendingRow pending={isPending} />
            </div>
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#212121] via-[#212121]/90 to-transparent pb-2 pt-10"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-5 pt-6">
        <div className={`pointer-events-auto w-full ${CHAT_CONTENT_MAX}`}>
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-end gap-2 rounded-[1.75rem] border border-white/[0.1] bg-workspace-elevated px-3 py-2.5 shadow-none">
              <button
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg leading-none text-neutral-500 transition hover:bg-white/[0.06] hover:text-neutral-300"
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
                className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-snug text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-0"
                id="project-chat-message"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Reply…"
                rows={1}
                value={draft}
              />
              <div className="mb-1 flex shrink-0 items-center gap-2 pl-1">
                <span
                  className="max-w-[6.5rem] truncate text-right text-[10px] text-neutral-500 sm:max-w-[10rem] sm:text-[11px]"
                  title={activeModel}
                >
                  {formatModelLabel(activeModel)}
                </span>
                <SendControl pending={isPending} />
              </div>
            </div>

            <details className="group px-1 text-xs text-neutral-500">
              <summary className="cursor-pointer select-none list-none text-neutral-500 hover:text-neutral-300 [&::-webkit-details-marker]:hidden">
                Optional context
              </summary>
              <label className="sr-only" htmlFor="pastedContext">
                Optional pasted text
              </label>
              <textarea
                className="mt-2 min-h-[64px] w-full rounded-xl border border-white/[0.08] bg-workspace-canvas px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                id="pastedContext"
                onChange={(e) => setPastedDraft(e.target.value)}
                placeholder="Paste specs, doc excerpts, or requirements (optional)"
                rows={3}
                value={pastedDraft}
              />
            </details>
          </div>
        </div>
      </div>
    </form>
  );
}
