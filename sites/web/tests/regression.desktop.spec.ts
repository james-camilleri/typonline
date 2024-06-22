import { test, expect } from '@playwright/test'
import { generateVisualTestParams, goToAndWait } from './utils'

test('desktop visual regression', async ({ page }) => {
  await page.goto('/')
  const testParams = await generateVisualTestParams(page)

  for (const { name, url } of testParams) {
    await goToAndWait(page, url)

    await test.step(`screenshot "${name}"`, async () => {
      await expect(page).toHaveScreenshot(`${name}--.png`, {
        fullPage: true,
      })
    })
  }
})
