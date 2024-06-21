<script lang="ts">
  import Grid from '$lib/components/layout/Grid.svelte'
  import Post from '$lib/components/posts/Post.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'

  export let data
</script>

<Grid>
  <div>
    <p>
      Typo is an interactive experience with a vintage typewriter that has a
      life of its own. Animated by hidden robotics and artificial intelligence,
      it writes poetry through a dialogue with its human audience.
    </p>
    <p>
      Check us out on <a href="https://www.instagram.com/typo_digital_2022/"
        >instagram</a
      >, or click through the site to learn more.
    </p>
    <p>
      Typo has been exhibited at the Design for Performance and Interaction show
      at Bloomsbury Theatre in March 2022, the London Festival of Architecture
      2022, TEDx at Goodenough College, the Ars Electronica international arts
      festival in Linz, the PUSH UX Conference in Munich, and the Prague
      Quadrennial of Performance Design and Space. A talk about the project was
      presented at the London Creative Coding meetup in February 2023, a
      recording of which can be seen <a
        target="_blank"
        rel="noopener"
        href="https://www.youtube.com/live/L2U_Sd1qMJ4?feature=share&t=1032"
        >here</a
      >.
    </p>
    {#if data.conversations.length > 0}
      <p>
        These are some of the more memorable conversations the typewriter has
        had with its audiences.
      </p>
    {/if}
  </div>
  {#each data.conversations as conversation, i}
    <Transition order={i}>
      <Post content={conversation} />
    </Transition>
  {/each}
</Grid>
