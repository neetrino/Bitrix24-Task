'use client';

import { useActionState, useEffect } from 'react';
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

  useEffect(() => {
    if (state && 'success' in state && state.success) {
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
        {state && 'error' in state ? (
          <p className="w-full text-sm text-red-400">{state.error}</p>
        ) : null}
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
      {state && 'error' in state ? (
        <p className="w-full text-sm text-red-400">{state.error}</p>
      ) : null}
    </form>
  );
}
