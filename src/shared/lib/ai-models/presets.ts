/**
 * Model presets shown to the user. The user picks a preset (Auto / Economy /
 * Balanced / Quality) or pins a specific model id; the router resolves the
 * preset to a concrete model per turn.
 */

import { type ChatModel, getDefaultModelForTier, type ModelTier } from './catalog';

export type ModelPreset = 'AUTO' | 'ECONOMY' | 'BALANCED' | 'QUALITY' | 'PINNED';

export type PresetMeta = {
  readonly id: ModelPreset;
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
  /** Default tier this preset resolves to (Auto is overridden by the router). */
  readonly defaultTier: ModelTier;
};

export const MODEL_PRESETS: readonly PresetMeta[] = [
  {
    id: 'AUTO',
    label: 'Auto',
    shortLabel: 'Auto',
    description: 'Platform picks the right model for each request',
    defaultTier: 'mini',
  },
  {
    id: 'ECONOMY',
    label: 'Economy',
    shortLabel: 'Economy',
    description: 'Cheapest models — fast and minimal cost',
    defaultTier: 'nano',
  },
  {
    id: 'BALANCED',
    label: 'Balanced',
    shortLabel: 'Balanced',
    description: 'Mid-tier quality at moderate cost',
    defaultTier: 'mini',
  },
  {
    id: 'QUALITY',
    label: 'Quality',
    shortLabel: 'Quality',
    description: 'Flagship models — best results, higher cost',
    defaultTier: 'standard',
  },
  {
    id: 'PINNED',
    label: 'Pinned model',
    shortLabel: 'Pinned',
    description: 'Always use one specific model you chose',
    defaultTier: 'mini',
  },
];

const PRESET_BY_ID: ReadonlyMap<ModelPreset, PresetMeta> = new Map(
  MODEL_PRESETS.map((p) => [p.id, p]),
);

export const DEFAULT_PRESET: ModelPreset = 'AUTO';

export function getPresetMeta(id: ModelPreset): PresetMeta {
  const meta = PRESET_BY_ID.get(id);
  if (!meta) {
    throw new Error(`Unknown preset "${id}"`);
  }
  return meta;
}

export function isModelPreset(value: string): value is ModelPreset {
  return PRESET_BY_ID.has(value as ModelPreset);
}

/**
 * Default model for a non-Auto preset, used when the router has no extra
 * signals (or Auto downgrades to a specific tier under budget pressure).
 */
export function getDefaultModelForPreset(preset: ModelPreset): ChatModel {
  return getDefaultModelForTier(getPresetMeta(preset).defaultTier);
}
