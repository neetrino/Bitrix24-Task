/** Canonical URL for account settings with project + optional phase context. */
export function accountSettingsPath(projectSlug: string, phaseId: string | null): string {
  const q = new URLSearchParams({ project: projectSlug });
  if (phaseId) {
    q.set('phase', phaseId);
  }
  return `/app/account?${q.toString()}`;
}
