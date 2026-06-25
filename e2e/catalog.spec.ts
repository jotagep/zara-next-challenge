import { expect, test, type Page } from '@playwright/test'

const SEARCH_LABEL = 'Search for a smartphone...'

const searchInput = (page: Page) => page.getByRole('searchbox', { name: SEARCH_LABEL })
const phoneCatalog = (page: Page) => page.getByRole('list', { name: 'Phone catalog' })

test.describe('Catalog page (/)', () => {
  test('loads the phone grid with a results count', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('search')).toBeVisible()
    await expect(searchInput(page)).toBeVisible()

    const grid = phoneCatalog(page)
    await expect(grid).toBeVisible()
    await expect(grid.getByRole('listitem').first()).toBeVisible()

    await expect(page.getByText(/^\d+ RESULTS?$/)).toBeVisible()
  })

  test('the header bag starts at zero and links to the cart', async ({ page }) => {
    await page.goto('/')

    const bag = page.getByRole('link', { name: /Shopping bag,/ })
    await expect(bag).toBeVisible()
    await expect(bag).toHaveAttribute('aria-label', 'Shopping bag, 0 items')

    await bag.click()
    await expect(page).toHaveURL('/cart')
  })

  test('typing a brand filters results and syncs the ?s= query param', async ({ page }) => {
    await page.goto('/')

    const grid = phoneCatalog(page)
    const firstCardImage = grid.getByRole('img').first()
    const firstAlt = (await firstCardImage.getAttribute('alt')) ?? ''
    const brand = firstAlt.split(' ')[0]
    expect(brand.length).toBeGreaterThan(0)

    const initialCount = await grid.getByRole('listitem').count()

    await searchInput(page).fill(brand)

    await expect(page).toHaveURL(/[?&]s=/)
    await expect(page.getByText(/RESULTS$/)).toBeVisible()
    await expect(page.getByText('No smartphones match your search.')).toHaveCount(0)

    const filteredCount = await grid.getByRole('listitem').count()
    expect(filteredCount).toBeGreaterThan(0)
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
  })

  test('a search with no matches shows the empty state', async ({ page }) => {
    await page.goto('/')

    await searchInput(page).fill('zzzznope')

    await expect(page).toHaveURL(/[?&]s=zzzznope/)
    await expect(page.getByText('No smartphones match your search.')).toBeVisible()
    await expect(phoneCatalog(page)).toHaveCount(0)
  })

  test('clearing the search restores the full catalog', async ({ page }) => {
    await page.goto('/')

    const input = searchInput(page)
    await input.fill('zzzznope')
    await expect(page.getByText('No smartphones match your search.')).toBeVisible()

    await page.getByRole('button', { name: 'Clear search' }).click()

    await expect(page).toHaveURL(/^[^?]*$/)
    await expect(phoneCatalog(page)).toBeVisible()
    await expect(input).toHaveValue('')
  })

  test('clicking a phone card opens its detail page', async ({ page }) => {
    await page.goto('/')

    const firstCard = phoneCatalog(page).getByRole('link').first()
    const href = (await firstCard.getAttribute('href')) ?? ''
    expect(href).toMatch(/^\/phone\//)

    await firstCard.click()
    await expect(page).toHaveURL(href)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
