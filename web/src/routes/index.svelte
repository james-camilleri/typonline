<script context="module">
  export const prerender = true
</script>

<script lang="ts">
  import type { State } from '$lib/components/form/StateButton.svelte'

  import Title from '$lib/components/global/Title.svelte'
  import Grid from '$lib/components/layout/Grid.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'
  import Input from '$lib/components/form/Input.svelte'
  import StateButton, { STATE } from '$lib/components/form/StateButton.svelte'

  import CONFIG from '$lib/config'
  const RESET_TIMEOUT = 5000

  let text = ''
  let state: State = STATE.IDLE

  async function submitText() {
    if (text === '') return

    state = STATE.WAITING
    try {
      const response = await fetch('/typewriter/type', {
        method: 'POST',
        body: JSON.stringify({ text }),
      })

      state = response.ok ? STATE.SUCCESS : STATE.ERROR
      if (response.ok) {
        text = ''
      }
    } catch (e) {
      state = STATE.ERROR
    }

    setTimeout(() => {
      state = STATE.IDLE
    }, RESET_TIMEOUT)
  }
</script>

<Title text={CONFIG.GENERAL.siteTitle} />
<Grid>
  <Transition order={0}>
    <p>Use the textbox below to test the automated typewriter.</p>
  </Transition>
  <Transition order={1}>
    <Grid>
      <Input name="text" type="textarea" hideLabel bind:value={text} />
      <StateButton
        on:click={submitText}
        {state}
        messages={{
          [STATE.WAITING]: 'Sending...',
          [STATE.ERROR]: 'Boom! Something broke.',
          [STATE.SUCCESS]: 'Clickety clack!',
        }}>Send</StateButton
      >
    </Grid>
  </Transition>
</Grid>
