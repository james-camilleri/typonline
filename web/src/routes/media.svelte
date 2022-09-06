<script context="module">
  import { get } from '$lib/utils/get'

  export async function load({ fetch }) {
    const images = await get.images(fetch)
    console.log('images', images)

    return {
      props: {
        images,
      },
    }
  }
</script>

<script lang="ts">
  import Grid from '$lib/components/layout/Grid.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'
  import WebImage from '@james-camilleri/sanity-web-image'

  export let images
</script>

<Grid repeat="15rem" gap="var(--md)">
  {#each images as image, i}
    <Transition order={i}>
      <WebImage {image} cropRatio={1} />
    </Transition>
  {/each}
</Grid>
