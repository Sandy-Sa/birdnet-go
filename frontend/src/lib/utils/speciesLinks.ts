import type { Locale } from '$lib/i18n/config';

/** Base URL of an eBird species account page; the species code is appended. */
const EBIRD_SPECIES_BASE_URL = 'https://ebird.org/species/';

/** Site names shown as link text; brand names, so they are not translated. */
const EBIRD_LINK_LABEL = 'eBird';
const WIKIPEDIA_LINK_LABEL = 'Wikipedia';

/** Wikipedia edition used when no UI locale is given. */
const DEFAULT_WIKIPEDIA_LANGUAGE = 'en';

/**
 * UI locales whose Wikipedia edition lives under a different language code.
 * Norwegian Bokmål is served from no.wikipedia.org; every other supported locale
 * matches its Wikipedia subdomain.
 */
const WIKIPEDIA_LANGUAGE_OVERRIDES: ReadonlyMap<Locale, string> = new Map<Locale, string>([
  ['nb', 'no'],
]);

/**
 * Real eBird species codes are lowercase ASCII letters and digits (`amerob`,
 * `sackin1`). The backend gives species missing from the eBird taxonomy a
 * generated placeholder code with an uppercase prefix (GeneratePlaceholderCode in
 * internal/classifier/taxonomy.go), which eBird does not know, so this rejects it.
 */
const EBIRD_SPECIES_CODE_PATTERN = /^[a-z][a-z0-9]*$/;

/**
 * Returns the eBird species account URL for an eBird species code, or null when
 * the code is missing or is not a real eBird code (an empty code from the v2
 * schema, a non-bird label, or a generated placeholder).
 */
export function getEBirdSpeciesUrl(speciesCode: string | null | undefined): string | null {
  const code = speciesCode?.trim();
  if (!code || !EBIRD_SPECIES_CODE_PATTERN.test(code)) return null;
  return `${EBIRD_SPECIES_BASE_URL}${code}`;
}

/**
 * Returns a Wikipedia URL for a species in the given UI locale's language
 * edition, or null when there is no scientific name. It goes through
 * Special:Search with `go`, which opens the article directly when the scientific
 * name is an article or redirect there and otherwise shows search results, so
 * an edition without that article still lands on a useful page.
 */
export function getWikipediaSpeciesUrl(
  scientificName: string | null | undefined,
  locale?: Locale
): string | null {
  const name = scientificName?.trim();
  if (!name) return null;
  const language = locale
    ? (WIKIPEDIA_LANGUAGE_OVERRIDES.get(locale) ?? locale)
    : DEFAULT_WIKIPEDIA_LANGUAGE;
  const params = new URLSearchParams({ search: name, go: 'Go' });
  return `https://${language}.wikipedia.org/wiki/Special:Search?${params.toString()}`;
}

/** Identifies which external site a species link points to. */
export type SpeciesExternalLinkId = 'ebird' | 'wikipedia';

/** An external reference page for a species. */
export interface SpeciesExternalLink {
  id: SpeciesExternalLinkId;
  /** Site name shown to the user; a brand name, so it is not translated. */
  label: string;
  href: string;
}

/**
 * Returns the external reference links that can be built for a species, in
 * display order (eBird, then Wikipedia). Empty when neither can be built.
 */
export function getSpeciesExternalLinks(
  scientificName: string | null | undefined,
  speciesCode: string | null | undefined,
  locale?: Locale
): SpeciesExternalLink[] {
  const links: SpeciesExternalLink[] = [];
  const eBirdUrl = getEBirdSpeciesUrl(speciesCode);
  if (eBirdUrl) links.push({ id: 'ebird', label: EBIRD_LINK_LABEL, href: eBirdUrl });
  const wikipediaUrl = getWikipediaSpeciesUrl(scientificName, locale);
  if (wikipediaUrl)
    links.push({ id: 'wikipedia', label: WIKIPEDIA_LINK_LABEL, href: wikipediaUrl });
  return links;
}
