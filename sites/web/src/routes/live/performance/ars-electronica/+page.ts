import { get } from '$lib/utils/get'

export const prerender = false

export async function load({ fetch }) {
  return {
    phrases: await get.phrases(
      ['greetings', 'acknowledgements', 'questions-generic'],
      fetch,
    ),
  }
}
