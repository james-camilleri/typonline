import type { Handle } from '@sveltejs/kit'
import { building } from '$app/environment'

export const handle: Handle = async ({ event, resolve }) => {
  if (!building) {
    console.debug('🏁', event.url.toString(), `[${event.getClientAddress()}]`)
  }

  return resolve(event)
}
