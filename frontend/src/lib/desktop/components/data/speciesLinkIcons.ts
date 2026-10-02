import { Bird, BookOpen } from '@lucide/svelte';
import type { SpeciesExternalLinkId } from '$lib/utils/speciesLinks';

/** Lucide icon component type, used for the species external link icons. */
export type SpeciesLinkIcon = typeof Bird;

/**
 * Returns the icon shown beside an external species link. Shared by
 * SpeciesExternalLinks and ActionMenu so a site keeps the same icon everywhere.
 */
export function getSpeciesLinkIcon(id: SpeciesExternalLinkId): SpeciesLinkIcon {
  switch (id) {
    case 'ebird':
      return Bird;
    case 'wikipedia':
      return BookOpen;
  }
}
