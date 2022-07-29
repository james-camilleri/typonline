<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async ({ url }) => ({ props: { url } })
</script>

<script lang="ts">
  import '../styles/global.scss'

  import Title from '$lib/components/global/Title.svelte'
  import Footer from '$lib/components/global/Footer.svelte'
  import PageTransition from '$lib/components/transition/PageTransition.svelte'

  import CONFIG from '$lib/config'

  export let url: URL
</script>

<div class="grid">
  <header>
    <Title text={CONFIG.GENERAL.siteTitle} />
  </header>
  <main>
    <PageTransition {url}>
      <slot />
    </PageTransition>
  </main>
  {#if url.pathname.includes('live')}
    <Footer />
  {/if}
</div>

<style lang="scss">
  @use '../styles/breakpoints';

  .grid {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    margin: var(--md) var(--gutter) 0;

    @media (min-width: breakpoints.$md) {
      margin: 0 var(--xxl);
    }
  }
</style>
