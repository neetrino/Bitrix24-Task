'use client';

import { Toaster } from 'sonner';
import 'sonner/dist/styles.css';

/** Global toast host: top-right, solid dark surface to match workspace chrome. */
export function AppToaster() {
  return (
    <Toaster
      closeButton
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        classNames: {
          toast: 'border border-slate-700 bg-slate-900',
        },
      }}
    />
  );
}
