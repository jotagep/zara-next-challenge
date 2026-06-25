import { nav, resetNav } from '@/test/mocks/next/navigation'
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ScrollToTop } from './ScrollToTop'

describe('ScrollToTop', () => {
  const mockScrollTo = vi.fn()

  beforeEach(() => {
    resetNav()
    mockScrollTo.mockClear()
    // Explicitly define window.scrollTo in test environment to track calls
    Object.defineProperty(window, 'scrollTo', {
      value: mockScrollTo,
      writable: true,
      configurable: true,
    })
  })

  it('scrolls to top on mount', () => {
    render(<ScrollToTop />)
    expect(mockScrollTo).toHaveBeenCalledTimes(1)
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('scrolls to top when pathname changes', () => {
    const { rerender } = render(<ScrollToTop />)
    expect(mockScrollTo).toHaveBeenCalledTimes(1)

    // Simulate route change by changing the mocked pathname and rerendering
    nav.pathname = '/phone/1'
    rerender(<ScrollToTop />)

    expect(mockScrollTo).toHaveBeenCalledTimes(2)
    expect(mockScrollTo).toHaveBeenLastCalledWith(0, 0)
  })

  it('does not scroll to top when rerendered with the same pathname', () => {
    const { rerender } = render(<ScrollToTop />)
    expect(mockScrollTo).toHaveBeenCalledTimes(1)

    // Rerender with the same pathname
    rerender(<ScrollToTop />)

    expect(mockScrollTo).toHaveBeenCalledTimes(1)
  })
})
