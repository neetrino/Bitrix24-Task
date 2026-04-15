import type { ReactNode } from 'react';

type AiShellProps = {
  children: ReactNode;
  /** Tailwind classes for the inner content wrapper (z-index above backdrop). */
  contentClassName: string;
};

export function AiShell({ children, contentClassName }: AiShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-workspace-canvas text-neutral-200 antialiased">
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
}
