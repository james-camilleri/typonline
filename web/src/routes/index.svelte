<script context="module">
  export const prerender = true

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
  {#each conversations as conversation, i}
    <Transition order={i}>
      <Post content={conversation} />
    </Transition>
  {/each}
</Grid>
