import { notFound } from 'next/navigation';
import { ProjectChatSection } from '@/features/chat/ProjectChatSection';
import { PhasePills } from '@/features/phases/PhasePills';
import { PROJECT_TASKS_CHAT_GRID_CLASS } from '@/features/projects/plan-tasks-layout';
import { PlanTasksPanel } from '@/features/projects/PlanTasksPanel';
import { ProjectBitrixSetupPanel } from '@/features/projects/ProjectBitrixSetupPanel';
import { getProjectForUser } from '@/features/projects/project-queries';
import { DEFAULT_PLAN, parsePlanFromJson, type PlanPayload } from '@/shared/domain/plan';
import { getEffectiveChatModel } from '@/shared/lib/openai-model';
import { prisma } from '@/shared/lib/prisma';
import { requireActiveUserId } from '@/shared/lib/session';

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

  const chatLines = messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
  }));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2 overflow-hidden">
      <header className="relative flex min-w-0 shrink-0 flex-col items-center gap-2 sm:min-h-[3.25rem] sm:justify-center sm:gap-0 sm:py-0.5">
        <h1 className="w-full min-w-0 max-w-full truncate text-center text-2xl font-semibold tracking-tight text-white sm:max-w-[min(100%,calc(100%-11rem))] sm:px-2 sm:text-3xl">
          {project.name}
        </h1>
        <div className="flex w-full min-w-0 justify-center sm:absolute sm:inset-y-0 sm:right-0 sm:z-10 sm:w-auto sm:max-w-[min(100%,28rem)] sm:items-center sm:justify-end">
          <PhasePills
            activePhaseId={activePhaseId}
            phases={phases}
            projectId={project.id}
            projectSlug={project.slug}
            showLabel={false}
          />
        </div>
      </header>

      <div className="shrink-0">
        <ProjectBitrixSetupPanel
          activePhaseId={activePhaseId}
          exportMd={exportMd}
          exportYaml={exportYaml}
          layout="edge"
          project={project}
        />
      </div>

      <div className={PROJECT_TASKS_CHAT_GRID_CLASS}>
        <aside className="order-2 flex min-h-0 flex-col overflow-hidden lg:order-1 lg:pl-6">
          <div className="min-h-0 flex-1 overflow-hidden">
            <PlanTasksPanel activePhaseId={activePhaseId} plan={plan} projectId={project.id} />
          </div>
        </aside>

        <section className="order-1 flex min-h-0 flex-1 flex-col lg:order-2 lg:h-full lg:min-h-0 lg:pr-6">
          <ProjectChatSection
            activeModel={effectiveChatModel}
            initialMessages={chatLines}
            phaseId={activePhaseId}
            projectId={project.id}
          />
        </section>
      </div>
    </div>
  );
}
