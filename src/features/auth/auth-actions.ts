'use server';

import { signIn, signOut } from '@/auth';

export async function signInWithEmail(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string } | void> {
  const email = formData.get('email');
  if (typeof email !== 'string' || !email.trim()) {
    return { error: 'Email is required' };
  }
  await signIn('email', { email: email.trim(), redirectTo: '/app' });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: '/' });
}
