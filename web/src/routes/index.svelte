<script context="module">
  export const prerender = true
</script>

<script lang="ts">
  import Title from '$lib/components/global/Title.svelte'
  import Grid from '$lib/components/layout/Grid.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'

  import CONFIG from '$lib/config'
</script>

<Grid>
  <p>(coming soon)</p>
  <Transition order={0} />
</Grid>
