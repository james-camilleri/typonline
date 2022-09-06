import { prefetchImageMetadata } from '@james-camilleri/sanity-web-image'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import CONFIG from '$lib/config'
import type { Page, PageId } from '$lib/types/pages'

const THUMBNAIL_SIZE = 200
const REQUEST_OPTIONS = { mode: 'cors' } as const
type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>

const { apiVersion, dataset, projectId } = CONFIG.SANITY

const imgBuilder = imageUrlBuilder({ projectId, dataset })
const url = (query: string) =>
  `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`

export async function getPage(page: PageId, fetch: Fetch): Promise<Page> {
  const query = `*[_type == "${page}"]`

  return fetch(url(query), REQUEST_OPTIONS)
    .then((response) => response.json())
    .then((payload) => payload.result[0])
    .then((page) => prefetchImageMetadata(page, CONFIG.SANITY, fetch))
}

export async function getImages(fetch: Fetch) {
  const mediaPage = await getPage('media', fetch)
  return mediaPage.images
}

export async function getPhrases(
  names: string[],
  fetch: Fetch,
): Promise<{ [name: string]: string[] }> {
  const query = encodeURIComponent(
    `*[_type == "phrases" && name in [${names
      .map((name) => `"${name}"`)
      .join()}]]`,
  )

  const { result } = await fetch(url(query), REQUEST_OPTIONS).then((response) =>
    response.json(),
  )

  return result.reduce(
    (allPhrases, { name, phrases }) => ({
      ...allPhrases,
      [name]: phrases,
    }),
    {},
  )
}

export function getThumbnailUrlFor(source: SanityImageSource): string {
  return imgBuilder.image(source).size(THUMBNAIL_SIZE, THUMBNAIL_SIZE).url()
}

export const get = {
  page: getPage,
  phrases: getPhrases,
  thumbnailUrl: getThumbnailUrlFor,
  images: getImages,
}
