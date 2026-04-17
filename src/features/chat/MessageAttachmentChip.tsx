'use client';

import type { AttachmentFormat } from '@/features/attachments/attachment-rules';

const FORMAT_BADGE: Record<AttachmentFormat, string> = {
  md: 'MD',
  txt: 'TXT',
  json: 'JSON',
  yaml: 'YAML',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export type MessageAttachmentMeta = {
  id: string;
  filename: string;
  format: AttachmentFormat;
  sizeBytes: number;
};

/**
 * Read-only chip used to display attachments that were already sent in a chat
 * message. Mirrors the look of the composer's `AttachmentChip` but renders as
 * an anchor that opens the file via the project attachment content endpoint.
 */
export function MessageAttachmentChip({
  attachment,
  projectSlug,
}: {
  attachment: MessageAttachmentMeta;
  projectSlug: string;
}) {
  const href = `/api/projects/${encodeURIComponent(projectSlug)}/attachments/${encodeURIComponent(attachment.id)}/content`;
  return (
    <a
      className="group inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-neutral-900/60 px-2.5 py-1 text-xs text-neutral-200 transition hover:border-white/[0.16] hover:bg-neutral-800/70"
      href={href}
      rel="noreferrer"
      target="_blank"
      title={attachment.filename}
    >
      <span
        aria-hidden
        className="inline-flex h-4 items-center justify-center rounded bg-white/[0.08] px-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-300"
      >
        {FORMAT_BADGE[attachment.format]}
      </span>
      <span className="max-w-[14rem] truncate">{attachment.filename}</span>
      <span className="text-neutral-500">{formatSize(attachment.sizeBytes)}</span>
    </a>
  );
}
