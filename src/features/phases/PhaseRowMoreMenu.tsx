'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

const MENU_PANEL_CLASS =
  'absolute right-0 top-full z-[60] mt-1 min-w-[11rem] overflow-hidden rounded-lg border border-white/10 bg-workspace-elevated py-1 shadow-lg shadow-black/40';

const MENU_ITEM_CLASS =
  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-200 transition hover:bg-white/[0.06] focus:bg-white/[0.06] focus:outline-none';

function DotsHorizontalIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="19" cy="12" r="1.75" />
    </svg>
  );
}

function PencilOutlineIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
      <path
        className="stroke-current"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

/**
 * Overflow menu for a phase row (Rename → inline edit for now), shown on row hover.
 */
export function PhaseRowMoreMenu({
  onRename,
  isRowEditing,
}: {
  onRename: () => void;
  isRowEditing: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocDown(e: MouseEvent) {
      if (wrapRef.current?.contains(e.target as Node)) return;
      closeMenu();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu();
    }
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, closeMenu]);

  const dotsVisible =
    menuOpen || isRowEditing
      ? 'opacity-100'
      : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100';

  return (
    <div className="relative shrink-0" ref={wrapRef}>
      <button
        aria-controls={menuOpen ? menuId : undefined}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label="Phase options"
        className={`rounded-md p-1 text-neutral-400 transition hover:bg-white/[0.08] hover:text-neutral-200 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-violet-500/35 ${dotsVisible}`}
        onClick={() => setMenuOpen((v) => !v)}
        type="button"
      >
        <DotsHorizontalIcon className="h-4 w-4" />
      </button>
      {menuOpen ? (
        <ul className={MENU_PANEL_CLASS} id={menuId} role="menu">
          <li role="none">
            <button
              className={MENU_ITEM_CLASS}
              onClick={() => {
                closeMenu();
                onRename();
              }}
              role="menuitem"
              type="button"
            >
              <PencilOutlineIcon className="h-4 w-4 shrink-0 text-neutral-400" />
              Rename
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
