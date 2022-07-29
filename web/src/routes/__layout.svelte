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
    {#if !url.pathname.includes('live')}
      <nav>
        <ul>
          <li>
            <a href="/">home</a>
          </li>
          <li>
            <a href="/about">about</a>
          </li>
          <li>
            <a href="/feedback">feedback</a>
          </li>
        </ul>
      </nav>
    {/if}
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
    height: 100vh;
    padding: var(--md) var(--gutter) 0;
    overflow-x: hidden;
    overflow-y: auto;

    @media (min-width: breakpoints.$md) {
      margin: 0 var(--xxl);
    }
  }

  main {
    position: relative;
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--md);

    @media (min-width: breakpoints.$sm) {
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: var(--xl);
    }
  }

  nav {
    ul {
      display: flex;
      margin: 0;
      text-align: right;

      @media (min-width: breakpoints.$sm) {
        flex-direction: column;
      }
    }

    li {
      margin: var(--xs);
    }

    a {
      font-weight: bold;
      color: var(--dark);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    a:visited {
      color: var(--dark);
    }

    a:hover {
      color: var(--primary);
    }
  }
</style>
