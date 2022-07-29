<script lang="ts">
  import type { Post } from 'src/routes/live/performance/types'
  import PageTransition from '../transition/PageTransition.svelte'
  import Message from './Message.svelte'
  import Poem from './Poem.svelte'
  import Seeds from './Seeds.svelte'

  export let content: Post
</script>

<div>
  {#each content.conversation as message}
    <Message entity={message.entity} text={message.text} />
  {/each}
  <Seeds seeds={content.seeds} />
  <Poem poem={content.poem} />
</div>

<style lang="scss">
  div {
    max-width: 30em;
  }
</style>
