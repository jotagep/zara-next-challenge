import { expect, test, type Page } from '@playwright/test'

let phonePath = ''

const phoneCatalog = (page: Page) => page.getByRole('list', { name: 'Phone catalog' })
const productDetails = (page: Page) => page.getByRole('region', { name: 'Product details' })

const fetchFirstPhonePath = async (page: Page): Promise<string> => {
  await page.goto('/')
  const firstCard = phoneCatalog(page).getByRole('link').first()
  const href = await firstCard.getAttribute('href')
  if (!href || !href.startsWith('/phone/')) {
    throw new Error('Could not resolve a phone detail path from the catalog')
  }
  return href
}

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage()
  try {
    phonePath = await fetchFirstPhonePath(page)
  } finally {
    await page.close()
  }
})

test.describe('Phone detail page (/phone/:id)', () => {
  test('renders the product hero with name and a "from" starting price', async ({ page }) => {
    await page.goto(phonePath)

    await expect(productDetails(page)).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(productDetails(page).getByText(/^from /i)).toBeVisible()
  })

  test('the Add button is disabled until a storage option is selected', async ({ page }) => {
    await page.goto(phonePath)

    const add = page.getByRole('button', { name: 'Add', exact: true })
    await expect(add).toBeDisabled()

    const storageRadios = page.getByRole('radiogroup', { name: 'Storage' }).getByRole('radio')
    expect(await storageRadios.count()).toBeGreaterThan(0)
    await storageRadios.first().click()

    await expect(add).toBeEnabled()
    await expect(productDetails(page).getByText(/^from /i)).toHaveCount(0)
  })

  test('selecting a color marks that swatch as checked and updates the displayed name', async ({
    page,
  }) => {
    await page.goto(phonePath)

    const swatches = page.getByRole('radiogroup', { name: 'Color' }).getByRole('radio')
    const total = await swatches.count()
    test.skip(total < 2, 'Phone has fewer than two color options')

    const second = swatches.nth(1)
    const colorName = (await second.getAttribute('aria-label')) ?? ''
    expect(colorName.length).toBeGreaterThan(0)

    await second.click()
    await expect(second).toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('[aria-live="polite"]').first()).toHaveText(colorName)
  })

  test('adding to cart increments the header bag counter and navigates to /cart', async ({
    page,
  }) => {
    await page.goto(phonePath)

    await page.getByRole('link', { name: 'Shopping bag, 0 items' }).waitFor()
    await page.getByRole('radiogroup', { name: 'Storage' }).getByRole('radio').first().click()
    await page.getByRole('button', { name: 'Add', exact: true }).click()

    await expect(page).toHaveURL('/cart')
    await expect(page.getByRole('link', { name: 'Shopping bag, 1 items' })).toBeVisible()
  })

  test('shows the specifications table', async ({ page }) => {
    await page.goto(phonePath)

    await expect(page.getByRole('heading', { name: 'Specifications' })).toBeVisible()
    const specs = page.getByRole('region', { name: 'Specifications' })
    await expect(specs.getByText('Brand', { exact: true })).toBeVisible()
    await expect(specs.getByRole('definition').first()).toBeVisible()
  })

  test('renders similar items when the API provides them', async ({ page }) => {
    await page.goto(phonePath)

    const similarHeading = page.getByRole('heading', { name: 'Similar items' })
    if ((await similarHeading.count()) > 0) {
      const similar = page.getByRole('region', { name: 'Similar items' })
      await expect(similar.getByRole('link').first()).toBeVisible()
    }
  })

  test('the back link returns to the catalog', async ({ page }) => {
    await page.goto(phonePath)

    await page.getByRole('link', { name: 'Back' }).click()
    await expect(page).toHaveURL('/')
    await expect(phoneCatalog(page)).toBeVisible()
  })
})
