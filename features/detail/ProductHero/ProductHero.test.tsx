import { CartProvider, useCart } from '@/shared/context/CartContext'
import type { Phone } from '@/shared/lib/types/domain'
import { phoneDetailFixtures, storageOptionFixtures } from '@/test/fixtures'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import '@/test/mocks/next/image'

import { ProductHero } from './ProductHero'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

const pickPhone = (overrides: Partial<Phone> = {}): Phone => ({
  ...phoneDetailFixtures,
  ...overrides,
})

const renderHeroWithSharedCart = (phone: Phone) => {
  let captured: ReturnType<typeof useCart> | null = null
  const HeroInProvider = () => {
    captured = useCart()
    return <ProductHero phone={phone} />
  }
  const utils = render(
    <CartProvider>
      <HeroInProvider />
    </CartProvider>
  )
  return { ...utils, getCart: () => captured as ReturnType<typeof useCart> }
}

describe('ProductHero', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the phone name uppercased as the hero title', () => {
    render(<ProductHero phone={pickPhone()} />, { wrapper })
    expect(screen.getByRole('heading', { level: 1, name: 'IPHONE 15 PRO' })).toBeInTheDocument()
  })

  it('renders the base price prefixed with "from" when no storage is selected', () => {
    render(<ProductHero phone={pickPhone()} />, { wrapper })
    expect(screen.getByText(/from\s+1099 EUR/)).toBeInTheDocument()
  })

  it('shows the storage price without the "from" prefix once a storage is selected', async () => {
    const user = userEvent.setup()
    render(<ProductHero phone={pickPhone()} />, { wrapper })
    await user.click(screen.getByRole('radio', { name: '256 GB' }))
    expect(screen.getByText(/^1199 EUR$/)).toBeInTheDocument()
    expect(screen.queryByText(/from/)).not.toBeInTheDocument()
  })

  it('disables the Add button until both a color and a storage are selected', async () => {
    const user = userEvent.setup()
    render(<ProductHero phone={pickPhone()} />, { wrapper })
    const add = screen.getByRole('button', { name: /add/i })
    expect(add).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: '256 GB' }))
    expect(add).toBeEnabled()
  })

  it('uses the first color image and the first color name in the gallery alt by default', () => {
    render(<ProductHero phone={pickPhone()} />, { wrapper })
    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('src', 'https://example.com/black.png')
    expect(image).toHaveAttribute('alt', 'Apple iPhone 15 Pro in Black Titanium')
  })

  it('swaps the gallery image when a different color is selected', async () => {
    const user = userEvent.setup()
    render(<ProductHero phone={pickPhone()} />, { wrapper })
    await user.click(screen.getByRole('radio', { name: 'Blue Titanium' }))
    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('src', 'https://example.com/blue.png')
    expect(image).toHaveAttribute('alt', 'Apple iPhone 15 Pro in Blue Titanium')
  })

  it('falls back to the phone image when there are no color options', () => {
    render(<ProductHero phone={pickPhone({ colorOptions: [] })} />, { wrapper })
    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('src', phoneDetailFixtures.imageUrl)
  })

  it('keeps the gallery priority flag set so the hero image is eager', () => {
    render(<ProductHero phone={pickPhone()} />, { wrapper })
    expect(screen.getByTestId('next-image')).toHaveAttribute('data-priority', 'true')
  })

  it('adds the currently selected color+storage to the cart when Add is clicked', async () => {
    const user = userEvent.setup()
    const { getCart } = renderHeroWithSharedCart(pickPhone())

    await user.click(screen.getByRole('radio', { name: '512 GB' }))
    await user.click(screen.getByRole('radio', { name: 'Natural Titanium' }))
    await user.click(screen.getByRole('button', { name: /add/i }))

    const cart = getCart()
    expect(cart.items).toHaveLength(1)
    expect(cart.count).toBe(1)
    expect(cart.items[0]).toMatchObject({
      id: 'AP15P',
      brand: 'Apple',
      name: 'iPhone 15 Pro',
      color: {
        name: 'Natural Titanium',
        hexCode: '#ACA49B',
        imageUrl: 'https://example.com/natural.png',
      },
      storage: storageOptionFixtures[2],
    })
  })

  it('does not add to cart when Add is clicked before storage is selected', async () => {
    const user = userEvent.setup()
    const { getCart } = renderHeroWithSharedCart(pickPhone())

    await user.click(screen.getByRole('button', { name: /add/i }))

    expect(getCart().items).toHaveLength(0)
    expect(getCart().count).toBe(0)
  })

  it('increments the existing cart line when the same phone/color/storage is added twice', async () => {
    const user = userEvent.setup()
    const { getCart } = renderHeroWithSharedCart(pickPhone())

    act(() => {
      getCart().addToCart({
        id: 'AP15P',
        brand: 'Apple',
        name: 'iPhone 15 Pro',
        color: phoneDetailFixtures.colorOptions[0]!,
        storage: phoneDetailFixtures.storageOptions[0]!,
      })
    })

    await user.click(screen.getByRole('radio', { name: '128 GB' }))
    await user.click(screen.getByRole('button', { name: /add/i }))

    expect(getCart().items).toHaveLength(1)
    expect(getCart().count).toBe(2)
  })

  it('persists the new cart line to localStorage when Add is clicked', async () => {
    const user = userEvent.setup()
    renderHeroWithSharedCart(pickPhone())

    await user.click(screen.getByRole('radio', { name: '128 GB' }))
    await user.click(screen.getByRole('button', { name: /add/i }))

    const stored = window.localStorage.getItem('zara_shopping_cart')
    expect(stored).toContain('AP15P')
    expect(stored).toContain('Black Titanium')
  })

  it('renders the Color and Storage radiogroups with the correct accessible labels', () => {
    render(<ProductHero phone={pickPhone()} />, { wrapper })
    expect(screen.getByRole('radiogroup', { name: 'Storage' })).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Color' })).toBeInTheDocument()
  })

  it('marks the first color as the default selected swatch', () => {
    render(<ProductHero phone={pickPhone()} />, { wrapper })
    const group = screen.getByRole('radiogroup', { name: 'Color' })
    const black = within(group).getByRole('radio', { name: 'Black Titanium' })
    const blue = within(group).getByRole('radio', { name: 'Blue Titanium' })
    expect(black).toHaveAttribute('aria-checked', 'true')
    expect(blue).toHaveAttribute('aria-checked', 'false')
  })

  it('uses the phone.basePrice and keeps the Add button disabled when there are no storage options', () => {
    render(<ProductHero phone={pickPhone({ storageOptions: [] })} />, { wrapper })
    expect(screen.getByText(/from\s+1099 EUR/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })

  it('keeps the Add button disabled when colors are missing even if a storage is selected', async () => {
    const user = userEvent.setup()
    render(
      <ProductHero
        phone={pickPhone({
          colorOptions: [],
          storageOptions: storageOptionFixtures,
        })}
      />,
      { wrapper }
    )
    await user.click(screen.getByRole('radio', { name: '128 GB' }))
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })
})
