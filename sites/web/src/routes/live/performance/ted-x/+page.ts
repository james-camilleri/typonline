import { get } from '$lib/utils/get'

export async function load({ fetch }) {
  return {
    phrases: await get.phrases(
      ['greetings', 'acknowledgements', 'questions-architecture'],
      fetch,
    ),
  }
}
