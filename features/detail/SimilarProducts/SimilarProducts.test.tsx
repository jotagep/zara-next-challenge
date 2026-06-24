import { ROUTES } from '@/shared/config/routes'
import { emptyPhoneFixtures, phoneFixtures } from '@/test/fixtures'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '@/test/mocks/next/image'
import '@/test/mocks/next/link'

import { SimilarProducts } from './SimilarProducts'

describe('SimilarProducts', () => {
  it('renders nothing when the products array is empty', () => {
    const { container } = render(<SimilarProducts products={emptyPhoneFixtures} />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('region', { name: /similar items/i })).not.toBeInTheDocument()
  })

  it('renders a region labelled "Similar items" with a heading when there are products', () => {
    render(<SimilarProducts products={phoneFixtures} />)
    const region = screen.getByRole('region', { name: /similar items/i })
    expect(region).toBeInTheDocument()
    expect(
      within(region).getByRole('heading', { level: 2, name: 'Similar items' })
    ).toBeInTheDocument()
  })

  it('renders a card per product inside the carousel', () => {
    render(<SimilarProducts products={phoneFixtures} />)
    const list = screen.getByRole('list', { name: 'Similar products carousel' })
    expect(list).toBeInTheDocument()
    expect(within(list).getAllByRole('listitem')).toHaveLength(phoneFixtures.length)
  })

  it('renders a link to each product detail page', () => {
    render(<SimilarProducts products={phoneFixtures} />)
    for (const product of phoneFixtures) {
      expect(screen.getByRole('link', { name: new RegExp(product.name) })).toHaveAttribute(
        'href',
        ROUTES.phone(product.id)
      )
    }
  })

  it('renders the brand, name and formatted price for each card', () => {
    render(<SimilarProducts products={phoneFixtures} />)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
    expect(screen.getByText('1099 EUR')).toBeInTheDocument()
  })
})
