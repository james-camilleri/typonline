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
