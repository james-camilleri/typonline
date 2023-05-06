<script lang="ts">
  import { Lightbox } from 'svelte-lightbox'
  import WebImage from '@james-camilleri/sanity-web-image/svelte'

  import Grid from '$lib/components/layout/Grid.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'

  export let data
</script>

<Grid repeat="15rem" gap="var(--md)">
  {#each data.images as image, i}
    <Transition order={i}>
      <Lightbox>
        <WebImage {image} />
      </Lightbox>
    </Transition>
  {/each}
</Grid>

<style lang="scss">
  // Only crop the images to squares for the gallery view.
  :global(.svelte-lightbox-thumbnail > .image-wrapper) {
    aspect-ratio: 1;
  }
</style>
