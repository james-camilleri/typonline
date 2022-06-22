import { browser } from '$app/env'
import { get, writable } from 'svelte/store'

export const heartbeatData = writable<{ version: string }>()
export const disconnectedSeconds = writable(0)
export const HEARTBEAT_TIMEOUT = 10000

const ONE_SECOND = 1000
let disconnectedInterval = null

type EventHandler = (payload: any) => void
const handlers = new Map<string, EventHandler[]>()

export function onEvent(event: string, handler: EventHandler) {
  const handlersForEvent = handlers.get(event) ?? []
  handlersForEvent.push(handler)
  handlers.set(event, handlersForEvent)
}

async function heartbeat() {
  const heartbeat = await fetch('/config/heartbeat')

  if (heartbeat.ok) {
    if (!get(heartbeatData)) {
      clearInterval(disconnectedInterval)
      disconnectedInterval = null
      disconnectedSeconds.set(0)

      heartbeatData.set(await heartbeat.json())
      await initialiseWebSocket()
    }

    return
  }

  heartbeatData.set(null)
  if (!disconnectedInterval) {
    disconnectedInterval = setInterval(() => {
      disconnectedSeconds.update((seconds) => seconds + 1)
    }, ONE_SECOND)
  }
}

async function initialiseWebSocket() {
  const piUrl = await fetch('/config/ngrok').then((response) => response.text())
  const webSocket = new WebSocket(piUrl.replace('http', 'ws'))
  webSocket.onmessage = (message) => {
    const { type, payload } = JSON.parse(message.data)
    handlers.get(type)?.forEach((listener) => listener(payload))
  }
}

if (browser) {
  heartbeat()
  setInterval(heartbeat, HEARTBEAT_TIMEOUT)
}
