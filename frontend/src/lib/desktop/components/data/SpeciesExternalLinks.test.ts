import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen } from '@testing-library/svelte';
import { getLocale } from '$lib/i18n';
import { renderTyped } from '../../../../test/render-helpers';
import SpeciesExternalLinks from './SpeciesExternalLinks.svelte';

describe('SpeciesExternalLinks', () => {
  const baseProps = {
    scientificName: 'Todiramphus sanctus',
    speciesCode: 'sackin1',
    displayName: 'Sacred Kingfisher',
  };

  const originalGetLocale = vi.mocked(getLocale).getMockImplementation();

  afterEach(() => {
    vi.mocked(getLocale).mockReset();
    if (originalGetLocale) vi.mocked(getLocale).mockImplementation(originalGetLocale);
  });

  it('renders eBird and Wikipedia links that open in a new tab', () => {
    renderTyped(SpeciesExternalLinks, { props: baseProps });

    const eBird = screen.getByRole('link', { name: /eBird/ });
    expect(eBird).toHaveAttribute('href', 'https://ebird.org/species/sackin1');
    expect(eBird).toHaveAttribute('target', '_blank');
    expect(eBird).toHaveAttribute('rel', 'noopener noreferrer');

    const wikipedia = screen.getByRole('link', { name: /Wikipedia/ });
    expect(wikipedia).toHaveAttribute(
      'href',
      'https://en.wikipedia.org/wiki/Special:Search?search=Todiramphus+sanctus&go=Go'
    );
    expect(wikipedia).toHaveAttribute('target', '_blank');
  });

  it('tells screen reader users that each link opens a new tab', () => {
    renderTyped(SpeciesExternalLinks, { props: baseProps });

    expect(screen.getByRole('link', { name: /eBird/ })).toHaveAccessibleName(
      'eBird common.aria.opensInNewTab'
    );
  });

  it('labels the link list with the species group label', () => {
    renderTyped(SpeciesExternalLinks, { props: baseProps });

    expect(
      screen.getByRole('list', { name: 'species.externalLinks.groupLabel' })
    ).toBeInTheDocument();
  });

  it('omits the eBird link when the species has no eBird code', () => {
    renderTyped(SpeciesExternalLinks, {
      props: { ...baseProps, scientificName: 'Yoyetta celis', speciesCode: '' },
    });

    expect(screen.queryByRole('link', { name: /eBird/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Wikipedia/ })).toBeInTheDocument();
  });

  it('omits the eBird link for a generated placeholder code', () => {
    renderTyped(SpeciesExternalLinks, { props: { ...baseProps, speciesCode: 'TS3f9a2b' } });

    expect(screen.queryByRole('link', { name: /eBird/ })).not.toBeInTheDocument();
  });

  it('links to the Wikipedia edition of the UI locale', () => {
    vi.mocked(getLocale).mockReturnValue('nb');

    renderTyped(SpeciesExternalLinks, { props: baseProps });

    expect(screen.getByRole('link', { name: /Wikipedia/ })).toHaveAttribute(
      'href',
      'https://no.wikipedia.org/wiki/Special:Search?search=Todiramphus+sanctus&go=Go'
    );
  });

  it('renders nothing when neither link can be built', () => {
    renderTyped(SpeciesExternalLinks, {
      props: { ...baseProps, scientificName: '', speciesCode: undefined },
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
