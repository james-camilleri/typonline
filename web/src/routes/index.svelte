<script context="module">
  export async function load({ fetch }) {
    const url = '/api/conversations'
    const response = await fetch(url)

    return {
      status: response.status,
      props: {
        conversations: await response.json(),
      },
    }
  }
</script>

<script lang="ts">
  import Grid from '$lib/components/layout/Grid.svelte'
  import Post from '$lib/components/posts/Post.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'

  export let conversations
</script>

<Grid>
  <div>
    <p>
      Typo is an interactive experience with a vintage typewriter that has a
      life of its own. Animated by hidden robotics and artificial intelligence,
      it writes poetry through a dialogue with its human audience.
    </p>
    {#if conversations.length > 0}
      <p>
        Below are some of the more memorable conversations the typewriter has
        had with its audiences.
      </p>
    {/if}
  </div>
  {#each conversations as conversation, i}
    <Transition order={i}>
      <Post content={conversation} />
    </Transition>
  {/each}
</Grid>
