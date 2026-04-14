import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChatPanel } from '@/features/chat/ChatPanel';
import { SyncToolbar } from '@/features/bitrix-sync/SyncToolbar';
import { BitrixSettingsForm } from '@/features/projects/BitrixSettingsForm';
import { getProjectForUser } from '@/features/projects/project-queries';
import { PhaseSection } from '@/features/phases/PhaseSection';
import { PlanEditor } from '@/features/plan-editor/PlanEditor';
import { ChatModelForm } from '@/features/projects/ChatModelForm';
import { DEFAULT_PLAN, parsePlanFromJson, type PlanPayload } from '@/shared/domain/plan';
import { getEffectiveChatModel } from '@/shared/lib/openai-model';
import { prisma } from '@/shared/lib/prisma';
import { requireActiveUserId } from '@/shared/lib/session';
import {
  WORKSPACE_BODY_CLASS,
  WORKSPACE_CODE_CLASS,
  WORKSPACE_GHOST_BTN_CLASS,
  WORKSPACE_H2_CLASS,
  WORKSPACE_INNER_SCROLL_CLASS,
  WORKSPACE_LINK_CLASS,
  WORKSPACE_PANEL_CLASS,
} from '@/shared/ui/workspace-ui';

function resolvePlanPayload(snapshotPayload: unknown | null): PlanPayload {
  if (!snapshotPayload) return DEFAULT_PLAN;
  try {
    return parsePlanFromJson(snapshotPayload);
  } catch {
    return DEFAULT_PLAN;
  }
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ phase?: string }>;
}) {
  const { slug } = await params;
  const { phase: phaseParam } = await searchParams;
  const userId = await requireActiveUserId();
  const project = await getProjectForUser(slug, userId);
  if (!project) {
    notFound();
  }

  const phases = await prisma.phase.findMany({
    where: { projectId: project.id },
    orderBy: { sortOrder: 'asc' },
  });

  let activePhaseId: string | null = null;
  if (phaseParam) {
    const match = phases.find((p) => p.id === phaseParam);
    if (match) {
      activePhaseId = match.id;
    }
  }

  const [messages, snapshot] = await Promise.all([
    prisma.message.findMany({
      where: { projectId: project.id, phaseId: activePhaseId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    }),
    prisma.planSnapshot.findFirst({
      where: { projectId: project.id, phaseId: activePhaseId },
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  const plan = resolvePlanPayload(snapshot?.payload ?? null);

  const effectiveChatModel = getEffectiveChatModel(project);

  const exportMd = activePhaseId
    ? `/api/projects/${project.slug}/export?format=md&phase=${activePhaseId}`
    : `/api/projects/${project.slug}/export?format=md`;
  const exportYaml = activePhaseId
    ? `/api/projects/${project.slug}/export?format=yaml&phase=${activePhaseId}`
    : `/api/projects/${project.slug}/export?format=yaml`;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Link className={WORKSPACE_LINK_CLASS} href="/app">
          ← All projects
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-white">{project.name}</h1>
        <p className={WORKSPACE_BODY_CLASS}>
          Chat refines the plan; export Markdown or YAML anytime. Sync uses server{' '}
          <code className={WORKSPACE_CODE_CLASS}>Webhook_URL</code> plus the Bitrix ids below.
        </p>
      </div>

      <PhaseSection
        activePhaseId={activePhaseId}
        phases={phases}
        projectId={project.id}
        projectSlug={project.slug}
      />

      <section className={`${WORKSPACE_PANEL_CLASS} p-6`}>
        <h2 className={WORKSPACE_H2_CLASS}>AI model</h2>
        <p className={`mt-1 ${WORKSPACE_BODY_CLASS}`}>
          Pick an OpenAI model for this project. Labels describe typical cost vs capability (see OpenAI
          pricing for your account).
        </p>
        <div className="mt-4">
          <ChatModelForm project={project} />
        </div>
      </section>

      <section className={`${WORKSPACE_PANEL_CLASS} p-6`}>
        <h2 className={WORKSPACE_H2_CLASS}>Bitrix settings</h2>
        <p className={`mt-1 ${WORKSPACE_BODY_CLASS}`}>
          Stored per project; webhook stays in deployment secrets.
        </p>
        <div className="mt-4">
          <BitrixSettingsForm project={project} />
        </div>
      </section>

      <section className={`${WORKSPACE_PANEL_CLASS} p-6`}>
        <h2 className={WORKSPACE_H2_CLASS}>Export</h2>
        <p className={`mt-1 ${WORKSPACE_BODY_CLASS}`}>
          Download the latest saved plan for this phase.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a className={WORKSPACE_GHOST_BTN_CLASS} href={exportMd}>
            Download Markdown
          </a>
          <a className={WORKSPACE_GHOST_BTN_CLASS} href={exportYaml}>
            Download YAML
          </a>
        </div>
      </section>

      <section className={`${WORKSPACE_PANEL_CLASS} p-6`}>
        <h2 className={WORKSPACE_H2_CLASS}>Bitrix sync</h2>
        <p className={`mt-1 ${WORKSPACE_BODY_CLASS}`}>
          Dry-run logs intent; real sync creates tasks via the incoming webhook for the active phase
          plan.
        </p>
        <div className="mt-4">
          <SyncToolbar phaseId={activePhaseId} projectId={project.id} />
        </div>
      </section>

      <section className={`${WORKSPACE_PANEL_CLASS} p-6`}>
        <h2 className={WORKSPACE_H2_CLASS}>AI chat</h2>
        <div className="mt-4 flex flex-col gap-4">
          <ul className={WORKSPACE_INNER_SCROLL_CLASS}>
            {messages.length === 0 ? (
              <li className="text-slate-400">No messages yet. Start by describing the initiative.</li>
            ) : (
              messages.map((m) => (
                <li key={m.id}>
                  <span className="font-medium text-violet-200/90">
                    {m.role === 'user' ? 'You' : 'Assistant'}:
                  </span>{' '}
                  <span className="whitespace-pre-wrap text-slate-300">{m.content}</span>
                </li>
              ))
            )}
          </ul>
          <ChatPanel
            activeModel={effectiveChatModel}
            phaseId={activePhaseId}
            projectId={project.id}
          />
        </div>
      </section>

      <section className={`${WORKSPACE_PANEL_CLASS} p-6`}>
        <PlanEditor initialPlan={plan} phaseId={activePhaseId} projectId={project.id} />
      </section>
    </div>
  );
}
