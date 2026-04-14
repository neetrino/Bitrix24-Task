import Link from 'next/link';

export default function VerifyPage() {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">Check your email</h1>
      <p className="text-slate-600">
        We sent you a sign-in link. After clicking it, you will be redirected to the app.
      </p>
      <Link className="text-sm text-slate-600 underline hover:text-slate-900" href="/">
        Back home
      </Link>
    </main>
  );
}
