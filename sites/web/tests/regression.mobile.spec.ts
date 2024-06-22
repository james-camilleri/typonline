import { test, expect } from '@playwright/test'
import { generateVisualTestParams, goToAndWait } from './utils'

test('mobile visual regression', async ({ page }) => {
  await page.goto('/')
  const testParams = await generateVisualTestParams(page)

  for (const { name, url } of testParams) {
    await goToAndWait(page, url)

    // Yes, this is criminal, but we have a type animation on
    // the header and this will guarantee that it stops moving.
    await page.waitForTimeout(1000)

    await test.step(`screenshot "${name}"`, async () => {
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
      })
    })
  }
})
