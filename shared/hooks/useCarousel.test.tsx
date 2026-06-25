import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCarousel } from './useCarousel'

type HarnessProps = {
  resetKey?: string | number
}

const CarouselHarness = ({ resetKey }: HarnessProps) => {
  const { ref, thumb } = useCarousel<HTMLDivElement>({ resetKey })
  return (
    <div>
      <div ref={ref} data-testid="track" />
      <output data-testid="thumb">{JSON.stringify(thumb)}</output>
    </div>
  )
}

const setMetrics = (
  el: HTMLElement,
  metrics: { scrollWidth?: number; clientWidth?: number; scrollLeft?: number }
) => {
  for (const [key, value] of Object.entries(metrics)) {
    if (value !== undefined) {
      Object.defineProperty(el, key, { value, configurable: true, writable: true })
    }
  }
}

const readThumb = (container: HTMLElement) => {
  const text = container.querySelector('[data-testid="thumb"]')!.textContent!
  return JSON.parse(text) as { visible: boolean; width: number; left: number }
}

describe('useCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with an invisible thumb', () => {
    const { container } = render(<CarouselHarness />)
    expect(readThumb(container)).toEqual({ visible: false, width: 0, left: 0 })
  })

  it('shows the thumb when there is horizontal overflow', () => {
    const { container, getByTestId } = render(<CarouselHarness />)
    const track = getByTestId('track') as HTMLDivElement
    setMetrics(track, { scrollWidth: 1000, clientWidth: 500, scrollLeft: 0 })

    act(() => {
      track.dispatchEvent(new Event('scroll'))
    })
    act(() => {
      vi.runAllTimers()
    })

    expect(readThumb(container)).toEqual({ visible: true, width: 25, left: 0 })
  })

  it('hides the thumb when content fits the container', () => {
    const { container, getByTestId } = render(<CarouselHarness />)
    const track = getByTestId('track') as HTMLDivElement
    setMetrics(track, { scrollWidth: 500, clientWidth: 500, scrollLeft: 0 })

    act(() => {
      track.dispatchEvent(new Event('scroll'))
    })
    act(() => {
      vi.runAllTimers()
    })

    expect(readThumb(container).visible).toBe(false)
  })

  it('hides the thumb when overflow is below 1px', () => {
    const { container, getByTestId } = render(<CarouselHarness />)
    const track = getByTestId('track') as HTMLDivElement
    setMetrics(track, { scrollWidth: 500.5, clientWidth: 500, scrollLeft: 0 })

    act(() => {
      track.dispatchEvent(new Event('scroll'))
    })
    act(() => {
      vi.runAllTimers()
    })

    expect(readThumb(container).visible).toBe(false)
  })

  it('positions the thumb according to scrollLeft', () => {
    const { container, getByTestId } = render(<CarouselHarness />)
    const track = getByTestId('track') as HTMLDivElement
    setMetrics(track, { scrollWidth: 1000, clientWidth: 500, scrollLeft: 250 })

    act(() => {
      track.dispatchEvent(new Event('scroll'))
    })
    act(() => {
      vi.runAllTimers()
    })

    // width = (500/1000) * 50 = 25
    // left  = (250/500) * (100 - 25) = 37.5
    expect(readThumb(container)).toEqual({ visible: true, width: 25, left: 37.5 })
  })

  it('updates the thumb on subsequent scrolls', () => {
    const { container, getByTestId } = render(<CarouselHarness />)
    const track = getByTestId('track') as HTMLDivElement
    setMetrics(track, { scrollWidth: 1000, clientWidth: 500, scrollLeft: 0 })

    act(() => {
      track.dispatchEvent(new Event('scroll'))
    })
    act(() => {
      vi.runAllTimers()
    })
    expect(readThumb(container).left).toBe(0)

    setMetrics(track, { scrollLeft: 500 })
    act(() => {
      track.dispatchEvent(new Event('scroll'))
    })
    act(() => {
      vi.runAllTimers()
    })
    expect(readThumb(container)).toEqual({ visible: true, width: 25, left: 75 })
  })

  it('coalesces multiple scroll events in the same frame', () => {
    const { container, getByTestId } = render(<CarouselHarness />)
    const track = getByTestId('track') as HTMLDivElement
    setMetrics(track, { scrollWidth: 1000, clientWidth: 500, scrollLeft: 0 })

    act(() => {
      track.dispatchEvent(new Event('scroll'))
    })
    setMetrics(track, { scrollLeft: 100 })
    act(() => {
      track.dispatchEvent(new Event('scroll'))
    })
    setMetrics(track, { scrollLeft: 300 })
    act(() => {
      track.dispatchEvent(new Event('scroll'))
    })
    act(() => {
      vi.runAllTimers()
    })

    // Only the last scrollLeft is read in the rAF callback
    // left = (300/500) * 75 = 45
    expect(readThumb(container)).toEqual({ visible: true, width: 25, left: 45 })
  })

  it('updates the thumb on window resize', () => {
    const { container, getByTestId } = render(<CarouselHarness />)
    const track = getByTestId('track') as HTMLDivElement
    setMetrics(track, { scrollWidth: 1000, clientWidth: 500, scrollLeft: 0 })

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(readThumb(container)).toEqual({ visible: true, width: 25, left: 0 })
  })

  it('observes the track with ResizeObserver', () => {
    const observeSpy = vi.spyOn(globalThis.ResizeObserver.prototype, 'observe')
    render(<CarouselHarness />)
    expect(observeSpy).toHaveBeenCalled()
    observeSpy.mockRestore()
  })

  it('cleans up listeners and ResizeObserver on unmount', () => {
    const disconnectSpy = vi.spyOn(globalThis.ResizeObserver.prototype, 'disconnect')
    const { unmount, getByTestId } = render(<CarouselHarness />)
    const track = getByTestId('track') as HTMLDivElement
    const removeScrollListenerSpy = vi.spyOn(track, 'removeEventListener')

    unmount()

    expect(removeScrollListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(disconnectSpy).toHaveBeenCalled()
  })
})

// jsdom does not implement Element.prototype.scrollTo; the hook calls
// ref.current?.scrollTo(...) so we need a no-op for the effect to run.
if (typeof Element.prototype.scrollTo !== 'function') {
  Element.prototype.scrollTo = function () {}
}

describe('useCarousel resetKey', () => {
  it('does not scroll when resetKey is undefined', () => {
    const { getByTestId, rerender } = render(<CarouselHarness />)
    const track = getByTestId('track') as HTMLDivElement
    const scrollTo = vi.spyOn(track, 'scrollTo').mockImplementation(() => {})

    rerender(<CarouselHarness />)

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('scrolls to the start when resetKey changes', () => {
    const { getByTestId, rerender } = render(<CarouselHarness resetKey="a" />)
    const track = getByTestId('track') as HTMLDivElement
    const scrollTo = vi.spyOn(track, 'scrollTo').mockImplementation(() => {})

    rerender(<CarouselHarness resetKey="b" />)

    expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: 'auto' })
  })

  it('does not scroll when resetKey keeps the same value', () => {
    const { getByTestId, rerender } = render(<CarouselHarness resetKey="a" />)
    const track = getByTestId('track') as HTMLDivElement
    const scrollTo = vi.spyOn(track, 'scrollTo').mockImplementation(() => {})

    rerender(<CarouselHarness resetKey="a" />)

    expect(scrollTo).not.toHaveBeenCalled()
  })
})
