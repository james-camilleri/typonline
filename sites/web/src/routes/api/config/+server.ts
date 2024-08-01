import sanityClient from '@sanity/client'
import CONFIG from '$lib/config'
import { json } from '@sveltejs/kit'

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
  return json(await client.getDocument('settings'))
}
