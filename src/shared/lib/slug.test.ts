import { describe, expect, it } from 'vitest';
import { slugify } from '@/shared/lib/slug';

describe('slugify', () => {
  it('normalizes spaces and case', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('falls back when empty', () => {
    expect(slugify('!!!')).toBe('project');
  });
});
