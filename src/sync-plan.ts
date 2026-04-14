import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import { parse as parseYaml } from 'yaml';
import { loadEnvFromProcess } from '@/server/bitrix/env';
import { parsePlan } from '@/server/bitrix/parse-plan';
import { runSyncPlan } from '@/server/bitrix/sync';
import { logger } from '@/shared/lib/logger';

config();

function parseArgs(argv: string[]): { planPath: string; dryRun: boolean } {
  const rest = argv.slice(2).filter((a) => a !== '--');
  const dryRun = rest.includes('--dry-run');
  const pathArg = rest.find((a) => !a.startsWith('--'));
  if (!pathArg) {
    throw new Error('Usage: pnpm run sync -- <path-to-plan.yaml> [--dry-run]');
  }
  return { planPath: resolve(pathArg), dryRun };
}

async function main(): Promise<void> {
  const { planPath, dryRun } = parseArgs(process.argv);
  const raw = readFileSync(planPath, 'utf8');
  const plan = parsePlan(parseYaml(raw));
  const env = loadEnvFromProcess();

  logger.info(
    {
      title: plan.project_title ?? planPath,
      mode: plan.epic_mode,
      groupId: env.groupId,
      dryRun,
      owner: env.taskOwnerId,
      assignee: env.taskAssigneeId,
      yamlAssigneeOverride: plan.responsible_id,
    },
    'Sync plan',
  );

  await runSyncPlan(plan, env, dryRun);
}

main().catch((err: unknown) => {
  logger.error(err instanceof Error ? err : { err }, 'sync-plan failed');
  process.exit(1);
});
