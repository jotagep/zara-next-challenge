import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const ORIGINAL_API_BASE_URL = process.env.API_BASE_URL
const ORIGINAL_X_API_KEY = process.env.X_API_KEY
const FALLBACK_BASE_URL = 'https://prueba-tecnica-api-tienda-moviles.onrender.com'

const makeResponse = (init: {
  ok: boolean
  status?: number
  statusText?: string
  body?: unknown
}) => ({
  ok: init.ok,
  status: init.status ?? (init.ok ? 200 : 500),
  statusText: init.statusText ?? (init.ok ? 'OK' : 'Internal Server Error'),
  json: vi.fn().mockResolvedValue(init.body ?? null),
})

const restoreEnv = () => {
  if (ORIGINAL_API_BASE_URL === undefined) {
    delete process.env.API_BASE_URL
  } else {
    process.env.API_BASE_URL = ORIGINAL_API_BASE_URL
  }
  if (ORIGINAL_X_API_KEY === undefined) {
    delete process.env.X_API_KEY
  } else {
    process.env.X_API_KEY = ORIGINAL_X_API_KEY
  }
}

let fetchMock: ReturnType<typeof vi.fn>
type ApiFetchFn = <T>(
  path: string,
  query: Record<string, string | number | undefined> | undefined,
  options?: {
    signal?: AbortSignal
    cache?: RequestCache
    next?: { revalidate?: number | false; tags?: string[] }
  }
) => Promise<T>
let apiFetch: ApiFetchFn

const loadApiFetch = async (): Promise<ApiFetchFn> => {
  vi.resetModules()
  const mod = await import('./apiClient')
  return mod.apiFetch as ApiFetchFn
}

describe('apiFetch', () => {
  beforeEach(async () => {
    fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof fetch
    restoreEnv()
    apiFetch = await loadApiFetch()
  })

  afterEach(() => {
    restoreEnv()
    vi.restoreAllMocks()
  })

  describe('URL building', () => {
    it('prepends the default base URL when the path is relative', async () => {
      delete process.env.API_BASE_URL
      apiFetch = await loadApiFetch()
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', undefined)
      const [url] = fetchMock.mock.calls[0] ?? []
      expect(url).toBe(`${FALLBACK_BASE_URL}/products`)
    })

    it('uses API_BASE_URL when provided', async () => {
      process.env.API_BASE_URL = 'https://api.example.test'
      apiFetch = await loadApiFetch()
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', undefined)
      const [url] = fetchMock.mock.calls[0] ?? []
      expect(url).toBe('https://api.example.test/products')
    })

    it('passes absolute URLs through unchanged', async () => {
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('https://other.example.test/foo', undefined)
      const [url] = fetchMock.mock.calls[0] ?? []
      expect(url).toBe('https://other.example.test/foo')
    })

    it('appends query params to the URL', async () => {
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', { search: 'iphone', limit: 20 })
      const [url] = fetchMock.mock.calls[0] ?? []
      expect(url).toBe(`${FALLBACK_BASE_URL}/products?search=iphone&limit=20`)
    })

    it('skips undefined and empty string query values', async () => {
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', { search: 'iphone', limit: undefined, offset: '' })
      const [url] = fetchMock.mock.calls[0] ?? []
      expect(url).toBe(`${FALLBACK_BASE_URL}/products?search=iphone`)
    })

    it('encodes special characters in query values', async () => {
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', { search: 'apple pro max' })
      const [url] = fetchMock.mock.calls[0] ?? []
      expect(url).toBe(`${FALLBACK_BASE_URL}/products?search=apple+pro+max`)
    })

    it('keeps 0 as a query value (only undefined and empty string are skipped)', async () => {
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', { limit: 0, offset: '', name: 'x' })
      const [url] = fetchMock.mock.calls[0] ?? []
      expect(url).toContain('limit=0')
      expect(url).not.toContain('offset=')
      expect(url).toContain('name=x')
    })

    it('works with an undefined query object', async () => {
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', undefined)
      const [url] = fetchMock.mock.calls[0] ?? []
      expect(url).toBe(`${FALLBACK_BASE_URL}/products`)
    })
  })

  describe('headers', () => {
    it('sends the x-api-key header from X_API_KEY env var', async () => {
      process.env.X_API_KEY = 'secret-key-123'
      apiFetch = await loadApiFetch()
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', undefined)
      const [, init] = fetchMock.mock.calls[0] ?? []
      const headers = (init as RequestInit).headers as Record<string, string>
      expect(headers['x-api-key']).toBe('secret-key-123')
    })

    it('falls back to an empty string for the x-api-key header when X_API_KEY is unset', async () => {
      delete process.env.X_API_KEY
      apiFetch = await loadApiFetch()
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', undefined)
      const [, init] = fetchMock.mock.calls[0] ?? []
      const headers = (init as RequestInit).headers as Record<string, string>
      expect(headers['x-api-key']).toBe('')
    })

    it('declares Accept application/json', async () => {
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', undefined)
      const [, init] = fetchMock.mock.calls[0] ?? []
      const headers = (init as RequestInit).headers as Record<string, string>
      expect(headers['Accept']).toBe('application/json')
    })
  })

  describe('options forwarding', () => {
    it('forwards an AbortSignal to fetch', async () => {
      const controller = new AbortController()
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', undefined, { signal: controller.signal })
      const [, init] = fetchMock.mock.calls[0] ?? []
      expect((init as RequestInit).signal).toBe(controller.signal)
    })

    it('forwards cache and next options to fetch', async () => {
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: {} }))
      await apiFetch('/products', undefined, {
        cache: 'no-store',
        next: { revalidate: 30, tags: ['phones'] },
      })
      const [, init] = fetchMock.mock.calls[0] ?? []
      expect((init as RequestInit).cache).toBe('no-store')
      expect((init as RequestInit).next).toEqual({ revalidate: 30, tags: ['phones'] })
    })
  })

  describe('response handling', () => {
    it('returns the parsed JSON body on a successful response', async () => {
      const payload = { id: 'AP15P', name: 'iPhone' }
      fetchMock.mockResolvedValue(makeResponse({ ok: true, body: payload }))
      const result = await apiFetch<typeof payload>('/products/1', undefined)
      expect(result).toEqual(payload)
    })

    it('throws on a non-ok response with status, statusText and the URL', async () => {
      fetchMock.mockResolvedValue(makeResponse({ ok: false, status: 404, statusText: 'Not Found' }))
      await expect(apiFetch('/products/MISSING', undefined)).rejects.toThrow(
        `API request failed: 404 Not Found for ${FALLBACK_BASE_URL}/products/MISSING`
      )
    })

    it('throws on a 500 response', async () => {
      fetchMock.mockResolvedValue(
        makeResponse({ ok: false, status: 500, statusText: 'Internal Server Error' })
      )
      await expect(apiFetch('/products', undefined)).rejects.toThrow(
        /API request failed: 500 Internal Server Error/
      )
    })
  })
})
