<script lang="ts">
  import type { Post } from '../types'

  import { onMount } from 'svelte'
  import { useMachine } from '@xstate/svelte'
  import { nanoid } from 'nanoid'

  import { onEvent } from '$lib/connection'
  import Grid from '$lib/components/layout/Grid.svelte'

  import {
    recogniseSpeech,
    filterStopWords,
    type Response,
  } from '../_speech-recognition'
  import { create, STATE, EVENT } from '../_state-machine'
  import { setStatusLight } from '../../_lights'
  import { loadQuestions, nextQuestion } from '../_questions'

  export let data
  let { phrases } = data
  loadQuestions(phrases['questions-generic'])

  let post: Post = {
    conversation: [],
    seeds: [],
    poem: '',
  }
  let responses: Response[] = []
  let logs: string[] = []

  onMount(async () => {
    recogniseSpeech(onRecogniseSpeech, onDetectSpeech)
  })

  const { state, send } = useMachine(
    create({
      greet() {
        type(random(phrases.greetings))
      },
      ask() {
        type(nextQuestion())
        log('ASKING QUESTION')
      },
      acknowledge() {
        type(random(phrases.acknowledgements) + '\n\n')
      },
      generate() {
        log('GENERATING POEM')
        generatePoem()
        responses = []
      },
      setStatusLight,
    }),
  )

  onEvent('queue-empty', () => send(EVENT.TYPING_COMPLETE))
  onEvent('button-down', () => send(EVENT.BUTTON_DOWN))
  onEvent('button-up', () => send(EVENT.BUTTON_UP))
  onEvent('audience-detected', () => {
    if ($state.value === STATE.IDLE) {
      log('AUDIENCE DETECTED')
    }
    send(EVENT.AUDIENCE_DETECTED)
  })

  // service.subscribe(console.log)

  function onRecogniseSpeech(event: { results: SpeechRecognitionResultList }) {
    const { results } = event
    const response = results[results.length - 1][0].transcript
    // log(`RECOGNISED SPEECH: "${response}" (${$state.value})`)
    console.warn(`RECOGNISED SPEECH: "${response}" (${$state.value})`)

    if (
      [STATE.LISTENING, STATE.PROCESSING_AUDIO].includes($state.value as STATE) // Ugly type coercion, sorry.
    ) {
      console.warn('updating stored responses')
      responses = [
        ...responses,
        { original: response, filtered: filterStopWords(response) },
      ]

      post.conversation.push({
        _key: nanoid(),
        entity: 'audience',
        text: response,
      })
    }

    // console.warn('SPEECH RECOGNISED')
    send(EVENT.SPEECH_RECOGNISED)
  }

  function onDetectSpeech() {
    console.warn('DETECTED SPEECH')
    send(EVENT.SPEECH_DETECTED)
  }

  function random(array: string[]) {
    return array[Math.floor(Math.random() * array.length)]
  }

  function type(text: string, addToConversation = true) {
    log(`TYPING: "${text}"`)

    if (addToConversation) {
      post.conversation.push({ _key: nanoid(), entity: 'typewriter', text })
    }

    fetch('/api/typewriter/type', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
  }

  function log(text: string) {
    logs = logs.length > 10 ? [...logs.slice(1), text] : [...logs, text]
  }

  async function generatePoem() {
    const seeds = responses
      .map((response) => response.filtered)
      .map((responses) => random(responses))

    if (seeds.length === 0) return
    post.seeds = seeds

    const response = await fetch('/api/generate/poem', {
      method: 'POST',
      body: JSON.stringify({ seeds }),
    }).then((response) => response.json())

    type(response.poem + '\n\n', false)
    post.poem = response.poem

    await fetch('/api/conversations/post', {
      method: 'POST',
      body: JSON.stringify(post),
    })
  }
</script>

<div class="wrapper">
  <Grid columns={[2, 1, 1]}>
    <div class="main-panel">
      {$state.value} [{responses.length}/3 responses gathered]
      <div class="logs">
        {#each logs as log}
          <span>{log}</span>
        {/each}
      </div>
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

  .logs {
    display: flex;
    flex-flow: column;
    margin-top: var(--lg);
  }
</style>
