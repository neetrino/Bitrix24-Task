import {
  getDefaultModelForPreset,
  getModelById,
  getPresetMeta,
  type ModelPreset,
} from '@/shared/lib/ai-models';

/**
 * Composer chip showing the user's current model preset and which model the
 * router is most likely to call. For AUTO the model is decided per-message,
 * so we render only the preset name and a tooltip explaining that.
 */
export function ModelBadge({
  preset,
  pinnedModelId,
}: {
  preset: ModelPreset;
  pinnedModelId: string | null;
}) {
  const meta = getPresetMeta(preset);

  let modelLabel: string | null;
  if (preset === 'AUTO') {
    modelLabel = null;
  } else if (preset === 'PINNED') {
    const m = pinnedModelId ? getModelById(pinnedModelId) : null;
    modelLabel = m?.label ?? pinnedModelId ?? '—';
  } else {
    modelLabel = getDefaultModelForPreset(preset).label;
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-neutral-800/60 px-2 py-[2px] text-[11px] text-neutral-400"
      title={meta.description}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-violet-400/70" />
      <span className="font-medium text-neutral-300">{meta.shortLabel}</span>
      {modelLabel ? <span className="text-neutral-500">· {modelLabel}</span> : null}
    </span>
  );
}
