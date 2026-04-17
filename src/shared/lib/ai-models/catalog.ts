/**
 * Single source of truth for OpenAI chat models the platform can call.
 *
 * `tier` groups models by capability/price band so the router can pick a
 * concrete model from a tier without hardcoding ids.
 *
 * `pricing` is per 1M tokens (USD), used for cost reasoning in router
 * heuristics. Treat as approximate — real billing uses recorded usage.
 */

export type ModelTier = 'nano' | 'mini' | 'standard' | 'reasoning';

export type ModelCapabilities = {
  /** Supports OpenAI `response_format: { type: 'json_object' }`. */
  readonly supportsJsonMode: boolean;
  /** Internal chain-of-thought reasoning models (o-series). */
  readonly isReasoning: boolean;
  /** Approximate input context window in tokens. */
  readonly contextWindow: number;
};

export type ModelPricing = {
  /** USD per 1,000,000 prompt tokens. */
  readonly promptPer1M: number;
  /** USD per 1,000,000 completion tokens. */
  readonly completionPer1M: number;
};

export type ChatModel = {
  readonly id: string;
  readonly label: string;
  readonly tier: ModelTier;
  readonly description: string;
  readonly pricing: ModelPricing;
  readonly capabilities: ModelCapabilities;
  /** When false, hide from the user-facing model picker (legacy/transitional). */
  readonly visibleInPicker: boolean;
};

/**
 * Catalog ordered roughly cheapest → most expensive within each tier.
 * Add new models here; do not duplicate this list elsewhere.
 */
export const CHAT_MODELS: readonly ChatModel[] = [
  // Nano tier — fastest, cheapest, weakest reasoning.
  {
    id: 'gpt-5-nano',
    label: 'GPT-5 nano',
    tier: 'nano',
    description: 'Fastest, cheapest GPT-5 variant',
    pricing: { promptPer1M: 0.05, completionPer1M: 0.4 },
    capabilities: { supportsJsonMode: true, isReasoning: false, contextWindow: 400_000 },
    visibleInPicker: true,
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o mini',
    tier: 'nano',
    description: 'Legacy budget model — kept for compatibility',
    pricing: { promptPer1M: 0.15, completionPer1M: 0.6 },
    capabilities: { supportsJsonMode: true, isReasoning: false, contextWindow: 128_000 },
    visibleInPicker: true,
  },

  // Mini tier — solid quality, still budget-friendly.
  {
    id: 'gpt-5-mini',
    label: 'GPT-5 mini',
    tier: 'mini',
    description: 'Balanced GPT-5 — strong quality at moderate cost',
    pricing: { promptPer1M: 0.25, completionPer1M: 2.0 },
    capabilities: { supportsJsonMode: true, isReasoning: false, contextWindow: 400_000 },
    visibleInPicker: true,
  },
  {
    id: 'gpt-4.1-mini',
    label: 'GPT-4.1 mini',
    tier: 'mini',
    description: 'Legacy mid-tier model',
    pricing: { promptPer1M: 0.4, completionPer1M: 1.6 },
    capabilities: { supportsJsonMode: true, isReasoning: false, contextWindow: 1_000_000 },
    visibleInPicker: true,
  },

  // Standard tier — flagship general-purpose.
  {
    id: 'gpt-5',
    label: 'GPT-5',
    tier: 'standard',
    description: 'Flagship GPT-5 — best general quality',
    pricing: { promptPer1M: 1.25, completionPer1M: 10.0 },
    capabilities: { supportsJsonMode: true, isReasoning: false, contextWindow: 400_000 },
    visibleInPicker: true,
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    tier: 'standard',
    description: 'Legacy strong general model',
    pricing: { promptPer1M: 2.5, completionPer1M: 10.0 },
    capabilities: { supportsJsonMode: true, isReasoning: false, contextWindow: 128_000 },
    visibleInPicker: true,
  },
  {
    id: 'gpt-4.1',
    label: 'GPT-4.1',
    tier: 'standard',
    description: 'Legacy capable model',
    pricing: { promptPer1M: 2.0, completionPer1M: 8.0 },
    capabilities: { supportsJsonMode: true, isReasoning: false, contextWindow: 1_000_000 },
    visibleInPicker: true,
  },

  // Reasoning tier — slow, expensive, for hard decomposition / planning tasks.
  {
    id: 'o4-mini',
    label: 'o4 mini',
    tier: 'reasoning',
    description: 'Reasoning-focused, moderate cost',
    pricing: { promptPer1M: 1.1, completionPer1M: 4.4 },
    capabilities: { supportsJsonMode: true, isReasoning: true, contextWindow: 200_000 },
    visibleInPicker: true,
  },
  {
    id: 'o3-mini',
    label: 'o3-mini',
    tier: 'reasoning',
    description: 'Reasoning — high-cost legacy model',
    pricing: { promptPer1M: 1.1, completionPer1M: 4.4 },
    capabilities: { supportsJsonMode: true, isReasoning: true, contextWindow: 200_000 },
    visibleInPicker: true,
  },
];

const MODEL_BY_ID: ReadonlyMap<string, ChatModel> = new Map(
  CHAT_MODELS.map((m) => [m.id, m]),
);

export function getModelById(id: string): ChatModel | undefined {
  return MODEL_BY_ID.get(id);
}

export function isKnownModelId(id: string): boolean {
  return MODEL_BY_ID.has(id);
}

/** First model of the given tier; used by presets and tier-fallback. */
export function getDefaultModelForTier(tier: ModelTier): ChatModel {
  const match = CHAT_MODELS.find((m) => m.tier === tier);
  if (!match) {
    throw new Error(`No model registered for tier "${tier}"`);
  }
  return match;
}
