import { CatalogClient } from '@/features/catalog/components/CatalogClient/CatalogClient'
import { FETCH_INITIAL_COUNT } from '@/features/catalog/constants'
import { fetchPhones } from '@/shared/lib/api'
import { phoneFixtures } from '@/test/fixtures'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HomePage from './page'

vi.mock('@/shared/lib/api', () => ({
  fetchPhones: vi.fn(),
}))

vi.mock('@/features/catalog/components/CatalogClient/CatalogClient', () => ({
  CatalogClient: vi.fn(({ initialPhones }: { initialPhones: { id: string }[] }) => (
    <div data-testid="catalog-client" data-count={initialPhones.length}>
      {initialPhones.map((phone) => (
        <span key={phone.id} data-testid="phone-id">
          {phone.id}
        </span>
      ))}
    </div>
  )),
}))

const mockedFetchPhones = vi.mocked(fetchPhones)
const mockedCatalogClient = vi.mocked(CatalogClient)

describe('HomePage (catalog)', () => {
  beforeEach(() => {
    mockedFetchPhones.mockReset()
    mockedCatalogClient.mockClear()
    mockedFetchPhones.mockResolvedValue(phoneFixtures)
  })

  it('forwards the search term from searchParams to fetchPhones with FETCH_INITIAL_COUNT', async () => {
    await HomePage({ searchParams: Promise.resolve({ s: 'galaxy' }) })
    expect(mockedFetchPhones).toHaveBeenCalledTimes(1)
    expect(mockedFetchPhones).toHaveBeenCalledWith({
      search: 'galaxy',
      limit: FETCH_INITIAL_COUNT,
    })
  })

  it('forwards undefined when the search param is missing', async () => {
    await HomePage({ searchParams: Promise.resolve({}) })
    expect(mockedFetchPhones).toHaveBeenCalledWith({
      search: undefined,
      limit: FETCH_INITIAL_COUNT,
    })
  })

  it('forwards undefined when searchParams is empty', async () => {
    await HomePage({ searchParams: Promise.resolve({}) })
    expect(mockedFetchPhones.mock.calls[0]?.[0]?.search).toBeUndefined()
  })

  it('awaits searchParams before calling fetchPhones', async () => {
    const searchParams = new Promise<{ s?: string }>((resolve) => {
      setTimeout(() => resolve({ s: 'late' }), 0)
    })
    await HomePage({ searchParams })
    expect(mockedFetchPhones).toHaveBeenCalledWith({
      search: 'late',
      limit: FETCH_INITIAL_COUNT,
    })
  })

  it('deduplicates phones by id, preserving the first occurrence order', async () => {
    mockedFetchPhones.mockResolvedValue([
      phoneFixtures[0],
      phoneFixtures[1],
      phoneFixtures[0],
      phoneFixtures[2],
      phoneFixtures[1],
    ])
    render(await HomePage({ searchParams: Promise.resolve({}) }))
    const ids = screen.getAllByTestId('phone-id').map((node) => node.textContent)
    expect(ids).toEqual([phoneFixtures[0].id, phoneFixtures[1].id, phoneFixtures[2].id])
    expect(screen.getByTestId('catalog-client')).toHaveAttribute('data-count', '3')
  })

  it('passes the deduplicated list to CatalogClient', async () => {
    mockedFetchPhones.mockResolvedValue([phoneFixtures[1], phoneFixtures[1], phoneFixtures[0]])
    render(await HomePage({ searchParams: Promise.resolve({}) }))
    expect(mockedCatalogClient).toHaveBeenCalledTimes(1)
    const passed = mockedCatalogClient.mock.calls[0]?.[0]?.initialPhones ?? []
    expect(passed.map((p) => p.id)).toEqual([phoneFixtures[1].id, phoneFixtures[0].id])
  })

  it('forwards an empty list when the API returns nothing', async () => {
    mockedFetchPhones.mockResolvedValue([])
    render(await HomePage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByTestId('catalog-client')).toHaveAttribute('data-count', '0')
    expect(screen.queryByTestId('phone-id')).toBeNull()
    expect(mockedCatalogClient.mock.calls[0]?.[0]?.initialPhones).toEqual([])
  })

  it('renders the deduplicated list in the original API order', async () => {
    mockedFetchPhones.mockResolvedValue([phoneFixtures[2], phoneFixtures[0], phoneFixtures[1]])
    render(await HomePage({ searchParams: Promise.resolve({}) }))
    const ids = screen.getAllByTestId('phone-id').map((node) => node.textContent)
    expect(ids).toEqual([phoneFixtures[2].id, phoneFixtures[0].id, phoneFixtures[1].id])
  })
})
