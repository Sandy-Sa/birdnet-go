import { describe, it, expect } from 'vitest';
import { Bird, BookOpen } from '@lucide/svelte';
import { getSpeciesLinkIcon } from './speciesLinkIcons';

describe('getSpeciesLinkIcon', () => {
  it('returns a distinct icon for each site', () => {
    expect(getSpeciesLinkIcon('ebird')).toBe(Bird);
    expect(getSpeciesLinkIcon('wikipedia')).toBe(BookOpen);
  });
});
