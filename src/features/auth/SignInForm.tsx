'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
import { signInWithEmail } from '@/features/auth/auth-actions';
import { AUTH_PRIMARY_CTA_FORM_CLASS } from '@/shared/ui/auth-cta-classes';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className={AUTH_PRIMARY_CTA_FORM_CLASS} disabled={pending} type="submit">
      {pending ? 'Sending link…' : 'Continue with email'}
    </button>
  );
}

export function SignInForm() {
  const [state, formAction] = useActionState(signInWithEmail, undefined);
  const prevStateRef = useRef<typeof state>(undefined);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-200" htmlFor="email">
        Email
        <input
          className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          id="email"
          name="email"
          placeholder="you@company.com"
          required
          type="email"
          autoComplete="email"
        />
      </label>
      <SubmitButton />
    </form>
  );
}
