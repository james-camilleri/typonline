<script context="module">
  import { get } from '$lib/utils/get'
  import { PAGES } from '$lib/types/pages'

  export const prerender = true

  export async function load({ fetch }) {
    return {
      props: {
        page: await get.page(PAGES.PERFORMANCE, fetch),
      },
    }
  }
</script>

<script lang="ts">
  import { STATE, type State } from '$lib/components/form/StateButton.svelte'
  import type { Performance } from '$lib/types/pages/performance'

  import shuffle from 'lodash/shuffle.js'
  import { onMount, tick } from 'svelte'

  // import { generateText } from '$lib/ml/generate'

  import Title from '$lib/components/global/Title.svelte'
  import Grid from '$lib/components/layout/Grid.svelte'
  import Input from '$lib/components/form/Input.svelte'

  import CONFIG from '$lib/config'
  import {
    recogniseSpeech,
    filterStopWords,
    type Response,
  } from './_speech-recognition'

  const SUBMIT_GRACE_PERIOD_MS = 2000
  const CLEAR_AFTER_MS = 1000

  export let page: Performance

  const _questions = shuffle(page.questions)
  const questions = [..._questions]

  let text = ''
  let customText = ''
  let customTextInput: HTMLElement | null = null
  let pendingActionId
  let state: State
  let responses: Response[] = []
  let generateText

  onMount(async () => {
    // We need to import this on mount because
    // it references `window` on initialisation.
    generateText = (await import('$lib/ml/generate')).generateText

    recogniseSpeech((event: { results: SpeechRecognitionResultList }) => {
      const { results } = event
      const response = results[results.length - 1][0].transcript
      responses = [
        ...responses,
        { original: response, filtered: filterStopWords(response) },
      ]
    })
  })

  function sendText(newText: string, savePost = false) {
    text = newText

    pendingActionId = setTimeout(() => {
      state = STATE.WAITING
      fetch('/typewriter/type', {
        method: 'POST',
        body: JSON.stringify({ text, savePost }),
      })
        .then((response) => {
          response.ok ? (state = STATE.SUCCESS) : (state = STATE.ERROR)
          setTimeout(clearText, CLEAR_AFTER_MS)
        })
        .catch(() => {
          state = STATE.ERROR
          setTimeout(clearText, CLEAR_AFTER_MS)
        })
    }, SUBMIT_GRACE_PERIOD_MS)
  }

  async function cancel() {
    clearTimeout(pendingActionId)
    await clearText()
  }

  async function clearText() {
    text = ''
    state = STATE.IDLE

    // Wait a tick to ensure the question is removed from
    // the DOM and not just replaced with the next one, in the
    // cases when multiple questions are requested successively.
    await tick()
  }

  function askNextQuestion() {
    const question = questions.shift()

    // Reload questions if we've exhausted them all.
    // Use the same order to avoid duplicates just after a reload.
    if (questions.length === 0) {
      questions.push(..._questions)
    }

    sendText(question)
  }

  function getRandomIndex(array) {
    const max = array.length - 1
    return Math.floor(Math.random() * max)
  }

  async function generate() {
    const seeds = responses
      .map((response) => response.filtered)
      .map((responses) => responses[getRandomIndex(responses)])

    const generatedText = await seeds.reduce(async (previousLines, seed) => {
      return previousLines.then(async (lines) => {
        const generated = await generateText(seed)
        const nextLine = `${seed} ${generated}`
        return [...lines, nextLine]
      })
    }, Promise.resolve([]))

    console.log('generated text', generatedText)

    const poem = '\n\n' + generatedText.join('\n') + '\n\n'

    console.log(poem)
    sendText(poem, true)
  }

  async function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'c' && document.activeElement !== customTextInput) {
      customTextInput.focus()
      event.preventDefault()
    }

    if (event.key === 'Enter' && customText) {
      await cancel()
      sendText(customText)
      customText = ''

      // Remove focus from the input immediately, so we
      // can re-activate any other keybaord shortcuts.
      ;(document.activeElement as HTMLElement).blur()
    }

    // Don't try grab any other events if
    // we're typing into the custom text input.
    if (document.activeElement === customTextInput) return

    const HOTKEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    if (HOTKEYS.includes(event.key)) {
      const phrase = page.phrases[Number(event.key) - 1]
      if (phrase) {
        await cancel()
        sendText(phrase)
      }
    }

    if (event.key === 'q') {
      await cancel()
      sendText('/n')
    }

    if (event.key === 'q') {
      await cancel()
      askNextQuestion()
    }

    if (event.key === 'Escape') {
      await cancel()
    }

    if (event.key === 'Enter') {
      await cancel()
      await generate()
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="wrapper">
  <Grid columns={[2, 1, 1]}>
    <div class="main-panel">
      <Title text={CONFIG.GENERAL.siteTitle} subtitle="Bloomsbury Theatre" />
      <div class="controls">
        <Grid gap="var(--sm)">
          <div class="text-wrapper">
            {#if text}
              <p
                class="text"
                class:waiting={state === STATE.WAITING}
                class:success={state === STATE.SUCCESS}
                class:error={state === STATE.ERROR}
              >
                {text}
              </p>
            {/if}
          </div>
          <Input
            name="custom-text"
            label="Custom text"
            width="long"
            bind:value={customText}
            bind:ref={customTextInput}
          />
        </Grid>
      </div>
      <small
        >Use the hotkeys <strong><em>1-0</em></strong> to type a pre-set phrase.<br
        />
        Press <strong><em>C</em></strong> to input custom text. (Use Enter to
        submit.)
        <br />Press <strong><em>Q</em></strong> to ask a new question.<br />
        <strong><em>Enter</em></strong>
        generates a new poem from the currently stored responses.<br />
        <strong><em>Esc</em></strong> cancels any ongoing operations.</small
      >
    </div>

    <div class="panel">
      <strong class="heading">Recognised responses</strong>
      <Grid gap="0">
        {#each responses as response}
          <p class="response">{response.original}</p>
          <small>({response.filtered.join(', ')})</small>
        {/each}
      </Grid>
    </div>
    <div class="panel">
      <strong class="heading">Pre-set phrases</strong>
      <Grid gap="0">
        {#each page.phrases as phrase, i}
          <p><strong>{(i + 1) % 9}:</strong> {phrase}</p>
        {/each}
      </Grid>
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

  .panel {
    padding: var(--md);
    margin-top: var(--xl);
    background: rgba(0 0 0 / 5%);

    .heading {
      display: block;
      margin-bottom: var(--md);
    }
  }

  .controls {
    flex: 1;
    margin-top: var(--lg);
  }

  .text-wrapper {
    min-height: 2em;
    justify-self: flex-start;
  }

  .text {
    --progress-colour: var(--primary);

    justify-self: flex-start;
    font-weight: bold;

    &.waiting {
      --progress-colour: var(--secondary);
    }

    &.success {
      --progress-colour: var(--success);
    }

    &.error {
      --progress-colour: var(--error);
    }

    &::after {
      display: block;
      width: 100%;
      height: 2px;
      content: '';
      background-color: var(--progress-colour);
      transition: background-color var(--transition-fast) ease;
      transform-origin: 0%;
      animation: progress 2s;
    }
  }

  p {
    margin: var(--xs) 0 var(--xs);
  }

  @keyframes progress {
    0% {
      transform: scaleX(0);
    }

    100% {
      transform: scaleX(1);
    }
  }
</style>
