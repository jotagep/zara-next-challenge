import { expect, test, type Page } from '@playwright/test'

const STORAGE_KEY = 'zara_shopping_cart'

type SeededPhone = {
  id: string
}

const resolveFirstPhone = async (page: Page): Promise<SeededPhone> => {
  await page.goto('/')
  const firstCard = page.getByRole('list', { name: 'Phone catalog' }).getByRole('link').first()
  const href = await firstCard.getAttribute('href')
  if (!href || !href.startsWith('/phone/')) {
    throw new Error('Could not resolve a phone from the catalog')
  }
  const id = decodeURIComponent(href.replace(/^\/phone\//, ''))

  return { id }
}

let phone: SeededPhone = { id: '' }

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage()
  try {
    phone = await resolveFirstPhone(page)
  } finally {
    await page.close()
  }
})

const seedCart = (page: Page, items: unknown[]) =>
  page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value)
    },
    [STORAGE_KEY, JSON.stringify(items)]
  )

test.describe('Cart page (/cart)', () => {
  test('shows an empty state with a continue shopping link when there are no items', async ({
    page,
  }) => {
    await page.goto('/cart')

    await expect(page.getByRole('heading', { name: 'Cart (0)', level: 1 })).toBeVisible()
    await expect(page.getByRole('list', { name: 'Cart items' })).toHaveCount(0)

    const continueShopping = page.getByRole('link', { name: 'Continue shopping' })
    await expect(continueShopping).toBeVisible()
    await continueShopping.click()
    await expect(page).toHaveURL('/')
  })

  test('adding a phone from the detail page shows it in the cart with its total', async ({
    page,
  }) => {
    await page.goto(`/phone/${phone.id}`)

    await page.getByRole('link', { name: 'Shopping bag, 0 items' }).waitFor()
    await page.getByRole('radiogroup', { name: 'Storage' }).getByRole('radio').first().click()

    const priceText = (
      await page.getByRole('region', { name: 'Product details' }).getByText(/EUR$/).textContent()
    )?.trim()
    if (!priceText) throw new Error('Price text not found on product hero')

    const phoneName = (await page.getByRole('heading', { level: 1 }).textContent()) ?? ''

    await page.getByRole('button', { name: 'Add', exact: true }).click()
    await expect(page.getByRole('link', { name: 'Shopping bag, 1 items' })).toBeVisible()

    await page.getByRole('link', { name: /Shopping bag,/ }).click()
    await expect(page).toHaveURL('/cart')

    await expect(page.getByRole('list', { name: 'Cart items' })).toBeVisible()
    await expect(page.getByText(phoneName, { exact: false }).first()).toBeVisible()
    await expect(page.getByText(priceText, { exact: false }).first()).toBeVisible()

    const continueShopping = page.getByRole('link', { name: 'Continue shopping' })
    await continueShopping.click()
    await expect(page).toHaveURL('/')
  })

  test('removing an item empties the cart', async ({ page }) => {
    await seedCart(page, [
      {
        id: phone.id,
        brand: 'Napptilus',
        name: 'Seeded Phone',
        color: {
          name: 'Midnight',
          hexCode: '#111111',
          imageUrl:
            'https://prueba-tecnica-api-tienda-moviles.onrender.com/images/SMG-S24U-titanium-violet.webp',
        },
        storage: { capacity: '256GB', price: 999 },
        quantity: 1,
      },
    ])
    await page.goto('/cart')

    await expect(page.getByRole('heading', { name: 'Cart (1)', level: 1 })).toBeVisible()
    await expect(page.getByText('Seeded Phone')).toBeVisible()

    await page.getByRole('button', { name: /Remove .* from cart/ }).click()

    await expect(page.getByText('Seeded Phone')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Cart (0)', level: 1 })).toBeVisible()
    await expect(page.getByRole('list', { name: 'Cart items' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Continue shopping' })).toBeVisible()
  })
})
