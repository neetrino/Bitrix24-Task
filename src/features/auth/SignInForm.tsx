'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
import { signInWithEmail } from '@/features/auth/auth-actions';
import { AUTH_MAGIC_LINK_SUBMIT_CLASS } from '@/shared/ui/auth-cta-classes';
import { ArrowRightGlyph } from '@/shared/ui/brand-icons';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className={AUTH_MAGIC_LINK_SUBMIT_CLASS} disabled={pending} type="submit">
      {pending ? (
        'Sending link…'
      ) : (
        <>
          Email me a sign-in link
          <ArrowRightGlyph className="h-5 w-5 shrink-0 text-white/90" />
        </>
      )}
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
    <form action={formAction} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="sr-only" htmlFor="email">
          Work email
        </label>
        <input
          className="w-full rounded-xl border border-white/[0.12] bg-black/30 px-4 py-3.5 text-[15px] text-neutral-100 placeholder:text-neutral-500 backdrop-blur-sm transition focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/25"
          id="email"
          name="email"
          placeholder="you@company.com"
          required
          type="email"
          autoComplete="email"
          inputMode="email"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
