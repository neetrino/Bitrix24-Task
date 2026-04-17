import { WORKSPACE_CHAT_SEND_BTN_CLASS } from '@/shared/ui/workspace-ui';

export function SendOrStopControl({
  pending,
  onStop,
}: {
  pending: boolean;
  onStop: () => void;
}) {
  if (pending) {
    return (
      <button
        aria-label="Stop generation"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 transition hover:bg-white"
        onClick={(e) => {
          e.preventDefault();
          onStop();
        }}
        type="button"
      >
        <svg aria-hidden className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <rect height="14" rx="1" width="14" x="5" y="5" />
        </svg>
      </button>
    );
  }

  return (
    <button
      aria-label="Send message"
      className={`flex h-9 w-9 shrink-0 items-center justify-center ${WORKSPACE_CHAT_SEND_BTN_CLASS}`}
      type="submit"
    >
      <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 19V5m0 0l-7 7m7-7l7 7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

export function AssistantPendingRow({
  pending,
  label = 'Thinking…',
}: {
  pending: boolean;
  label?: string;
}) {
  if (!pending) return null;
  return (
    <div className="text-[15px] leading-relaxed text-neutral-50">
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block h-2 w-2 animate-pulse rounded-full bg-neutral-400"
        />
        {label}
      </span>
    </div>
  );
}

const UPDATE_PLAN_BTN_BASE =
  'flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30';

const UPDATE_PLAN_BTN_IDLE = `${UPDATE_PLAN_BTN_BASE} border border-white/10 bg-transparent text-neutral-400 hover:border-white/20 hover:text-neutral-200`;

const UPDATE_PLAN_BTN_ARMED = `${UPDATE_PLAN_BTN_BASE} border border-violet-500/40 bg-violet-500/10 text-violet-200`;

/**
 * Toggle that arms the next submit to use the planning context profile
 * (server-side this becomes `explicitPlanIntent: true`).
 */
export function UpdatePlanToggle({
  armed,
  onToggle,
}: {
  armed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      aria-label={armed ? 'Update plan armed for next message' : 'Arm update plan for next message'}
      aria-pressed={armed}
      className={armed ? UPDATE_PLAN_BTN_ARMED : UPDATE_PLAN_BTN_IDLE}
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      title="Use planning model for the next message; generates / updates the project plan."
      type="button"
    >
      <svg aria-hidden className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      Update plan
    </button>
  );
}
