'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import type { PlanPayload } from '@/shared/domain/plan-defaults';
import { BITRIX_SYNC_CONFIRM_PORTAL_SELECTOR } from '@/features/bitrix-sync/BitrixSyncConfirmDialog';
import {
  ALL_TASKS_PANEL_DOM_ID,
  TASK_LIST_TOGGLE_SELECTOR,
} from '@/features/projects/plan-tasks-layout';
import {
  ALL_TASKS_PANEL_MAIN_VALUE,
  ALL_TASKS_PANEL_QUERY_KEY,
  deleteAllTasksPanelQuery,
  setAllTasksPanelQuery,
} from '@/features/projects/project-plan-tasks-url';
import { clientLogger } from '@/shared/lib/client-logger';
import { toast } from 'sonner';

function phasesMatch(a: string | null, b: string | null): boolean {
  return a === b;
}

export type PlanTasksEditingTarget = { epicIndex: number; taskIndex: number };

export function usePlanTasksPanelUrlSync({
  activePhaseId,
  projectSlug,
  phaseCacheKey,
  phasePlanCacheRef,
  modalOpen,
  modalPhaseId,
  setModalOpen,
  setModalPlan,
  setModalPhaseId,
  setFetchError,
  setSearch,
  setEditing,
  setPlanLoading,
}: {
  activePhaseId: string | null;
  projectSlug: string;
  phaseCacheKey: (phaseId: string | null) => string;
  phasePlanCacheRef: MutableRefObject<Map<string, PlanPayload>>;
  modalOpen: boolean;
  modalPhaseId: string | null;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalPlan: Dispatch<SetStateAction<PlanPayload | null>>;
  setModalPhaseId: Dispatch<SetStateAction<string | null>>;
  setFetchError: Dispatch<SetStateAction<string | null>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setEditing: Dispatch<SetStateAction<PlanTasksEditingTarget | null>>;
  setPlanLoading: Dispatch<SetStateAction<boolean>>;
}): { closeModal: () => void; openTasksForPhase: (targetPhaseId: string | null) => void } {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const allTasksParam = searchParams.get(ALL_TASKS_PANEL_QUERY_KEY);

  /**
   * Update the URL in place without triggering a Next.js navigation. Using
   * `router.replace` here would cause the underlying RSC page to refetch
   * (auth + DB work) every time the tasks panel opens or closes, even though
   * the page's server props (`phase` search param) are unchanged. Shallow
   * `history.replaceState` preserves shareable/deep-link URLs while keeping
   * `useSearchParams()` in sync (Next.js subscribes to history changes).
   */
  const replaceUrlShallow = useCallback((nextUrl: string) => {
    if (typeof window === 'undefined') return;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, []);

  const closeModalInternal = useCallback(() => {
    setModalOpen(false);
    setModalPlan(null);
    setModalPhaseId(null);
    setFetchError(null);
    setSearch('');
    setEditing(null);
    setPlanLoading(false);
  }, [
    setEditing,
    setFetchError,
    setModalOpen,
    setModalPhaseId,
    setModalPlan,
    setPlanLoading,
    setSearch,
  ]);

  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);

  const closeModal = useCallback(() => {
    closeModalInternal();
    const params = deleteAllTasksPanelQuery(new URLSearchParams(searchParamsString));
    const q = params.toString();
    replaceUrlShallow(q ? `${pathname}?${q}` : pathname);
  }, [closeModalInternal, pathname, replaceUrlShallow, searchParamsString]);

  const loadModalForPhase = useCallback(
    async (targetPhaseId: string | null, signal?: AbortSignal) => {
      setFetchError(null);
      setSearch('');
      setEditing(null);
      setModalPhaseId(targetPhaseId);
      setModalOpen(true);

      const sameAsActive = phasesMatch(targetPhaseId, activePhaseId);
      if (sameAsActive) {
        setModalPlan(null);
        setPlanLoading(false);
        return;
      }

      const cacheKey = phaseCacheKey(targetPhaseId);
      const cached = phasePlanCacheRef.current.get(cacheKey);
      if (cached) {
        setModalPlan(cached);
        setPlanLoading(false);
        return;
      }

      setPlanLoading(true);
      setModalPlan(null);
      try {
        const q = targetPhaseId ? `?phase=${encodeURIComponent(targetPhaseId)}` : '';
        const res = await fetch(`/api/projects/${encodeURIComponent(projectSlug)}/plan${q}`, {
          signal,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const msg = typeof err?.error === 'string' ? err.error : 'Could not load plan';
          throw new Error(msg);
        }
        const data: { plan: PlanPayload } = await res.json();
        if (signal?.aborted) return;
        setModalPlan(data.plan);
        phasePlanCacheRef.current.set(cacheKey, data.plan);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
        clientLogger.error({ err: e }, 'project.plan.fetch');
        const msg = e instanceof Error ? e.message : 'Could not load plan';
        toast.error(msg);
        setFetchError(msg);
      } finally {
        if (!signal?.aborted) {
          setPlanLoading(false);
        }
      }
    },
    [
      activePhaseId,
      phaseCacheKey,
      phasePlanCacheRef,
      projectSlug,
      setEditing,
      setFetchError,
      setModalOpen,
      setModalPhaseId,
      setModalPlan,
      setPlanLoading,
      setSearch,
    ],
  );

  useEffect(() => {
    if (allTasksParam === null || allTasksParam === '') {
      closeModalInternal();
      return;
    }
    const phaseId = allTasksParam === ALL_TASKS_PANEL_MAIN_VALUE ? null : allTasksParam;
    const ac = new AbortController();
    void loadModalForPhase(phaseId, ac.signal);
    return () => ac.abort();
  }, [allTasksParam, closeModalInternal, loadModalForPhase]);

  const openTasksForPhase = useCallback(
    (targetPhaseId: string | null) => {
      if (modalOpen && phasesMatch(modalPhaseId, targetPhaseId)) {
        closeModal();
        return;
      }
      const params = setAllTasksPanelQuery(new URLSearchParams(searchParamsString), targetPhaseId);
      replaceUrlShallow(`${pathname}?${params.toString()}`);
      // `useSearchParams()` does not reliably re-render after `history.replaceState`
      // (Next 15 + Turbopack), so the URL effect below may not fire. Open the panel
      // imperatively to guarantee a response; the effect still covers deep-links
      // and browser back/forward.
      void loadModalForPhase(targetPhaseId);
    },
    [
      closeModal,
      loadModalForPhase,
      modalOpen,
      modalPhaseId,
      pathname,
      replaceUrlShallow,
      searchParamsString,
    ],
  );

  useEffect(() => {
    if (!modalOpen) return;
    const onPointerDownCapture = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      const panel = document.getElementById(ALL_TASKS_PANEL_DOM_ID);
      if (panel?.contains(target)) return;
      if (target instanceof Element && target.closest(TASK_LIST_TOGGLE_SELECTOR)) return;
      if (target instanceof Element && target.closest(BITRIX_SYNC_CONFIRM_PORTAL_SELECTOR)) return;
      closeModal();
    };
    document.addEventListener('pointerdown', onPointerDownCapture, true);
    return () => document.removeEventListener('pointerdown', onPointerDownCapture, true);
  }, [closeModal, modalOpen]);

  return useMemo(() => ({ closeModal, openTasksForPhase }), [closeModal, openTasksForPhase]);
}
