import { cartItemFixtures } from '@/test/fixtures'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '@/test/mocks/next/image'
import '@/test/mocks/next/link'

import { CartItem } from './CartItem'

describe('CartItem', () => {
  const [firstItem] = cartItemFixtures
  const onRemove = vi.fn()

  beforeEach(() => {
    onRemove.mockClear()
  })

  it('renders as a list item', () => {
    const { container } = render(<CartItem item={firstItem} onRemove={onRemove} />)
    const listItem = container.querySelector('li')
    expect(listItem).not.toBeNull()
  })

  it('renders two links pointing to the phone detail route', () => {
    render(<CartItem item={firstItem} onRemove={onRemove} />)
    const links = screen.getAllByRole('link', { name: new RegExp(firstItem.name) })
    expect(links.length).toBeGreaterThanOrEqual(2)
    for (const link of links) {
      expect(link).toHaveAttribute('href', `/phone/${encodeURIComponent(firstItem.id)}`)
    }
  })

  it('renders the image with the brand+name+color alt text and the color image src', () => {
    render(<CartItem item={firstItem} onRemove={onRemove} />)
    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute(
      'alt',
      `${firstItem.brand} ${firstItem.name} in ${firstItem.color.name}`
    )
    expect(image).toHaveAttribute('src', firstItem.color.imageUrl)
  })

  it('forwards the sizes attribute to next/image', () => {
    render(<CartItem item={firstItem} onRemove={onRemove} />)
    expect(screen.getByTestId('next-image')).toHaveAttribute(
      'data-sizes',
      '(max-width: 767px) 140px, 200px'
    )
  })

  it('renders the phone name', () => {
    render(<CartItem item={firstItem} onRemove={onRemove} />)
    expect(screen.getByText(firstItem.name)).toBeInTheDocument()
  })

  it('renders the config line with capacity and color name', () => {
    render(<CartItem item={firstItem} onRemove={onRemove} />)
    const config = screen.getByText((_content, element) => {
      if (!element) return false
      return (
        element.textContent === `${firstItem.storage.capacity} | ${firstItem.color.name}` &&
        element.tagName === 'P'
      )
    })
    expect(config).toBeInTheDocument()
  })

  it('does not render the quantity multiplier when quantity is 1', () => {
    const item = { ...firstItem, quantity: 1 }
    render(<CartItem item={item} onRemove={onRemove} />)
    const listItem = screen.getByRole('listitem')
    expect(within(listItem).queryByText(/×\s*1/)).toBeNull()
  })

  it('renders the quantity multiplier when quantity is greater than 1', () => {
    const item = { ...firstItem, quantity: 3 }
    render(<CartItem item={item} onRemove={onRemove} />)
    expect(
      screen.getByText((content, element) => {
        if (!element) return false
        return element.tagName === 'P' && /×\s*3/.test(content)
      })
    ).toBeInTheDocument()
  })

  it('formats the unit price', () => {
    render(<CartItem item={firstItem} onRemove={onRemove} />)
    expect(screen.getByText(`${firstItem.storage.price} EUR`)).toBeInTheDocument()
  })

  it('shows the line total when quantity is greater than 1', () => {
    const item = { ...firstItem, quantity: 2 }
    render(<CartItem item={item} onRemove={onRemove} />)
    const expected = `${item.storage.price} EUR (${item.storage.price * item.quantity} EUR total)`
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('renders the remove button with the brand+name aria label', () => {
    render(<CartItem item={firstItem} onRemove={onRemove} />)
    expect(
      screen.getByRole('button', {
        name: `Remove ${firstItem.brand} ${firstItem.name} from cart`,
      })
    ).toBeInTheDocument()
  })

  it('calls onRemove with id, color name and storage capacity when the remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<CartItem item={firstItem} onRemove={onRemove} />)
    await user.click(
      screen.getByRole('button', {
        name: `Remove ${firstItem.brand} ${firstItem.name} from cart`,
      })
    )
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith(
      firstItem.id,
      firstItem.color.name,
      firstItem.storage.capacity
    )
  })

  it('escapes special characters in the id when building the detail route', () => {
    const item = { ...firstItem, id: 'A/B C' }
    render(<CartItem item={item} onRemove={onRemove} />)
    const links = screen.getAllByRole('link')
    const expectedHref = `/phone/${encodeURIComponent('A/B C')}`
    expect(links.length).toBeGreaterThanOrEqual(2)
    for (const link of links) {
      expect(link).toHaveAttribute('href', expectedHref)
    }
  })
})
