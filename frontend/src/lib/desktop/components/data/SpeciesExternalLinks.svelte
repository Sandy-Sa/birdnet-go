<!--
  SpeciesExternalLinks.svelte - Links to a species' eBird and Wikipedia pages

  Purpose: Let the user read more about a species on the two references
  BirdNET-Pi linked to, from any view that shows a single species.

  Features:
  - eBird species account, shown only for a real eBird species code (an empty
    code, a non-bird label or a generated placeholder code renders no eBird link)
  - Wikipedia in the visitor's UI language, searched by scientific name so an
    edition without the article still lands on its search results
  - Renders nothing when neither link can be built

  Props:
  - scientificName: string - Scientific name, used for the Wikipedia link
  - speciesCode?: string | null - eBird species code, used for the eBird link
  - displayName: string - Species name shown to the user, used in the group label
  - className?: string - Additional CSS classes for the list
-->
<script lang="ts">
  import { ExternalLink } from '@lucide/svelte';
  import { getLocale, t } from '$lib/i18n';
  import { cn } from '$lib/utils/cn';
  import { getEBirdSpeciesUrl, getWikipediaSpeciesUrl } from '$lib/utils/speciesLinks';

  // Brand names are the link text and are not translated (static/messages/AGENTS.md).
  const EBIRD_LINK_LABEL = 'eBird';
  const WIKIPEDIA_LINK_LABEL = 'Wikipedia';

  interface Props {
    scientificName: string;
    speciesCode?: string | null;
    displayName: string;
    className?: string;
  }

  let { scientificName, speciesCode, displayName, className = '' }: Props = $props();

  interface SpeciesLink {
    id: string;
    label: string;
    href: string;
  }

  const links = $derived.by(() => {
    const result: SpeciesLink[] = [];
    const eBirdUrl = getEBirdSpeciesUrl(speciesCode);
    if (eBirdUrl) result.push({ id: 'ebird', label: EBIRD_LINK_LABEL, href: eBirdUrl });
    const wikipediaUrl = getWikipediaSpeciesUrl(scientificName, getLocale());
    if (wikipediaUrl) {
      result.push({ id: 'wikipedia', label: WIKIPEDIA_LINK_LABEL, href: wikipediaUrl });
    }
    return result;
  });
</script>

{#if links.length > 0}
  <ul
    class={cn('flex flex-wrap items-center gap-2', className)}
    aria-label={t('species.externalLinks.groupLabel', { species: displayName })}
  >
    {#each links as link (link.id)}
      <li>
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 rounded-full border border-[var(--color-base-300)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-base-content)]/80 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          <ExternalLink class="size-3" aria-hidden="true" />
          {link.label}<span class="sr-only"> {t('common.aria.opensInNewTab')}</span>
        </a>
      </li>
    {/each}
  </ul>
{/if}
