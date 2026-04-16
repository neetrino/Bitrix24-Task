import Link from 'next/link';
import { AiShell } from '@/features/marketing/AiShell';
import { SiteLogoImage } from '@/shared/ui/site-logo';

export default function VerifyPage() {
  return (
    <AiShell contentClassName="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-6 py-16">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <SiteLogoImage className="h-8 w-auto" heightPx={32} priority />
          <p className="text-xs font-medium uppercase tracking-wider text-violet-300">Aibonacci.am</p>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Check your email</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          We sent a sign-in link from Aibonacci.am. Open it to continue — you will be redirected to
          the app.
        </p>
      </div>
      <Link
        className="text-sm text-slate-400 underline decoration-slate-600 underline-offset-4 transition hover:text-slate-200"
        href="/"
      >
        Back home
      </Link>
    </AiShell>
  );
}
