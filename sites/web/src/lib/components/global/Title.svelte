<script lang="ts">
  import CONFIG from '$lib/config'

  export let text: string
  export let subtitle: string = null
  export let hidden: boolean = false

  const prefix = CONFIG.GENERAL.siteTitle

  function random(min, max) {
    return Math.random() * (max - min) + min
  }

  let displayTitle = ''
  text.split('').map((letter, i) =>
    setTimeout(() => {
      displayTitle += letter
    }, 100 * i * random(0.8, 1.2)),
  )
</script>

<svelte:head>
  <title>{prefix ? `${prefix} – ` : ''}{text}</title>
</svelte:head>

<h1 class:screen-reader-only={hidden}>{displayTitle}</h1>
{#if subtitle}
  <h2 class:screen-reader-only={hidden}>{subtitle}</h2>
{/if}

<style lang="scss">
  @use '../../../styles/breakpoints';

  h2 {
    // Remove default (large) spacing before subtitle.
    margin-top: 0;
    font-size: var(--lg);
    font-weight: 300;
    text-transform: lowercase;
  }
</style>
