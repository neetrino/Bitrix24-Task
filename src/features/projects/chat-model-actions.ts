'use server';

import { revalidatePath } from 'next/cache';
import { logger } from '@/shared/lib/logger';
import { isAllowedChatModelId } from '@/shared/lib/openai-model';
import { prisma } from '@/shared/lib/prisma';
import { requireSessionUserId } from '@/shared/lib/session';

export async function updateProjectChatModel(projectId: string, formData: FormData): Promise<void> {
  const userId = await requireSessionUserId();
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
  });
  if (!project) {
    logger.warn({ projectId }, 'updateProjectChatModel: project not found');
    return;
  }

  const raw = formData.get('openaiChatModel');
  if (typeof raw !== 'string') {
    return;
  }
  const trimmed = raw.trim();
  if (!isAllowedChatModelId(trimmed)) {
    logger.warn({ projectId, trimmed }, 'updateProjectChatModel: model not in allowlist');
    return;
  }
  await prisma.project.update({
    where: { id: projectId },
    data: { openaiChatModel: trimmed },
  });
  revalidatePath(`/app/projects/${project.slug}`);
}
