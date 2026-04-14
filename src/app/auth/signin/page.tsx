import Link from 'next/link';
import { SignInForm } from '@/features/auth/SignInForm';

export default function SignInPage() {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          We will email you a magic link. In development, check server logs if Resend is not
          configured.
        </p>
      </div>
      <SignInForm />
      <Link className="text-sm text-slate-600 underline hover:text-slate-900" href="/">
        Back home
      </Link>
    </main>
  );
}
