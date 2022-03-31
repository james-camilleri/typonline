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
    const payload = await request.json()
    await client.patch('settings').set({ ngrokUrl: payload.url }).commit()
  } catch (e) {
    return {
      status: 500,
      body: e.message,
    }
  }

  return {
    status: 200,
    body: 'ngrok URL updated successfully',
  }
}
