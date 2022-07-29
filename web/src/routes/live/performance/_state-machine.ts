import { assign, createMachine } from 'xstate'

export enum STATE {
  IDLE = 'idle',
  GREETING = 'greeting',
  ASKING = 'asking',
  LISTENING = 'listening',
  ACKNOWLEDGING = 'acknowledging',
  WAITING = 'waiting',
  WRITING_POEM = 'writing-poem',
  COOLDOWN = 'cooldown',
}

export enum EVENT {
  AUDIENCE_DETECTED = 'audience-detected',
  TYPING_COMPLETE = 'typing-complete',
  AUDIO_DETECTED = 'audio-detected',
}

function seconds(n: number) {
  return n * 1000
}

export function create({ greet, ask, acknowledge, generate }) {
  return createMachine(
    {
      initial: STATE.IDLE,
      id: 'typo',
      context: {
        answers: 0,
      },
      states: {
        [STATE.IDLE]: {
          on: {
            [EVENT.AUDIENCE_DETECTED]: {
              target: STATE.GREETING,
              actions: 'greet',
            },
          },
        },
        [STATE.GREETING]: {
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
            [EVENT.AUDIO_DETECTED]: {
              target: STATE.ASKING,
              actions: 'ask',
            },
          },
        },
        [STATE.ASKING]: {
          on: {
            [EVENT.TYPING_COMPLETE]: {
              target: STATE.LISTENING,
            },
          },
        },
        [STATE.LISTENING]: {
          after: {
            [seconds(60)]: {
              target: STATE.IDLE,
            },
          },
          on: {
            [EVENT.AUDIO_DETECTED]: {
              target: STATE.ACKNOWLEDGING,
              actions: ['acknowledge', 'countAnswer'],
            },
          },
        },
        [STATE.ACKNOWLEDGING]: {
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
          entry: assign({
            answers: 0,
          }),
          on: {
            [EVENT.TYPING_COMPLETE]: {
              target: STATE.COOLDOWN,
            },
          },
        },
        [STATE.COOLDOWN]: {
          after: {
            [seconds(10)]: {
              target: STATE.IDLE,
            },
          },
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
      },
      guards: {
        shouldGeneratePoem: (context) => context.answers >= 3,
      },
    },
  )
}
