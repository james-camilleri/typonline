import { browser } from '$app/environment'
import { get, writable } from 'svelte/store'

export const heartbeatData = writable<{ version: string }>()
export const disconnectedSeconds = writable(0)
export const HEARTBEAT_TIMEOUT = 5000

const ONE_SECOND = 1000
let disconnectedInterval: number = null
let webSocket: WebSocket = null

type EventHandler = (payload: any) => void
const handlers = new Map<string, EventHandler[]>()

export function onEvent(event: string, handler: EventHandler) {
  const handlersForEvent = handlers.get(event) ?? []
  handlersForEvent.push(handler)
  handlers.set(event, handlersForEvent)
}

export async function broadcast(payload: any) {
  await fetch('/api/typewriter/broadcast', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// export async function fireEvent(event: { type: string; data: any }) {
//   console.info(`Event fired (control panel): "${event.type}"`)
//   fetch('/api/typewriter/event', {
//     method: 'POST',
//     body: JSON.stringify(event),
//   })
// }

export async function fireEvent(event: { type: string; data?: any }) {
  if (event.type !== 'heartbeat') {
    console.info(`Event fired (control panel): "${event.type}"`)
    console.debug('Payload:', event.data)
  }

  webSocket && webSocket.send(JSON.stringify(event))
}

// async function heartbeat() {
//   const heartbeat = await fetch('/api/typewriter/heartbeat')

//   if (heartbeat.ok) {
//     if (!get(heartbeatData)) {
//       clearInterval(disconnectedInterval)
//       disconnectedInterval = null
//       disconnectedSeconds.set(0)

//       heartbeatData.set(await heartbeat.json())
//       await initialiseWebSocket()
//     }

//     return
//   }

//   heartbeatData.set(null)
//   if (!disconnectedInterval) {
//     disconnectedInterval = setInterval(() => {
//       disconnectedSeconds.update((seconds) => seconds + 1)
//     }, ONE_SECOND)
//   }
// }

function heartbeat() {
  fireEvent({ type: 'heartbeat' })
}

function resetDisconnectedCounter() {
  clearInterval(disconnectedInterval)
  disconnectedInterval = null
  disconnectedSeconds.set(0)
}

function startDisconnectedCounter() {
  heartbeatData.set(null)
  if (!disconnectedInterval) {
    disconnectedInterval = setInterval(() => {
      disconnectedSeconds.update((seconds) => seconds + 1)
    }, ONE_SECOND)
  }
}

async function initialiseWebSocket() {
  const piUrl = await fetch('/api/config/ngrok').then((response) =>
    response.text(),
  )

  return new Promise<WebSocket>((resolve, reject) => {
    try {
      const webSocket = new WebSocket(piUrl.replace('http', 'ws'))

      webSocket.onopen = () => resolve(webSocket)
      webSocket.onerror = (error) => reject(error)
    } catch (error) {
      reject(error)
    }
  })
}

async function initialiseConnection() {
  try {
    webSocket = await initialiseWebSocket()
    heartbeat()
    heartbeatData.set({ version: '-' })
    resetDisconnectedCounter()

    webSocket.onerror = () => {
      webSocket.close()
    }

    webSocket.onclose = () => {
      startDisconnectedCounter()
      setTimeout(initialiseConnection, HEARTBEAT_TIMEOUT)
    }

    webSocket.onmessage = (message) => {
      const { type, payload } = JSON.parse(message.data)
      if (type !== 'log' && type !== 'heartbeat') {
        console.info(`Event received (control panel): "${type}"`)
      }

      handlers.get(type)?.forEach((listener) => listener(payload))
    }
  } catch (e) {
    startDisconnectedCounter()
    setTimeout(initialiseConnection, HEARTBEAT_TIMEOUT)
    return
  }

  setInterval(heartbeat, HEARTBEAT_TIMEOUT)
}

if (browser) {
  initialiseConnection()
  onEvent('heartbeat', (version) => {
    heartbeatData.set({ version })
  })

  const levels = {
    ERROR: 'error',
    WARNING: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
  }

  onEvent('log', (log) => {
    const [_, level, text] = log.match(/\[(\w+)\]\s(.*)/)
    console[levels[level]](text)
  })
}
