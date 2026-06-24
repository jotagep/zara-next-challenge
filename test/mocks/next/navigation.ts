import { vi } from 'vitest'

export const nav = {
  replace: vi.fn(),
  push: vi.fn(),
  prefetch: vi.fn(),
  search: '' as string,
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: nav.replace, push: nav.push, prefetch: nav.prefetch }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(nav.search),
}))

export function resetNav() {
  nav.replace = vi.fn()
  nav.push = vi.fn()
  nav.prefetch = vi.fn()
  nav.search = ''
}
