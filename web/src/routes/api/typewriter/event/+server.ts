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
export async function POST({ request }) {
  try {
    const [settings, payload] = await Promise.all([
      client.getDocument('settings'),
      request.text(),
    ])

    const { ngrokUrl } = settings

    const response = await fetch(`${ngrokUrl}/event`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: payload,
    })

    return new Response(undefined, { status: response.status })
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}
