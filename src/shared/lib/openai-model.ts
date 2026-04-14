/**
 * Single source of truth for AI chat model: UI labels, validation, and default.
 * Do not duplicate model lists elsewhere.
 */

export const DEFAULT_CHAT_MODEL_ID = 'gpt-4o-mini';

export type OpenAiChatModelOption = {
  readonly id: string;
  readonly label: string;
  /** English hint: cost / capability (approximate; check OpenAI pricing). */
  readonly description: string;
};

/** Curated list for the UI; only these ids can be saved on the project. */
export const OPENAI_CHAT_MODEL_OPTIONS: readonly OpenAiChatModelOption[] = [
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o mini',
    description: 'Default — fastest and most economical',
  },
  {
    id: 'gpt-4.1-mini',
    label: 'GPT-4.1 mini',
    description: 'Solid quality — still budget-friendly',
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    description: 'Strong general model — higher cost',
  },
  {
    id: 'gpt-4.1',
    label: 'GPT-4.1',
    description: 'Very capable — expensive',
  },
  {
    id: 'o4-mini',
    label: 'o4 mini',
    description: 'Reasoning-focused — often costly',
  },
  {
    id: 'o3-mini',
    label: 'o3-mini',
    description: 'Reasoning — can be very expensive',
  },
];

const ALLOWED_IDS = new Set(OPENAI_CHAT_MODEL_OPTIONS.map((o) => o.id));

export function isAllowedChatModelId(id: string): boolean {
  return ALLOWED_IDS.has(id);
}

export function getEffectiveChatModel(project: { openaiChatModel: string | null }): string {
  const o = project.openaiChatModel?.trim();
  if (o && isAllowedChatModelId(o)) return o;
  return DEFAULT_CHAT_MODEL_ID;
}
