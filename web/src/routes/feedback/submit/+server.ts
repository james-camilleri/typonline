import sanityClient from '@sanity/client'
import type { RequestEvent } from '@sveltejs/kit'
import CONFIG from '$lib/config'

export interface FeedbackPayload {
  name?: string
  email?: string
  message: string
}

export interface FeedbackRequestEvent extends RequestEvent {
  json: () => Promise<FeedbackPayload>
}

export async function POST({ request }: { request: FeedbackRequestEvent }) {
  try {
    const payload = await request.json()
    await postToSanity(payload)
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }

  return new Response('Message sent successfully')
}

async function postToSanity(sanityPayload: FeedbackPayload) {
  const { name, email, message } = sanityPayload
  const { projectId, dataset, apiVersion } = CONFIG.SANITY
  const { SANITY_API_KEY } = process.env

  const client = sanityClient({
    projectId,
    dataset,
    apiVersion,
    token: SANITY_API_KEY,
    useCdn: false,
  })

  await client.create({
    _type: 'submissionFeedback',
    name,
    email,
    message,
  })
}
