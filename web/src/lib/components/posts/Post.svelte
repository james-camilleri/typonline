<script lang="ts">
  import type { Post } from 'src/routes/live/performance/types'
  import Grid from '../layout/Grid.svelte'
  import PageTransition from '../transition/PageTransition.svelte'
  import Message from './Message.svelte'
  import Poem from './Poem.svelte'
  import Seeds from './Seeds.svelte'

  export let content: Post
</script>

<div class="post">
  <Grid columns={2}>
    <div>
      {#each content.conversation as message}
        <Message entity={message.entity} text={message.text} />
      {/each}
    </div>
    <div>
      <Seeds seeds={content.seeds} />
      <Poem poem={content.poem} />
    </div>
  </Grid>
</div>

<style lang="scss">
  .post {
    padding-bottom: var(--lg);
    border-bottom: solid var(--primary) var(--xs);
  }
</style>
