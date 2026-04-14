'use client';

import { Toaster } from 'sonner';
import 'sonner/dist/styles.css';

/** Global toast host: top-right, dark glass to match workspace chrome. */
export function AppToaster() {
  return (
    <Toaster
      closeButton
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        classNames: {
          toast: 'border border-white/10 bg-slate-900/95 backdrop-blur-xl',
        },
      }}
    />
  );
}
