// Import global types.
import '@netlify/edge-functions'

export const env = new Proxy({} as Record<string, string>, {
  get(_, name) {
    // Standard NodeJs lambda function.
    if (globalThis.process != null) {
      return globalThis.process[name]
    }

    // Netlify edge function.
    if (globalThis.Netlify) {
      return Netlify.env.get(name)
    }

    return
  },
})
