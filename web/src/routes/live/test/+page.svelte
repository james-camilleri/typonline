

<script lang="ts">
  import type { State } from '$lib/components/form/StateButton.svelte'

  import Grid from '$lib/components/layout/Grid.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'
  import Input from '$lib/components/form/Input.svelte'
  import StateButton, { STATE } from '$lib/components/form/StateButton.svelte'
  import { browser } from '$app/env'
  import { COLOUR, setStatusLight } from '../_status-light'
  import { fireEvent } from '$lib/connection'

  const RESET_TIMEOUT = 5000

  let text = ''
  let eventName = ''
  let eventBody = ''
  let textState: State = STATE.IDLE
  let eventState: State = STATE.IDLE

  if (browser) {
    setStatusLight(COLOUR.WHITE)
  }

  async function submitText() {
    if (text === '') return

    textState = STATE.WAITING
    try {
      const response = await fetch('/api/typewriter/type', {
        method: 'POST',
        body: JSON.stringify({ text }),
      })

      textState = response.ok ? STATE.SUCCESS : STATE.ERROR
      if (response.ok) {
        text = ''
      }
    } catch (e) {
      textState = STATE.ERROR
    }

    setTimeout(() => {
      textState = STATE.IDLE
    }, RESET_TIMEOUT)
  }

  async function submitEvent() {
    if (eventName === '') return

    eventState = STATE.WAITING
    try {
      await fireEvent({
        type: eventName,
        data: JSON.parse(eventBody),
      })

      eventState = STATE.SUCCESS
    } catch (e) {
      console.error(e)
      eventState = STATE.ERROR
    }

    setTimeout(() => {
      eventState = STATE.IDLE
    }, RESET_TIMEOUT)
  }
</script>

<Grid>
  <Transition order={0}>
    <Grid columns={2}>
      <div>
        <Grid>
          <Input
            name="test-text"
            type="textarea"
            label="typewriter test text"
            bind:value={text}
          />
          <StateButton
            on:click={submitText}
            state={textState}
            messages={{
              [STATE.WAITING]: 'Sending...',
              [STATE.ERROR]: 'Boom! Something broke.',
              [STATE.SUCCESS]: 'Clickety clack!',
            }}>Send</StateButton
          >
        </Grid>
      </div>
      <div>
        <Grid>
          <Input name="test-event" label="event name" bind:value={eventName} />
          <Input
            name="test-event-body"
            type="textarea"
            label="event body (json)"
            bind:value={eventBody}
          />
          <StateButton
            on:click={submitEvent}
            state={eventState}
            messages={{
              [STATE.WAITING]: 'Sending...',
              [STATE.ERROR]: 'Boom! Something broke.',
              [STATE.SUCCESS]: 'Clickety clack!',
            }}>Send</StateButton
          >
        </Grid>
      </div>
    </Grid>
  </Transition>
</Grid>
