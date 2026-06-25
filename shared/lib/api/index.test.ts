import type { ApiPhoneDetail } from '@/shared/lib/types/api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiFetch } from './apiClient'
import { fetchPhoneById, fetchPhones } from './index'

vi.mock('./apiClient', () => ({
  apiFetch: vi.fn(),
}))

const mockedApiFetch = vi.mocked(apiFetch)

const EMPTY_PHONE_DTO: ApiPhoneDetail = {
  id: 'AP15P',
  brand: 'Apple',
  name: 'iPhone 15 Pro',
  description: 'desc',
  basePrice: 1099,
  rating: 4.6,
  imageUrl: 'https://cdn/iphone.png',
  specs: {
    screen: '6.1"',
    resolution: '2556x1179',
    processor: 'A17 Pro',
    mainCamera: '48 MP',
    selfieCamera: '12 MP',
    battery: '3274 mAh',
    os: 'iOS 17',
    screenRefreshRate: '120 Hz',
  },
  colorOptions: [],
  storageOptions: [],
  similarProducts: [],
}

describe('shared/lib/api index', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  describe('fetchPhones', () => {
    it('calls apiFetch at /products with no args by default', async () => {
      mockedApiFetch.mockResolvedValue([])
      await fetchPhones()
      expect(mockedApiFetch).toHaveBeenCalledTimes(1)
      expect(mockedApiFetch).toHaveBeenCalledWith(
        '/products',
        { search: undefined, limit: undefined, offset: undefined },
        {
          signal: undefined,
          next: { revalidate: 60 },
        }
      )
    })

    it('forwards search, limit and offset as query params', async () => {
      mockedApiFetch.mockResolvedValue([])
      await fetchPhones({ search: 'iphone', limit: 10, offset: 5 })
      expect(mockedApiFetch).toHaveBeenCalledWith(
        '/products',
        { search: 'iphone', limit: 10, offset: 5 },
        expect.objectContaining({ next: { revalidate: 60 } })
      )
    })

    it('forwards only the search param when limit/offset are omitted', async () => {
      mockedApiFetch.mockResolvedValue([])
      await fetchPhones({ search: 'galaxy' })
      const [, query] = mockedApiFetch.mock.calls[0] ?? []
      expect(query).toEqual({ search: 'galaxy', limit: undefined, offset: undefined })
    })

    it('forwards an AbortSignal through to apiFetch', async () => {
      mockedApiFetch.mockResolvedValue([])
      const controller = new AbortController()
      await fetchPhones({ search: 'x' }, { signal: controller.signal })
      const [, , options] = mockedApiFetch.mock.calls[0] ?? []
      expect(options).toEqual({
        signal: controller.signal,
        next: { revalidate: 60 },
      })
    })

    it('always sets next.revalidate to 60 seconds (Next.js cache)', async () => {
      mockedApiFetch.mockResolvedValue([])
      await fetchPhones()
      const [, , options] = mockedApiFetch.mock.calls[0] ?? []
      expect(options).toMatchObject({ next: { revalidate: 60 } })
    })

    it('maps the response array with mapPhoneListItem', async () => {
      const apiDto = {
        id: 'AP15P',
        brand: 'Apple',
        name: 'iPhone 15 Pro',
        basePrice: 1099,
        imageUrl: 'https://cdn/iphone.png',
      }
      mockedApiFetch.mockResolvedValue([apiDto])
      const result = await fetchPhones()
      expect(result).toEqual([
        {
          id: 'AP15P',
          brand: 'Apple',
          name: 'iPhone 15 Pro',
          basePrice: 1099,
          imageUrl: 'https://cdn/iphone.png',
        },
      ])
    })

    it('returns an empty array when the API returns an empty list', async () => {
      mockedApiFetch.mockResolvedValue([])
      const result = await fetchPhones()
      expect(result).toEqual([])
    })

    it('propagates errors from apiFetch', async () => {
      mockedApiFetch.mockRejectedValue(new Error('boom'))
      await expect(fetchPhones()).rejects.toThrow('boom')
    })
  })

  describe('fetchPhoneById', () => {
    it('calls apiFetch at /products/:id with no query params', async () => {
      mockedApiFetch.mockResolvedValue(EMPTY_PHONE_DTO)
      await fetchPhoneById('AP15P')
      expect(mockedApiFetch).toHaveBeenCalledTimes(1)
      expect(mockedApiFetch).toHaveBeenCalledWith('/products/AP15P', undefined, {
        signal: undefined,
        next: { revalidate: 60 },
      })
    })

    it('encodes the id into the path (URI-unsafe ids are handled by apiFetch)', async () => {
      mockedApiFetch.mockResolvedValue(EMPTY_PHONE_DTO)
      await fetchPhoneById('A/B C')
      const [path] = mockedApiFetch.mock.calls[0] ?? []
      expect(path).toBe('/products/A/B C')
    })

    it('forwards an AbortSignal through to apiFetch', async () => {
      mockedApiFetch.mockResolvedValue(EMPTY_PHONE_DTO)
      const controller = new AbortController()
      await fetchPhoneById('AP15P', { signal: controller.signal })
      const [, , options] = mockedApiFetch.mock.calls[0] ?? []
      expect(options).toEqual({
        signal: controller.signal,
        next: { revalidate: 60 },
      })
    })

    it('always sets next.revalidate to 60 seconds (Next.js cache)', async () => {
      mockedApiFetch.mockResolvedValue(EMPTY_PHONE_DTO)
      await fetchPhoneById('AP15P')
      const [, , options] = mockedApiFetch.mock.calls[0] ?? []
      expect(options).toMatchObject({ next: { revalidate: 60 } })
    })

    it('maps the response with mapPhone (imageUrl fallback to first color)', async () => {
      const apiDetail: ApiPhoneDetail = {
        ...EMPTY_PHONE_DTO,
        colorOptions: [{ name: 'Black', hexCode: '#000', imageUrl: 'https://cdn/black.png' }],
        storageOptions: [{ capacity: '256 GB', price: 1199 }],
      }
      mockedApiFetch.mockResolvedValue(apiDetail)
      const result = await fetchPhoneById('AP15P')
      expect(result.imageUrl).toBe('https://cdn/iphone.png')
      expect(result.specs.brand).toBe('Apple')
      expect(result.colorOptions[0]?.imageUrl).toBe('https://cdn/black.png')
    })

    it('propagates errors from apiFetch', async () => {
      mockedApiFetch.mockRejectedValue(new Error('404'))
      await expect(fetchPhoneById('MISSING')).rejects.toThrow('404')
    })
  })
})
