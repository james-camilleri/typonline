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
export async function GET() {
  try {
    const settings = await client.getDocument('settings')
    const { ngrokUrl } = settings

    const response = await fetch(`${ngrokUrl}/heartbeat`)
    if (response.ok) {
      return new Response(await response.json())
    }

    return new Response('Heartbeat failed.', { status: response.status })
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}
