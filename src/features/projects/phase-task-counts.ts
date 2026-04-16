import type { Phase } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import { DEFAULT_PLAN, parsePlanFromJson, type PlanPayload } from '@/shared/domain/plan';
import { countPlanTasks } from '@/features/projects/plan-tasks-iterate';

export type PhaseTaskCounts = {
  main: number;
  byPhaseId: Record<string, number>;
};

type LatestSnapshotRow = {
  phaseId: string | null;
  payload: unknown;
};

function safePlan(payload: unknown | null | undefined): PlanPayload {
  if (payload == null) return DEFAULT_PLAN;
  try {
    return parsePlanFromJson(payload);
  } catch {
    return DEFAULT_PLAN;
  }
}

/**
 * Latest snapshot per phase (and main) for task count badges in the phase rail.
 *
 * Uses Postgres `DISTINCT ON ("phaseId")` to return exactly one row per phase
 * (plus one for the `NULL` main phase) without streaming the full snapshot
 * history into the Node process.
 */
export async function getPhaseTaskCounts(
  projectId: string,
  phases: Pick<Phase, 'id'>[],
): Promise<PhaseTaskCounts> {
  const rows = await prisma.$queryRaw<LatestSnapshotRow[]>(Prisma.sql`
    SELECT DISTINCT ON ("phaseId") "phaseId", "payload"
    FROM "PlanSnapshot"
    WHERE "projectId" = ${projectId}
    ORDER BY "phaseId", "updatedAt" DESC
  `);

  const mainRow = rows.find((r) => r.phaseId === null);
  const byPhaseRow = new Map<string, LatestSnapshotRow>();
  for (const r of rows) {
    if (r.phaseId !== null) byPhaseRow.set(r.phaseId, r);
  }

  const main = countPlanTasks(safePlan(mainRow?.payload));
  const byPhaseId: Record<string, number> = {};
  for (const p of phases) {
    const row = byPhaseRow.get(p.id);
    byPhaseId[p.id] = countPlanTasks(safePlan(row?.payload));
  }

  return { main, byPhaseId };
}
