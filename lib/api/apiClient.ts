import 'server-only'

const API_BASE_URL =
  process.env.API_BASE_URL ?? 'https://prueba-tecnica-api-tienda-moviles.onrender.com'
const API_KEY = process.env.X_API_KEY ?? ''

type ApiFetchOptions = {
  signal?: AbortSignal
  cache?: RequestCache
  next?: { revalidate?: number | false; tags?: string[] }
}

const buildUrl = (path: string, query?: Record<string, string | number | undefined>) => {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE_URL}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

export const apiFetch = async <T>(
  path: string,
  query: Record<string, string | number | undefined> | undefined,
  options: ApiFetchOptions = {}
): Promise<T> => {
  const url = buildUrl(path, query)
  const headers: HeadersInit = {
    'x-api-key': API_KEY,
    Accept: 'application/json',
  }
  const response = await fetch(url, {
    headers,
    signal: options.signal,
    cache: options.cache,
    next: options.next,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText} for ${url}`)
  }

  return (await response.json()) as T
}
