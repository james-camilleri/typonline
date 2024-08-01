<script lang="ts">
  import { connect } from '$lib/connection'
  import { onMount } from 'svelte'

  onMount(() => {
    connect()
  })
</script>

<slot />
