<script context="module">
  import { get } from '$lib/utils/get'

  export async function load({ fetch }) {
    return {
      props: {
        phrases: await get.phrases(
          ['greetings', 'acknowledgements', 'questions-architecture'],
          fetch,
        ),
      },
    }
  }
</script>

<script lang="ts">
  import { onEvent } from '$lib/connection'

  import { onMount, tick } from 'svelte'

  import Title from '$lib/components/global/Title.svelte'
  import Grid from '$lib/components/layout/Grid.svelte'

  import CONFIG from '$lib/config'
  import {
    recogniseSpeech,
    filterStopWords,
    type Response,
  } from './_speech-recognition'

  import { create, STATE, EVENT } from './_state-machine'
  import { useMachine } from '@xstate/svelte'

  export let phrases: { [name: string]: string[] }

  let responses: Response[] = []

  onMount(async () => {
    recogniseSpeech(onRecogniseSpeech)
  })

  onEvent('audience-detected', () => send(EVENT.AUDIENCE_DETECTED))
  onEvent('typing-complete', () => send(EVENT.TYPING_COMPLETE))

  const { state, send } = useMachine(
    create({
      greet() {
        type(random(phrases.greetings))
      },
      ask() {
        type(random(phrases['questions-architecture']))
      },
      acknowledge() {
        type(random(phrases.acknowledgements) + '\n\n')
      },
      generate() {
        generatePoem()
        responses = []
      },
    }),
  )

  function random(array: string[]) {
    return array[Math.floor(Math.random() * array.length)]
  }

  function onRecogniseSpeech(event: { results: SpeechRecognitionResultList }) {
    const { results } = event
    const response = results[results.length - 1][0].transcript
    console.log('RECOGNISED SPEECH:', response)

    if ($state.value === STATE.LISTENING) {
      responses = [
        ...responses,
        { original: response, filtered: filterStopWords(response) },
      ]
    }

    send(EVENT.AUDIO_DETECTED)
  }

  function type(text: string, savePost = false) {
    console.log('TYPING:', text)
    fetch('/typewriter/type', {
      method: 'POST',
      body: JSON.stringify({ text, savePost }),
    })
  }

  async function generatePoem() {
    const seeds = responses
      .map((response) => response.filtered)
      .map((responses) => random(responses))

    if (seeds.length === 0) return

    const response = await fetch('/generate/poem', {
      method: 'POST',
      body: JSON.stringify({ seeds }),
    }).then((response) => response.json())

    type(response.poem + '\n\n', true)
  }
</script>

<div class="wrapper">
  <Grid columns={[2, 1, 1]}>
    <div class="main-panel">
      <Title text={CONFIG.GENERAL.siteTitle} subtitle="Here East" />
      {$state.value}
    </div>
  </Grid>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    margin-top: var(--gutter);
  }

  .main-panel {
    display: flex;
    flex-direction: column;
  }
</style>
