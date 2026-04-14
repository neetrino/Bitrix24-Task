const SLUG_MAX = 120;

export function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base.slice(0, SLUG_MAX) || 'project';
}
