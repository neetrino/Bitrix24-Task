import Link from 'next/link';
import { AiShell } from '@/features/marketing/AiShell';
import { SignInForm } from '@/features/auth/SignInForm';
import { SiteLogoImage } from '@/shared/ui/site-logo';

export default function SignInPage() {
  return (
    <AiShell contentClassName="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div className="w-full max-w-md space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-950/30 px-3 py-1.5 text-xs font-medium text-violet-200/95">
          <SiteLogoImage className="h-3.5 w-auto" heightPx={14} priority />
          Aibonacci.am
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Sign in
        </h1>
        <p className="text-sm leading-relaxed text-neutral-400">
          We will send a one-time link to your inbox. Without Resend in development, the link is
          logged on the server instead.
        </p>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-950/35 to-[#2f2f2f] p-8 shadow-none backdrop-blur-sm">
        <SignInForm />
      </div>
      <Link
        className="text-sm text-neutral-400 underline decoration-white/20 underline-offset-4 transition hover:text-neutral-200"
        href="/"
      >
        Back home
      </Link>
    </AiShell>
  );
}
