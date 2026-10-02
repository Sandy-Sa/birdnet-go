<!--
  SpeciesExternalLinks.svelte - Links to a species' eBird and Wikipedia pages

  Purpose: Let the user read more about a species on the two references
  BirdNET-Pi linked to, from any view that shows a single species.

  Features:
  - eBird species account, shown only for a real eBird species code (an empty
    code, a non-bird label or a generated placeholder code renders no eBird link)
  - Wikipedia in the visitor's UI language, searched by scientific name so an
    edition without the article still lands on its search results
  - Two variants: labelled pills (`pills`, default) for detail views, and
    compact icon-only buttons (`icons`) for dense rows such as the dashboard
  - Renders nothing when neither link can be built

  Props:
  - scientificName: string - Scientific name, used for the Wikipedia link
  - speciesCode?: string | null - eBird species code, used for the eBird link
  - displayName: string - Species name shown to the user, used in the labels
  - variant?: 'pills' | 'icons' - Visual style (default 'pills')
  - className?: string - Additional CSS classes for the list
-->
<script lang="ts">
  import { ExternalLink } from '@lucide/svelte';
  import { getLocale, t } from '$lib/i18n';
  import { cn } from '$lib/utils/cn';
  import { getSpeciesExternalLinks, type SpeciesExternalLink } from '$lib/utils/speciesLinks';
  import { getSpeciesLinkIcon } from './speciesLinkIcons';

  interface Props {
    scientificName: string;
    speciesCode?: string | null;
    displayName: string;
    variant?: 'pills' | 'icons';
    className?: string;
  }

  let {
    scientificName,
    speciesCode,
    displayName,
    variant = 'pills',
    className = '',
  }: Props = $props();

  const links = $derived(getSpeciesExternalLinks(scientificName, speciesCode, getLocale()));

  // Icon-only links carry the species and site in their accessible name, since
  // a dense list of rows would otherwise read as "eBird, Wikipedia, eBird, ...".
  function iconLinkLabel(link: SpeciesExternalLink): string {
    return t('species.externalLinks.viewSpeciesOn', {
      species: displayName,
      site: link.label,
    });
  }
</script>

{#if links.length > 0}
  <ul
    class={cn('flex items-center', variant === 'icons' ? 'gap-0.5' : 'flex-wrap gap-2', className)}
    aria-label={t('species.externalLinks.groupLabel', { species: displayName })}
  >
    {#each links as link (link.id)}
      <li>
        {#if variant === 'icons'}
          {@const Icon = getSpeciesLinkIcon(link.id)}
          {@const label = iconLinkLabel(link)}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            class="inline-flex size-6 items-center justify-center rounded-md text-[var(--color-base-content)]/60 transition-colors hover:bg-[var(--color-base-300)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary)]"
          >
            <Icon class="size-3.5" aria-hidden="true" />
            <span class="sr-only">{label} {t('common.aria.opensInNewTab')}</span>
          </a>
        {:else}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 rounded-full border border-[var(--color-base-300)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-base-content)]/80 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <ExternalLink class="size-3" aria-hidden="true" />
            {link.label}<span class="sr-only"> {t('common.aria.opensInNewTab')}</span>
          </a>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
