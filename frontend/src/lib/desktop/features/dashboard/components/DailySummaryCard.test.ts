import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, screen } from '@testing-library/svelte';
import { createComponentTestFactory } from '../../../../../test/render-helpers';
import type { DailySpeciesSummary } from '$lib/types/detection.types';
import DailySummaryCard from './DailySummaryCard.svelte';

function summary(overrides: Partial<DailySpeciesSummary> = {}): DailySpeciesSummary {
  return {
    scientific_name: 'Turdus merula',
    common_name: 'Common Blackbird',
    species_code: 'eurbla',
    count: 3,
    hourly_counts: new Array(24).fill(0),
    high_confidence: true,
    max_confidence: 0.9,
    first_heard: '06:00:00',
    latest_heard: '07:00:00',
    thumbnail_url: '',
    ...overrides,
  };
}

const card = createComponentTestFactory(DailySummaryCard);

function renderCard(data: DailySpeciesSummary[]) {
  return card.render({
    data,
    selectedDate: '2026-10-02',
    showThumbnails: false,
    onPreviousDay: vi.fn(),
    onNextDay: vi.fn(),
    onGoToToday: vi.fn(),
    onDateChange: vi.fn(),
  });
}

describe('DailySummaryCard species external links', () => {
  afterEach(() => {
    cleanup();
  });

  it('links each species row to eBird and Wikipedia', async () => {
    renderCard([summary()]);

    const eBird = await screen.findByRole('link', { name: /View Common Blackbird on eBird/ });
    expect(eBird).toHaveAttribute('href', 'https://ebird.org/species/eurbla');
    expect(eBird).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('link', { name: /View Common Blackbird on Wikipedia/ })
    ).toHaveAttribute(
      'href',
      'https://en.wikipedia.org/wiki/Special:Search?search=Turdus+merula&go=Go'
    );
  });

  it('offers only Wikipedia for a row without an eBird code', async () => {
    renderCard([
      summary({
        scientific_name: 'Yoyetta celis',
        common_name: 'Silver Princess',
        species_code: '',
      }),
    ]);

    expect(
      await screen.findByRole('link', { name: /View Silver Princess on Wikipedia/ })
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /on eBird/ })).not.toBeInTheDocument();
  });
});
