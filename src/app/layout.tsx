import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppToaster } from '@/shared/ui/app-toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'PlanRelay',
  description: 'AI-assisted planning with Bitrix24 sync',
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
