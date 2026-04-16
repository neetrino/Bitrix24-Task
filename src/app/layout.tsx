import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppToaster } from '@/shared/ui/app-toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aibonacci',
  description:
    'AI-assisted planning with Bitrix24 sync — each step builds on project history, like Fibonacci terms build on the previous ones.',
  icons: {
    icon: [{ url: '/aibonacci-logo.png', type: 'image/png' }],
    apple: '/aibonacci-logo.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
