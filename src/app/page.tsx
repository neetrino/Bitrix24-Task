import Link from 'next/link';
import { auth } from '@/auth';

export default async function HomePage() {
  const session = await auth();
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">PlanRelay</h1>
        <p className="mt-2 text-slate-600">
          Collaborative AI-assisted planning, Markdown export, and Bitrix24 sync.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {session?.user ? (
          <Link
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            href="/app"
          >
            Open app
          </Link>
        ) : (
          <Link
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            href="/auth/signin"
          >
            Sign in
          </Link>
        )}
        <a
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          href="https://github.com/neetrino/Bitrix24-Task"
          rel="noreferrer"
          target="_blank"
        >
          Repository
        </a>
      </div>
    </main>
  );
}
