'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export type ChatMessageLine = {
  id: string;
  role: string;
  content: string;
};

/** Readable column width — matches floating composer below. */
const CHAT_CONTENT_MAX = 'max-w-3xl';

type ProjectChatWorkspaceProps = {
  messages: ChatMessageLine[];
  composer: ReactNode;
};

export function ProjectChatWorkspace({ messages, composer }: ProjectChatWorkspaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col">
      <div
        className="min-h-0 flex-1 overflow-y-auto"
        ref={scrollRef}
      >
        <div className={`mx-auto w-full ${CHAT_CONTENT_MAX} px-4 pb-40 pt-4`}>
          {messages.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              Describe your goal — the assistant will structure tasks and update the plan.
            </p>
          ) : (
            <div className="space-y-10">
              {messages.map((m) =>
                m.role === 'user' ? (
                  <div className="flex justify-end" key={m.id}>
                    <div className="max-w-[min(100%,85%)] rounded-2xl bg-violet-600/30 px-4 py-3 text-sm leading-relaxed text-slate-100">
                      <span className="whitespace-pre-wrap">{m.content}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed text-slate-200" key={m.id}>
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Assistant
                    </span>
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  </div>
                ),
              )}
            </div>
          )}
          <div aria-hidden ref={bottomRef} />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-950 from-50% via-slate-950/90 to-transparent pb-3 pt-16"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4 pt-8">
        <div className={`pointer-events-auto w-full ${CHAT_CONTENT_MAX}`}>{composer}</div>
      </div>
    </div>
  );
}
