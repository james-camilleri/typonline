import { json } from '@sveltejs/kit'
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
    const posts = await client.fetch('*[_type == "post" && public == true]')
    return json(posts)
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  try {
    const payload = await request.json()
    const doc = {
      _type: 'post',
      ...payload,
    }

    await client.create(doc)
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }

  return new Response('Conversation successfully stored')
}
