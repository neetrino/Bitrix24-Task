'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
import { createPhase } from '@/features/phases/phase-actions';
import {
  WORKSPACE_ACCENT_BTN_CLASS,
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_LABEL_CLASS,
} from '@/shared/ui/workspace-ui';

function SubmitPhase({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className={WORKSPACE_ACCENT_BTN_CLASS} disabled={pending} type="submit">
      {pending ? '…' : label}
    </button>
  );
}

export type PhaseCreateFormProps = {
  projectId: string;
  /** Compact row for Phase bar (+ panel). */
  variant?: 'default' | 'inline';
  /** Called after a successful create (e.g. close the + panel). */
  onSuccess?: () => void;
};

export function PhaseCreateForm({ projectId, variant = 'default', onSuccess }: PhaseCreateFormProps) {
  const [state, action] = useActionState(createPhase.bind(null, projectId), undefined);
  const prevStateRef = useRef<typeof state>(undefined);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;
    if (!state) return;
    if ('error' in state && state.error) {
      toast.error(state.error);
      return;
    }
    if ('success' in state && state.success) {
      toast.success('Phase created.');
      onSuccess?.();
    }
  }, [state, onSuccess]);

  if (variant === 'inline') {
    return (
      <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="phase-label-inline">
          Phase name
        </label>
        <input
          className={`min-w-0 flex-1 ${WORKSPACE_FIELD_CLASS}`}
          id="phase-label-inline"
          name="label"
          placeholder="Phase name"
          required
          type="text"
        />
        <SubmitPhase label="Create" />
      </form>
    );
  }

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className={`flex flex-col gap-1 ${WORKSPACE_LABEL_CLASS}`} htmlFor="label">
        New phase
        <input
          className={WORKSPACE_FIELD_CLASS}
          id="label"
          name="label"
          placeholder="Iteration"
          required
          type="text"
        />
      </label>
      <SubmitPhase label="Add phase" />
    </form>
  );
}
