import type { Performance } from '$lib/types/pages/performance'

import { get } from '$lib/utils/get'
import { PAGES } from '$lib/types/pages'

export async function load({ fetch }) {
  return {
    page: (await get.page(PAGES.PERFORMANCE, fetch)) as Performance,
  }
}
