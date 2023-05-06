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
    return new Response(settings.ngrokUrl)
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  try {
    const payload = await request.json()
    await client.patch('settings').set({ ngrokUrl: payload.url }).commit()
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }

  return new Response('ngrok URL updated successfully')
}
