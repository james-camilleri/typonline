import { Page, PlaywrightTestArgs, expect } from '@playwright/test'

async function getAllVisibleNavLinks(page: Page) {
  const urls: (string | null)[] = []

  for (const nav of await page.getByRole('navigation').all()) {
    for (const link of await nav.getByRole('link').all()) {
      urls.push(await link.getAttribute('href'))
    }
  }

  // Only keep valid local urls.
  const filteredUrls = urls.filter(
    (url): url is string => url != null && url.startsWith('/'),
  )

  return [...new Set(filteredUrls)]
}

export async function generateVisualTestParams(page: Page) {
  const urls = await getAllVisibleNavLinks(page)

  return urls.map((url) => {
    let name = url.slice(1).replace('/', '--')
    if (name === '') {
      name = 'home'
    }

    return { name, url }
  })
}

export async function goToAndWait(page: Page, url: string) {
  await page.goto(url)
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle')
}
