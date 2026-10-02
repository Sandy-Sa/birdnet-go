import { describe, it, expect } from 'vitest';
import { getEBirdSpeciesUrl, getWikipediaSpeciesUrl } from './speciesLinks';

describe('getEBirdSpeciesUrl', () => {
  it('builds the species account URL for a real eBird code', () => {
    expect(getEBirdSpeciesUrl('sackin1')).toBe('https://ebird.org/species/sackin1');
    expect(getEBirdSpeciesUrl('amerob')).toBe('https://ebird.org/species/amerob');
  });

  it('trims surrounding whitespace from the code', () => {
    expect(getEBirdSpeciesUrl('  eurbla ')).toBe('https://ebird.org/species/eurbla');
  });

  it('returns null when the code is missing or empty', () => {
    expect(getEBirdSpeciesUrl(undefined)).toBeNull();
    expect(getEBirdSpeciesUrl(null)).toBeNull();
    expect(getEBirdSpeciesUrl('')).toBeNull();
    expect(getEBirdSpeciesUrl('   ')).toBeNull();
  });

  it('returns null for a generated placeholder code', () => {
    // GeneratePlaceholderCode output: uppercase prefix plus a hex hash.
    expect(getEBirdSpeciesUrl('YC3f9a2b')).toBeNull();
    expect(getEBirdSpeciesUrl('XX0a1b2c')).toBeNull();
  });

  it('returns null for a code that would change the URL path or query', () => {
    expect(getEBirdSpeciesUrl('../admin')).toBeNull();
    expect(getEBirdSpeciesUrl('amerob?x=1')).toBeNull();
    expect(getEBirdSpeciesUrl('amerob/extra')).toBeNull();
  });
});

describe('getWikipediaSpeciesUrl', () => {
  it('builds a search-and-go URL on English Wikipedia by default', () => {
    expect(getWikipediaSpeciesUrl('Turdus merula')).toBe(
      'https://en.wikipedia.org/wiki/Special:Search?search=Turdus+merula&go=Go'
    );
  });

  it('uses the language edition of the given locale', () => {
    expect(getWikipediaSpeciesUrl('Turdus merula', 'de')).toBe(
      'https://de.wikipedia.org/wiki/Special:Search?search=Turdus+merula&go=Go'
    );
    expect(getWikipediaSpeciesUrl('Turdus merula', 'fi')).toBe(
      'https://fi.wikipedia.org/wiki/Special:Search?search=Turdus+merula&go=Go'
    );
  });

  it('maps Norwegian Bokmål to the no.wikipedia.org edition', () => {
    expect(getWikipediaSpeciesUrl('Turdus merula', 'nb')).toBe(
      'https://no.wikipedia.org/wiki/Special:Search?search=Turdus+merula&go=Go'
    );
  });

  it('encodes the scientific name as a query value', () => {
    expect(getWikipediaSpeciesUrl('Larus argentatus/smithsonianus & co')).toBe(
      'https://en.wikipedia.org/wiki/Special:Search?search=Larus+argentatus%2Fsmithsonianus+%26+co&go=Go'
    );
  });

  it('returns null when there is no scientific name', () => {
    expect(getWikipediaSpeciesUrl(undefined)).toBeNull();
    expect(getWikipediaSpeciesUrl(null)).toBeNull();
    expect(getWikipediaSpeciesUrl('  ')).toBeNull();
  });
});
