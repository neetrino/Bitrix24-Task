/**
 * How many messages the chat UI renders on initial page load.
 *
 * With `orderBy: 'desc' + take` the query returns the *newest* N rows, which
 * are then reversed on the server so the client still receives ascending
 * chronological order.
 */
export const CHAT_UI_MESSAGE_LIMIT = 100;

/**
 * How many recent messages are sent to the LLM as conversation context on
 * each chat turn. Kept smaller than the UI limit to cap token usage.
 */
export const CHAT_MODEL_HISTORY_LIMIT = 40;
