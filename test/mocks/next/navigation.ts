import { vi } from 'vitest'

export const nav = {
  replace: vi.fn(),
  push: vi.fn(),
  prefetch: vi.fn(),
  search: '' as string,
}

export const notFoundMock = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: nav.replace, push: nav.push, prefetch: nav.prefetch }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(nav.search),
  notFound: () => notFoundMock(),
}))

export function resetNav() {
  nav.replace = vi.fn()
  nav.push = vi.fn()
  nav.prefetch = vi.fn()
  nav.search = ''
  notFoundMock.mockClear()
  notFoundMock.mockImplementation(() => {
    throw new Error('NEXT_NOT_FOUND')
  })
}
