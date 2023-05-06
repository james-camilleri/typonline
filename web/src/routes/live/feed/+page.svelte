<script lang="ts">
  import { browser } from '$app/env'

  import { onEvent } from '$lib/connection'

  // enum FeedItemtype {
  //   'letter',
  //   '',
  // }

  let feed: string[] = []
  onEvent('broadcast', (data) => {
    feed = [...feed, data]
  })

  if (browser) {
    window.broadcast = (stuff: any) => {
      fetch('/api/typewriter/broadcast', {
        method: 'POST',
        body: JSON.stringify(stuff),
      })
    }
  }
</script>

<div class="wrapper">
  {#each feed as update}
    <span>{JSON.stringify(update)}</span>
  {/each}
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    margin-top: var(--gutter);
  }
</style>
