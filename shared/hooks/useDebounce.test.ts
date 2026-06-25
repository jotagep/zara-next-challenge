import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value synchronously', () => {
    const { result } = renderHook(() => useDebounce('initial'))
    expect(result.current).toBe('initial')
  })

  it('does not update before the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('a')
  })

  it('updates after the default delay (300ms)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('b')
  })

  it('uses a custom delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 1000 },
    })

    rerender({ value: 'b', delay: 1000 })
    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('b')
  })

  it('cancels the previous timer when value changes rapidly', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: 'c' })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: 'd' })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('d')
  })

  it('cancels the pending timer on unmount', () => {
    const { rerender, unmount } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    unmount()

    expect(() => {
      act(() => {
        vi.advanceTimersByTime(1000)
      })
    }).not.toThrow()
  })

  it('resets the timer when the delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 100 } }
    )

    rerender({ value: 'b', delay: 100 })
    act(() => {
      vi.advanceTimersByTime(50)
    })

    rerender({ value: 'b', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // 200ms after the delay changed to 500ms — should not have updated yet
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('b')
  })
})
