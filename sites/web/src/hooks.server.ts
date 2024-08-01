import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  console.debug('🏁', event.url.toString(), `[${event.getClientAddress()}]`)
  return resolve(event)
}
