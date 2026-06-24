import { ROUTES } from '@/shared/config/routes'
import { CartProvider, useCart } from '@/shared/context/CartContext'
import type { ColorOption, StorageOption } from '@/shared/lib/types/domain'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import '@/test/mocks/next/link'

import { Bag } from './Bag'

const color: ColorOption = { name: 'Black', hexCode: '#000', imageUrl: 'https://pixel/phone.png' }
const storage: StorageOption = { capacity: '256 GB', price: 999 }

function AddToCartButton() {
  const { addToCart } = useCart()
  return (
    <button
      type="button"
      onClick={() =>
        addToCart({ id: 'AP15P', brand: 'Apple', name: 'iPhone 15 Pro', color, storage })
      }
    >
      add item
    </button>
  )
}

function renderBag() {
  return render(
    <CartProvider>
      <Bag />
      <AddToCartButton />
    </CartProvider>
  )
}

describe('Bag', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders a link to /cart', () => {
    render(
      <CartProvider>
        <Bag />
      </CartProvider>
    )
    const link = screen.getByRole('link', { name: /shopping bag, 0 items/i })
    expect(link).toHaveAttribute('href', ROUTES.cart)
  })

  it('shows a zero count when the cart is empty', () => {
    render(
      <CartProvider>
        <Bag />
      </CartProvider>
    )
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('updates the count after an item is added', async () => {
    const user = userEvent.setup()
    renderBag()
    await user.click(screen.getByRole('button', { name: 'add item' }))
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /shopping bag, 1 items/i })).toBeInTheDocument()
  })

  it('switches the SVG path when the cart goes from empty to non-empty', async () => {
    const user = userEvent.setup()
    const { container } = renderBag()
    const path = () => container.querySelector('path')!
    const emptyPath = path().getAttribute('d')
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'add item' }))
    })
    expect(path().getAttribute('d')).not.toEqual(emptyPath)
  })
})
