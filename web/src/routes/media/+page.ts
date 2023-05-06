import { get } from '$lib/utils/get'

export async function load({ fetch }) {
  const images = await get.images(fetch)

  return {
    images,
  }
}
