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
    const settings = await client.getDocument('settings')
    const { ngrokUrl } = settings

    const response = await fetch(`${ngrokUrl}/brb`, {
      method: 'POST',
      body: await request.text(),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      return { status: 200 }
    }

    return {
      status: response.status,
      body: 'Failed to change BRB status',
    }
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
