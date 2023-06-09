import { assign, createMachine } from 'xstate'

import { COLOUR, sendExternalDmxCommands } from '../_lights'

export enum STATE {
  IDLE = 'idle',
  GREETING = 'greeting',
  ASKING = 'asking',
  AWAITING_RESPONSE = 'awaiting-response',
  LISTENING = 'listening',
  ACKNOWLEDGING = 'acknowledging',
  PROCESSING_AUDIO = 'processing-audio',
  DETECTION_ERROR = 'detection-error',
  WAITING = 'waiting',
  WRITING_POEM = 'writing-poem',
  COOLDOWN = 'cooldown',
}

export enum EVENT {
  AUDIENCE_DETECTED = 'audience-detected',
  TYPING_COMPLETE = 'typing-complete',
  SPEECH_DETECTED = 'speech-detected',
  SPEECH_RECOGNISED = 'speech-recognised',
  BUTTON_DOWN = 'button-down',
  BUTTON_UP = 'button-up',
}

function seconds(n: number) {
  return n * 1000
}

export function create({ greet, ask, acknowledge, generate, setStatusLight }) {
  return createMachine(
    {
      initial: STATE.IDLE,
      id: 'typo',
      context: {
        answers: 0,
        speechDetected: false,
        speechRecognised: false,
      },
      states: {
        [STATE.IDLE]: {
          entry: 'indicateStatusIdle',
          on: {
            [EVENT.AUDIENCE_DETECTED]: {
              target: STATE.GREETING,
              actions: 'greet',
            },
          },
        },
        [STATE.GREETING]: {
          entry: 'indicateStatusActive',
          on: {
            [EVENT.TYPING_COMPLETE]: {
              target: STATE.WAITING,
            },
          },
        },
        [STATE.WAITING]: {
          after: {
            [seconds(5)]: {
              target: STATE.ASKING,
              actions: 'ask',
            },
          },
          on: {
            [EVENT.SPEECH_DETECTED]: {
              target: STATE.ASKING,
              actions: 'ask',
            },
          },
        },
        [STATE.ASKING]: {
          entry: assign({
            speechDetected: false,
            speechRecognised: false,
          }),
          on: {
            [EVENT.TYPING_COMPLETE]: {
              target: STATE.AWAITING_RESPONSE,
            },
          },
        },
        [STATE.AWAITING_RESPONSE]: {
          entry: 'indicateStatusAwaitingResponse',
          on: {
            [EVENT.BUTTON_DOWN]: {
              target: STATE.LISTENING,
            },
          },
          after: {
            [seconds(60)]: {
              target: STATE.IDLE,
            },
          },
        },
        [STATE.LISTENING]: {
          entry: 'indicateStatusListening',
          on: {
            [EVENT.BUTTON_UP]: [
              {
                target: STATE.ACKNOWLEDGING,
                cond: 'speechRecognised',
              },
              // There's a bit of a delay in recognising the audio, go to a
              // processing state if the user lets go to to soon.
              {
                target: STATE.PROCESSING_AUDIO,
              },
            ],
            [EVENT.SPEECH_DETECTED]: {
              target: STATE.LISTENING,
              actions: 'speechDetected',
            },
            [EVENT.SPEECH_RECOGNISED]: {
              target: STATE.LISTENING,
              actions: 'speechRecognised',
            },
          },
        },
        [STATE.PROCESSING_AUDIO]: {
          entry: 'indicateStatusProcessingAudio',
          on: {
            [EVENT.SPEECH_RECOGNISED]: {
              target: STATE.ACKNOWLEDGING,
            },
          },
          after: {
            [seconds(5)]: {
              target: STATE.DETECTION_ERROR,
            },
          },
        },
        [STATE.DETECTION_ERROR]: {
          entry: 'indicateStatusError',
          after: {
            [seconds(1)]: {
              target: STATE.AWAITING_RESPONSE,
            },
          },
        },
        [STATE.ACKNOWLEDGING]: {
          entry: ['indicateStatusActive', 'acknowledge', 'countAnswer'],
          on: {
            [EVENT.TYPING_COMPLETE]: [
              {
                target: STATE.WRITING_POEM,
                cond: 'shouldGeneratePoem',
                actions: 'generate',
              },
              {
                target: STATE.ASKING,
                actions: 'ask',
              },
            ],
          },
        },
        [STATE.WRITING_POEM]: {
          entry: ['resetAnswerCount', 'indicateStatusThinking'],
          on: {
            [EVENT.TYPING_COMPLETE]: {
              target: STATE.COOLDOWN,
            },
          },
        },
        [STATE.COOLDOWN]: {
          entry: ['indicateStatusActive'],
          type: 'final',
          // after: {
          //   [seconds(10)]: {
          //     target: STATE.IDLE,
          //   },
          // },
        },
      },
    },
    {
      actions: {
        greet,
        ask,
        acknowledge,
        generate,
        countAnswer: assign({
          answers: (context: any) => context.answers + 1,
        }),
        resetAnswerCount: assign({
          answers: 0,
        }),
        speechDetected: assign({
          speechDetected: true,
        }),
        speechRecognised: assign({
          speechRecognised: true,
        }),
        indicateStatusIdle: () => {
          sendExternalDmxCommands(
            {
              channel: 101,
              value: COLOUR.WHITE,
            },
            {
              channel: 104,
              value: COLOUR.WHITE,
            },
          )
          setStatusLight(COLOUR.WHITE, COLOUR.GREY)
        },
        indicateStatusActive: () => {
          setStatusLight(COLOUR.ORANGE)
        },
        indicateStatusAwaitingResponse: () => {
          setStatusLight(COLOUR.GREEN)
        },
        indicateStatusListening: () => {
          setStatusLight(COLOUR.CYAN)
        },
        indicateStatusProcessingAudio: () => {
          setStatusLight(COLOUR.CYAN, COLOUR.GREEN)
        },
        indicateStatusError: () => {
          setStatusLight(COLOUR.RED)
        },
        indicateStatusThinking: () => {
          setStatusLight(COLOUR.ORANGE, COLOUR.AMBER)
          sendExternalDmxCommands(
            {
              channel: 101,
              value: COLOUR.ORANGE,
            },
            {
              channel: 104,
              value: COLOUR.ORANGE,
            },
          )
        },
      },
      guards: {
        shouldGeneratePoem: (context) => context.answers >= 3,
        speechDetected: (context) => context.speechDetected,
        speechRecognised: (context) => context.speechRecognised,
      },
    },
  )
}
