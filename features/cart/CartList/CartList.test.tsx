import { CartItem } from '@/features/cart/CartItem/CartItem'
import { cartItemFixtures } from '@/test/fixtures'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '@/test/mocks/next/image'
import '@/test/mocks/next/link'

import { CartList } from './CartList'

vi.mock('@/features/cart/CartItem/CartItem', () => ({
  CartItem: vi.fn(({ item, onRemove }) => (
    <li data-testid="cart-item" data-item-id={item.id}>
      <span data-testid="cart-item-name">{item.name}</span>
      <button
        type="button"
        onClick={() => onRemove(item.id, item.color.name, item.storage.capacity)}
      >
        Remove {item.name}
      </button>
    </li>
  )),
}))

const mockedCartItem = vi.mocked(CartItem)

describe('CartList', () => {
  beforeEach(() => {
    mockedCartItem.mockClear()
  })

  it('renders a list with the correct role and aria-label', () => {
    render(<CartList items={[]} onRemove={() => {}} />)
    expect(screen.getByRole('list', { name: 'Cart items' })).toBeInTheDocument()
  })

  it('renders a CartItem for each entry', () => {
    render(<CartList items={cartItemFixtures} onRemove={() => {}} />)
    const list = screen.getByRole('list', { name: 'Cart items' })
    const items = within(list).getAllByTestId('cart-item')
    expect(items).toHaveLength(cartItemFixtures.length)
    for (const [index, item] of items.entries()) {
      expect(item).toHaveAttribute('data-item-id', cartItemFixtures[index]?.id)
    }
  })

  it('forwards the same onRemove callback to every CartItem', () => {
    const onRemove = vi.fn()
    render(<CartList items={cartItemFixtures} onRemove={onRemove} />)
    expect(mockedCartItem).toHaveBeenCalledTimes(cartItemFixtures.length)
    for (const call of mockedCartItem.mock.calls) {
      expect(call[0]?.onRemove).toBe(onRemove)
    }
  })

  it('triggers the right onRemove(id, color, storage) per child', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<CartList items={cartItemFixtures} onRemove={onRemove} />)
    const target = cartItemFixtures[1]
    await user.click(screen.getByRole('button', { name: `Remove ${target?.name}` }))
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith(target?.id, target?.color.name, target?.storage.capacity)
  })

  it('renders nothing inside the list when items is empty', () => {
    render(<CartList items={[]} onRemove={() => {}} />)
    const list = screen.getByRole('list', { name: 'Cart items' })
    expect(within(list).queryByTestId('cart-item')).toBeNull()
  })

  it('treats same id with different color or storage as separate items', () => {
    const shared = cartItemFixtures[0]
    const items = [
      shared,
      { ...shared, color: { ...shared.color, name: 'Blue' } },
      { ...shared, storage: { ...shared.storage, capacity: '512 GB' } },
    ]
    render(<CartList items={items} onRemove={() => {}} />)
    expect(screen.getAllByTestId('cart-item')).toHaveLength(3)
  })
})
