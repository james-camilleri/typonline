<script lang="ts">
  import Heartbeat from './Heartbeat.svelte'
</script>

<footer>
  <Heartbeat />

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
      padding: var(--md) 0;
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
