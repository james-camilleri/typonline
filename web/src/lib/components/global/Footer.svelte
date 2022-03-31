<script lang="ts">
  import Facebook from '@fortawesome/fontawesome-free/svgs/brands/facebook.svg'
  import Github from '@fortawesome/fontawesome-free/svgs/brands/github.svg'
  import Instagram from '@fortawesome/fontawesome-free/svgs/brands/instagram.svg'
  import Twitter from '@fortawesome/fontawesome-free/svgs/brands/twitter.svg'
  import YouTube from '@fortawesome/fontawesome-free/svgs/brands/youtube.svg'

  import Heartbeat from './Heartbeat.svelte'
  import CONFIG from '$lib/config'

  const links = [
    // {
    //   text: 'home',
    //   link: '/',
    // },
    // {
    //   text: 'external link',
    //   link: 'https://james.mt',
    // },
  ]

  const social = {
    // facebook: { icon: Facebook, link: 'https://www.facebook.com/' },
    // instagram: { icon: Instagram, link: 'https://www.instagram.com/' },
    // twitter: { icon: Twitter, link: 'https://www.twitter.com/' },
    // youtube: { icon: YouTube, link: 'https://www.youtube.com/' },
    // github: { icon: Github, link: 'https://www.github.com/' },
  }
</script>

<footer>
  <Heartbeat />

  {#if Object.entries(social).length > 0}
    <div class="icons">
      {#each Object.entries(social) as [name, { icon, link }]}
        <a href={link} rel="noopener" target="_blank">
          <svelte:component this={icon} />
          <span class="screen-reader-only">{name}</span>
        </a>
      {/each}
    </div>
  {/if}

  <span class="copyright">&copy; Evina & James, {new Date().getFullYear()}</span
  >
</footer>

<style lang="scss">
  @use '../../../styles/breakpoints';

  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--md) var(--lg);
    margin-top: var(--gutter);
    background: var(--background);
    > * {
      // Vertical spacing for mobile view.
      margin: var(--sm) 0;
    }

    @media (min-width: breakpoints.$md) {
      padding: var(--md) var(--xxl);
    }
  }

  a {
    margin: 0 var(--xs);
  }

  .icons {
    display: flex;

    // Only centre-align the icons if they
    // aren't the first items in the footer.
    &:not(:first-child) {
      justify-content: center;
    }
  }

  .icons a {
    height: var(--xl);
    color: var(--foreground);
    transition: color var(--transition-fast) ease-in-out;

    &:hover,
    &:focus {
      color: var(--primary);
      background: none;
    }
  }

  // Horizontal desktop layout.
  @media (min-width: breakpoints.$sm) {
    footer {
      flex-direction: row;
      justify-content: space-between;

      > * {
        flex: 1 0 33%;
      }
    }

    .copyright {
      text-align: end;
    }
  }
</style>
