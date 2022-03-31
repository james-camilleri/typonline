import sanityClient from '@sanity/client'
import CONFIG from '$lib/config'

const { projectId, dataset, apiVersion } = CONFIG.SANITY
const { SANITY_API_KEY } = process.env

const client = sanityClient({
  projectId,
  dataset,
  apiVersion,
  token: SANITY_API_KEY,
  useCdn: false,
})

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
  try {
    const [settings, payload] = await Promise.all([
      client.getDocument('settings'),
      request.json(),
    ])

    const { ngrokUrl } = settings
    const { text } = payload

    const response = await fetch(ngrokUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    console.log(response)
    if (response.ok) return { status: 200 }
  } catch (e) {
    return {
      status: 500,
      body: e.message,
    }
  }
}
