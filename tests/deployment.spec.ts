import { test, expect } from '@playwright/test'

const SITE_URL = process.env.BASE_URL || 'https://www.gearedtotrack.co.uk'

test.describe('Deployment Check', () => {
  test('GitHub Pages site loads', async ({ page }) => {
    const response = await page.goto(SITE_URL)

    // Check page loaded
    expect(response?.status()).toBeLessThan(400)

    // Check title
    await expect(page).toHaveTitle(/GearedtoTrack/i)

    // Check logo is visible
    await expect(page.getByAltText('Geared to Track')).toBeVisible()

    // Check Google sign-in button exists
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible()
  })

  test('Landing page has feature cards', async ({ page }) => {
    await page.goto(SITE_URL)

    // Check feature section headings
    await expect(page.getByRole('heading', { name: 'Gear Ratios' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Lap Times' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Progress Tracking' })).toBeVisible()
  })

})
