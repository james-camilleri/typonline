<script lang="ts">
  import type { State } from '$lib/components/form/StateButton.svelte'

  import Grid from '$lib/components/layout/Grid.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'
  import Input from '$lib/components/form/Input.svelte'
  import StateButton, { STATE } from '$lib/components/form/StateButton.svelte'
  import { browser } from '$app/environment'
  import { COLOUR, setStatusLight } from '../_status-light'
  import { tick } from 'svelte'
  import { fireEvent } from '$lib/connection'

  const RESET_TIMEOUT = 5000

  let state = {
    on: STATE.IDLE,
    off: STATE.IDLE,
  }

  if (browser) {
    setStatusLight(COLOUR.WHITE)
  }

  async function enableBrbMode(enable: boolean) {
    const mode = enable ? 'on' : 'off'

    state = { ...state, [mode]: STATE.WAITING }

    try {
      const response = await fetch('/api/config/brb', {
        method: 'POST',
        body: JSON.stringify({ enable }),
      })

      state = response.ok
        ? { ...state, [mode]: STATE.SUCCESS }
        : { ...state, [mode]: STATE.ERROR }
    } catch (e) {
      state = { ...state, [mode]: STATE.ERROR }
    }

    setTimeout(() => {
      state = { ...state, [mode]: STATE.IDLE }
    }, RESET_TIMEOUT)
  }
</script>

<Grid>
  <div>
    <StateButton
      on:click={() => enableBrbMode(true)}
      state={state.on}
      messages={{
        [STATE.WAITING]: 'Enabling BRB mode.',
        [STATE.ERROR]: 'Boom! Something broke.',
        [STATE.SUCCESS]: 'ALl done.',
      }}>Enable BRB mode</StateButton
    >
    <StateButton
      on:click={() => enableBrbMode(false)}
      state={state.off}
      messages={{
        [STATE.WAITING]: 'Disabling BRB mode.',
        [STATE.ERROR]: 'Boom! Something broke.',
        [STATE.SUCCESS]: 'ALl done.',
      }}>Disable BRB mode</StateButton
    >
  </div>
</Grid>

<style>
  div {
    display: flex;
    gap: var(--gap);
    align-items: flex-start;
  }
</style>
