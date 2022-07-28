<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async ({ url }) => ({ props: { url } })
</script>

<script lang="ts">
  import '../styles/global.scss'

  import Footer from '$lib/components/global/Footer.svelte'
  import PageTransition from '$lib/components/transition/PageTransition.svelte'

  export let url: URL
</script>

<div class="grid">
  <main>
    <PageTransition {url}>
      <slot />
    </PageTransition>
  </main>
  <Footer />
</div>

<style lang="scss">
  @use '../styles/breakpoints';

  .grid {
    display: grid;
    grid-template-rows: 1fr auto;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  main {
    position: relative;
    margin: var(--md) var(--gutter) 0;

    @media (min-width: breakpoints.$md) {
      margin: 0 var(--xxl);
    }
  }
</style>
