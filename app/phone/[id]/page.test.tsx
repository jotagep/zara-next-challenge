import { BackLink } from '@/features/detail/BackLink/BackLink'
import { ProductHero } from '@/features/detail/ProductHero/ProductHero'
import { SimilarProducts } from '@/features/detail/SimilarProducts/SimilarProducts'
import { Specifications } from '@/features/detail/Specifications/Specifications'
import { fetchPhoneById } from '@/shared/lib/api'
import { phoneDetailFixtures } from '@/test/fixtures'
import { notFoundMock, resetNav } from '@/test/mocks/next/navigation'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PhoneDetailPage, { generateMetadata } from './page'

vi.mock('@/shared/lib/api', () => ({
  fetchPhoneById: vi.fn(),
}))

vi.mock('@/features/detail/BackLink/BackLink', () => ({
  BackLink: vi.fn(() => <div data-testid="back-link" />),
}))

vi.mock('@/features/detail/ProductHero/ProductHero', () => ({
  ProductHero: vi.fn(({ phone }: { phone: { id: string } }) => (
    <div data-testid="product-hero" data-phone-id={phone.id} />
  )),
}))

vi.mock('@/features/detail/Specifications/Specifications', () => ({
  Specifications: vi.fn(({ specs }: { specs: { brand: string } }) => (
    <div data-testid="specifications" data-brand={specs.brand} />
  )),
}))

vi.mock('@/features/detail/SimilarProducts/SimilarProducts', () => ({
  SimilarProducts: vi.fn(({ products }: { products: { id: string }[] }) => (
    <ul data-testid="similar-products" data-count={products.length}>
      {products.map((p) => (
        <li key={p.id}>{p.id}</li>
      ))}
    </ul>
  )),
}))

const mockedFetchPhoneById = vi.mocked(fetchPhoneById)
const mockedBackLink = vi.mocked(BackLink)
const mockedProductHero = vi.mocked(ProductHero)
const mockedSpecifications = vi.mocked(Specifications)
const mockedSimilarProducts = vi.mocked(SimilarProducts)

describe('PhoneDetailPage', () => {
  beforeEach(() => {
    resetNav()
    mockedFetchPhoneById.mockReset()
    mockedBackLink.mockClear()
    mockedProductHero.mockClear()
    mockedSpecifications.mockClear()
    mockedSimilarProducts.mockClear()
  })

  describe('render', () => {
    it('awaits params and calls fetchPhoneById with the resolved id', async () => {
      mockedFetchPhoneById.mockResolvedValue(phoneDetailFixtures)
      await PhoneDetailPage({ params: Promise.resolve({ id: 'AP15P' }) })
      expect(mockedFetchPhoneById).toHaveBeenCalledTimes(1)
      expect(mockedFetchPhoneById).toHaveBeenCalledWith('AP15P')
    })

    it('renders BackLink, ProductHero, Specifications and SimilarProducts when the API returns a phone', async () => {
      mockedFetchPhoneById.mockResolvedValue(phoneDetailFixtures)
      render(await PhoneDetailPage({ params: Promise.resolve({ id: 'AP15P' }) }))
      expect(screen.getByTestId('back-link')).toBeInTheDocument()
      expect(screen.getByTestId('product-hero')).toHaveAttribute(
        'data-phone-id',
        phoneDetailFixtures.id
      )
      expect(screen.getByTestId('specifications')).toHaveAttribute(
        'data-brand',
        phoneDetailFixtures.specs.brand
      )
      expect(screen.getByTestId('similar-products')).toHaveAttribute(
        'data-count',
        String(phoneDetailFixtures.similarProducts.length)
      )
    })

    it('forwards the right phone to ProductHero and the right specs to Specifications', async () => {
      mockedFetchPhoneById.mockResolvedValue(phoneDetailFixtures)
      render(await PhoneDetailPage({ params: Promise.resolve({ id: 'AP15P' }) }))
      expect(mockedProductHero.mock.calls[0]?.[0]?.phone).toBe(phoneDetailFixtures)
      expect(mockedSpecifications.mock.calls[0]?.[0]?.specs).toBe(phoneDetailFixtures.specs)
      expect(mockedSimilarProducts.mock.calls[0]?.[0]?.products).toBe(
        phoneDetailFixtures.similarProducts
      )
    })

    it('awaits params before calling fetchPhoneById', async () => {
      mockedFetchPhoneById.mockResolvedValue(phoneDetailFixtures)
      const params = new Promise<{ id: string }>((resolve) => {
        setTimeout(() => resolve({ id: 'LATE' }), 0)
      })
      await PhoneDetailPage({ params })
      expect(mockedFetchPhoneById).toHaveBeenCalledWith('LATE')
    })
  })

  describe('not found', () => {
    it('calls notFound() when fetchPhoneById throws', async () => {
      mockedFetchPhoneById.mockRejectedValue(new Error('not found'))
      await expect(PhoneDetailPage({ params: Promise.resolve({ id: 'MISSING' }) })).rejects.toThrow(
        'NEXT_NOT_FOUND'
      )
      expect(notFoundMock).toHaveBeenCalledTimes(1)
    })

    it('does not render the phone sections when notFound() fires', async () => {
      mockedFetchPhoneById.mockRejectedValue(new Error('not found'))
      try {
        const element = await PhoneDetailPage({
          params: Promise.resolve({ id: 'MISSING' }),
        })
        render(element)
      } catch {
        // notFound throws — the page is not rendered
      }
      expect(screen.queryByTestId('product-hero')).toBeNull()
      expect(screen.queryByTestId('specifications')).toBeNull()
      expect(screen.queryByTestId('similar-products')).toBeNull()
    })
  })
})

describe('generateMetadata', () => {
  beforeEach(() => {
    mockedFetchPhoneById.mockReset()
  })

  it('returns the brand/name title and description on success', async () => {
    mockedFetchPhoneById.mockResolvedValue(phoneDetailFixtures)
    const meta = await generateMetadata({ params: Promise.resolve({ id: 'AP15P' }) })
    expect(mockedFetchPhoneById).toHaveBeenCalledWith('AP15P')
    expect(meta).toEqual({
      title: `${phoneDetailFixtures.name} - ${phoneDetailFixtures.brand}`,
      description: phoneDetailFixtures.description,
    })
  })

  it('returns the fallback "Phone not found" title when fetchPhoneById throws', async () => {
    mockedFetchPhoneById.mockRejectedValue(new Error('boom'))
    const meta = await generateMetadata({ params: Promise.resolve({ id: 'BAD' }) })
    expect(meta).toEqual({ title: 'Phone not found' })
  })

  it('awaits params before calling fetchPhoneById', async () => {
    mockedFetchPhoneById.mockResolvedValue(phoneDetailFixtures)
    const params = new Promise<{ id: string }>((resolve) => {
      setTimeout(() => resolve({ id: 'LATE' }), 0)
    })
    await generateMetadata({ params })
    expect(mockedFetchPhoneById).toHaveBeenCalledWith('LATE')
  })
})
