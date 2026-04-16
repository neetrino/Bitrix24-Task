const BRAND_NAME = 'Aibonacci.am';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * HTML + plain text for Auth.js magic-link email (Resend).
 * Email clients require inline CSS; this is not app UI.
 */
export function buildMagicLinkEmailContent(magicLinkUrl: string): {
  subject: string;
  html: string;
  text: string;
} {
  const safeUrl = escapeHtml(magicLinkUrl);
  const subject = `Sign in to ${BRAND_NAME}`;
  const text = [
    `Sign in to ${BRAND_NAME}`,
    '',
    'Use the link below to open your workspace. It expires after a short time.',
    '',
    magicLinkUrl,
    '',
    'If you did not request this email, you can ignore it.',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#e8e8ec;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#e8e8ec;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:400px;background:linear-gradient(160deg,#1e1e26 0%,#18181c 100%);border:1px solid rgba(255,255,255,0.08);border-radius:14px;box-shadow:0 16px 40px rgba(15,15,20,0.12);">
          <tr>
            <td style="padding:22px 22px 6px 22px;">
              <p style="margin:0;font-size:13px;font-weight:600;color:#ddd6fe;">
                ${escapeHtml(BRAND_NAME)}
              </p>
              <h1 style="margin:10px 0 0 0;font-size:20px;font-weight:600;line-height:1.3;color:#fafafa;">
                Your sign-in link
              </h1>
              <p style="margin:10px 0 0 0;font-size:14px;line-height:1.5;color:#a3a3a8;">
                Tap the button below. The link works once and expires shortly.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 22px 20px 22px;">
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0;">
                <tr>
                  <td style="border-radius:11px;background:linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#d946ef 100%);box-shadow:0 8px 24px rgba(124,58,237,0.28);">
                    <a href="${safeUrl}" style="display:inline-block;padding:13px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:11px;">
                      Sign in to ${escapeHtml(BRAND_NAME)}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0 0;font-size:11px;line-height:1.45;color:#71717a;">
                Didn’t request this? You can ignore this email.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:14px 0 0 0;font-size:11px;line-height:1.4;color:#71717a;">
          ${escapeHtml(BRAND_NAME)} · AI-assisted planning &amp; tasks
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
