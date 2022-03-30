import { updateImageMetadata } from '@james-camilleri/sanity-web-image'
import { Handler } from '@netlify/functions'
import sanityClient from '@sanity/client'

const { SANITY_API_KEY } = process.env

const client = sanityClient({
  projectId: 'i8yrdmec',
  apiVersion: '2022-03-01',
  dataset: 'production',
  token: SANITY_API_KEY,
  useCdn: false,
})

export const handler: Handler = async (event) =>
  updateImageMetadata(event, client)
