<script lang="ts">
  import Input from '$lib/components/form/Input.svelte'
  import StateButton, { STATE } from '$lib/components/form/StateButton.svelte'

  let seedString = ''
  let poem = ''
  let state: STATE = STATE.IDLE

  async function generatePoem() {
    const seeds = seedString
      .replaceAll(',', ' ')
      .split(' ')
      .filter((text) => text && text !== ' ')
    console.log('seeds', seeds)

    if (seeds.length === 0) return
    state = STATE.WAITING

    const response = await fetch('/api/generate/poem', {
      method: 'POST',
      body: JSON.stringify({ seeds }),
    }).then((response) => response.json())

    state = STATE.SUCCESS
    setTimeout(() => {
      state = STATE.IDLE
    })

    poem = response.poem
  }
</script>

<div class="wrapper">
  <p>Put the words you'd like to generate a poem from below.</p>
  <div class="controls">
    <Input name="poem seed words" width="long" bind:value={seedString} />
    <StateButton
      {state}
      on:click={generatePoem}
      messages={{
        [STATE.WAITING]: 'Sending...',
        [STATE.ERROR]: 'Boom! Something broke.',
        [STATE.SUCCESS]: 'Clickety clack!',
      }}>Send</StateButton
    >
  </div>
  <div class="poem">
    {poem}
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .controls {
    display: flex;
    gap: 2rem;
    align-items: end;

    :global(input) {
      width: 500px;
    }
  }

  .poem {
    white-space: pre;
  }
</style>
