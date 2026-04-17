/**
 * Strips the `<attachments>…</attachments>\n\n<user_message>…</user_message>`
 * envelope produced by `composeUserMessageWithAttachments` so the chat UI shows
 * only the user-typed text. Attachments themselves are rendered separately as
 * clickable chips next to the message bubble.
 *
 * Falls back to the raw content when the envelope is missing — keeps legacy
 * messages and assistant responses unchanged.
 */
const COMPOSED_USER_MESSAGE_PATTERN =
  /^<attachments>\n[\s\S]*?\n<\/attachments>\n\n<user_message>\n([\s\S]*?)\n<\/user_message>$/;

export function extractDisplayContent(rawContent: string): string {
  const match = rawContent.match(COMPOSED_USER_MESSAGE_PATTERN);
  return match ? match[1] : rawContent;
}
