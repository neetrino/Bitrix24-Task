import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AccessStatus } from '@prisma/client';
import { auth } from '@/auth';
import { signOutAction } from '@/features/auth/auth-actions';

export default async function PendingAccessPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.accessStatus === AccessStatus.ACTIVE) {
    redirect('/app');
  }

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">Access pending</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Your sign-in is saved. An administrator must approve your account before you can use projects
        and planning. You will have full access after your status is set to active in the database.
      </p>
      <p className="mt-4 text-sm text-slate-600">
        Signed in as{' '}
        <span className="font-medium text-slate-800">{session.user.email ?? session.user.id}</span>
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          href="/"
        >
          Home
        </Link>
        <form action={signOutAction}>
          <button
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
