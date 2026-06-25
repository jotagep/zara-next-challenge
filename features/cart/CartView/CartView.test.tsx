import Link from 'next/link'

import { CartList } from '@/features/cart/CartList/CartList'
import { CartSummary } from '@/features/cart/CartSummary/CartSummary'
import { ROUTES } from '@/shared/config/routes'
import type { CartItem } from '@/shared/context/CartContext'
import { CartProvider, useCart } from '@/shared/context/CartContext'
import { cartItemFixtures } from '@/test/fixtures'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '@/test/mocks/next/image'
import '@/test/mocks/next/link'

import { CartView } from './CartView'

vi.mock('@/features/cart/CartList/CartList', () => ({
  CartList: vi.fn(({ items, onRemove }) => (
    <ul data-testid="cart-list" data-count={items.length}>
      {items.map((item: CartItem) => (
        <li key={`${item.id}-${item.color.name}-${item.storage.capacity}`}>
          <span data-testid="cart-list-name">{item.name}</span>
          <button
            type="button"
            aria-label={`Remove ${item.brand} ${item.name}`}
            onClick={() => onRemove(item.id, item.color.name, item.storage.capacity)}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  )),
}))

vi.mock('@/features/cart/CartSummary/CartSummary', () => ({
  CartSummary: vi.fn(({ total, empty }: { total: number; empty?: boolean }) => (
    <footer data-testid="cart-summary" data-total={total} data-empty={String(Boolean(empty))}>
      {empty ? <Link href="/">Continue shopping</Link> : <>Cart summary — total: {total} EUR</>}
    </footer>
  )),
}))

const mockedCartList = vi.mocked(CartList)
const mockedCartSummary = vi.mocked(CartSummary)

const CartViewHarness = () => (
  <CartProvider>
    <CartView />
    <CartProbe />
  </CartProvider>
)

const CartProbe = () => {
  const { items, addToCart } = useCart()
  return (
    <div>
      <p data-testid="probe-count">{items.length}</p>
      <button
        type="button"
        onClick={() =>
          addToCart({
            id: 'PROBE1',
            brand: 'Probe',
            name: 'Probe Phone',
            color: { name: 'Black', hexCode: '#000000', imageUrl: 'https://example.com/p.png' },
            storage: { capacity: '128 GB', price: 100 },
          })
        }
      >
        add
      </button>
    </div>
  )
}

const renderView = () => render(<CartViewHarness />)

describe('CartView', () => {
  beforeEach(() => {
    window.localStorage.clear()
    mockedCartList.mockClear()
    mockedCartSummary.mockClear()
  })

  it('renders a section with the shopping cart aria-label and an h1 heading', () => {
    renderView()
    const section = screen.getByRole('region', { name: 'Shopping cart' })
    expect(section.tagName).toBe('SECTION')
    const heading = within(section).getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  describe('empty state', () => {
    it('shows "Cart (0)" when there are no items', () => {
      renderView()
      expect(screen.getByRole('heading', { level: 1, name: 'Cart (0)' })).toBeInTheDocument()
    })

    it('does not render CartList', () => {
      renderView()
      expect(screen.queryByTestId('cart-list')).toBeNull()
      expect(mockedCartList).not.toHaveBeenCalled()
    })

    it('renders CartSummary in empty mode with total=0', () => {
      renderView()
      const summary = screen.getByTestId('cart-summary')
      expect(summary).toHaveAttribute('data-empty', 'true')
      expect(summary).toHaveAttribute('data-total', '0')
    })

    it('shows a "Continue shopping" link pointing to the home route', () => {
      renderView()
      const link = screen.getByRole('link', { name: 'Continue shopping' })
      expect(link).toHaveAttribute('href', ROUTES.home)
    })
  })

  describe('filled state', () => {
    const renderWithItems = () => {
      window.localStorage.setItem('zara_shopping_cart', JSON.stringify(cartItemFixtures))
      return renderView()
    }

    it('shows "Cart (N)" where N is the total quantity (not the line count)', () => {
      const expectedCount = cartItemFixtures.reduce((sum, item) => sum + item.quantity, 0)
      renderWithItems()
      expect(
        screen.getByRole('heading', { level: 1, name: `Cart (${expectedCount})` })
      ).toBeInTheDocument()
    })

    it('renders CartList with the items and CartSummary with the computed total', () => {
      renderWithItems()
      const list = screen.getByTestId('cart-list')
      expect(list).toHaveAttribute('data-count', String(cartItemFixtures.length))
      const expectedTotal = cartItemFixtures.reduce(
        (sum, item) => sum + item.storage.price * item.quantity,
        0
      )
      const summary = screen.getByTestId('cart-summary')
      expect(summary).toHaveAttribute('data-total', String(expectedTotal))
    })

    it('does not render the empty-state Continue shopping link', () => {
      renderWithItems()
      expect(screen.queryByRole('link', { name: 'Continue shopping' })).toBeNull()
    })

    it('forwards removeFromCart to CartList — clicking remove drops the line and the count updates', async () => {
      const user = userEvent.setup()
      window.localStorage.setItem('zara_shopping_cart', JSON.stringify(cartItemFixtures))
      renderView()

      const initialCount = cartItemFixtures.reduce((sum, item) => sum + item.quantity, 0)
      expect(
        screen.getByRole('heading', { level: 1, name: `Cart (${initialCount})` })
      ).toBeInTheDocument()

      const target = cartItemFixtures[0]
      await user.click(
        screen.getByRole('button', { name: `Remove ${target?.brand} ${target?.name}` })
      )

      const remainingCount = initialCount - (target?.quantity ?? 0)
      expect(
        screen.getByRole('heading', { level: 1, name: `Cart (${remainingCount})` })
      ).toBeInTheDocument()
      expect(screen.queryByText(target?.name ?? '')).toBeNull()
    })

    it('switches from filled state to empty state when the last item is removed', async () => {
      const user = userEvent.setup()
      const single = [cartItemFixtures[0]]
      window.localStorage.setItem('zara_shopping_cart', JSON.stringify(single))
      renderView()

      await user.click(
        screen.getByRole('button', {
          name: `Remove ${single[0]?.brand} ${single[0]?.name}`,
        })
      )

      expect(screen.getByRole('heading', { level: 1, name: 'Cart (0)' })).toBeInTheDocument()
      expect(screen.queryByTestId('cart-list')).toBeNull()
      const summary = screen.getByTestId('cart-summary')
      expect(summary).toHaveAttribute('data-empty', 'true')
      expect(screen.getByRole('link', { name: 'Continue shopping' })).toHaveAttribute(
        'href',
        ROUTES.home
      )
    })
  })

  describe('reactivity through the context', () => {
    it('reflects additions from elsewhere in the tree', async () => {
      const user = userEvent.setup()
      renderView()
      expect(screen.getByRole('heading', { level: 1, name: 'Cart (0)' })).toBeInTheDocument()
      expect(screen.queryByTestId('cart-list')).toBeNull()

      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByRole('heading', { level: 1, name: 'Cart (1)' })).toBeInTheDocument()
      expect(screen.getByTestId('cart-list')).toBeInTheDocument()
    })
  })
})
