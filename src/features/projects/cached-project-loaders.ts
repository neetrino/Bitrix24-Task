import { unstable_cache } from 'next/cache';
import type { Phase } from '@prisma/client';
import { CHAT_UI_MESSAGE_LIMIT } from '@/features/chat/chat-limits';
import { getPhaseTaskCounts } from '@/features/projects/phase-task-counts';
import { prisma } from '@/shared/lib/prisma';
import { projectDataTag } from '@/shared/lib/project-cache-tags';

/**
 * Module-level query helpers. Keeping the Prisma calls out of the
 * `unstable_cache` closures lets V8 reuse the compiled function object
 * across requests — only the thin cache wrapper is re-created to carry
 * the per-project invalidation tag.
 */

async function fetchLatestPlanSnapshot(projectId: string, phaseId: string | null) {
  return prisma.planSnapshot.findFirst({
    where: { projectId, phaseId },
    orderBy: { updatedAt: 'desc' },
  });
}

async function fetchLatestPhaseMessages(projectId: string, phaseId: string | null) {
  // Take the *newest* N rows via desc+take and reverse so callers still
  // receive ascending chronological order. Fetching asc + take would
  // silently drop the most recent messages when history exceeds the limit.
  const rows = await prisma.message.findMany({
    where: { projectId, phaseId },
    orderBy: { createdAt: 'desc' },
    take: CHAT_UI_MESSAGE_LIMIT,
    include: {
      attachments: {
        select: { id: true, filename: true, format: true, sizeBytes: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  return rows.reverse();
}

export async function getCachedPlanSnapshot(projectId: string, phaseId: string | null) {
  const run = unstable_cache(
    () => fetchLatestPlanSnapshot(projectId, phaseId),
    ['plan-snapshot', projectId, phaseId ?? 'main'],
    { tags: [projectDataTag(projectId)] },
  );
  return run();
}

export async function getCachedPhaseMessages(projectId: string, phaseId: string | null) {
  const run = unstable_cache(
    () => fetchLatestPhaseMessages(projectId, phaseId),
    ['phase-messages', projectId, phaseId ?? 'main', String(CHAT_UI_MESSAGE_LIMIT)],
    { tags: [projectDataTag(projectId)] },
  );
  return run();
}

export async function getCachedPhaseTaskCounts(projectId: string, phases: Pick<Phase, 'id'>[]) {
  const phaseKey = [...phases.map((p) => p.id)].sort().join(',');
  const run = unstable_cache(
    () => getPhaseTaskCounts(projectId, phases),
    ['phase-task-counts', projectId, phaseKey],
    { tags: [projectDataTag(projectId)] },
  );
  return run();
}
