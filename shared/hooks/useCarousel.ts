import { useCallback, useEffect, useRef, useState } from 'react'

type UseScrollRowOptions = {
  resetKey?: string | number
}

type ScrollThumb = {
  visible: boolean
  width: number
  left: number
}

export const useCarousel = <T extends HTMLElement>({ resetKey }: UseScrollRowOptions = {}) => {
  const ref = useRef<T>(null)
  const [thumb, setThumb] = useState<ScrollThumb>({ visible: false, width: 0, left: 0 })
  const frame = useRef<number | null>(null)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const overflow = scrollWidth - clientWidth
    if (overflow <= 1) {
      setThumb((t) => (t.visible ? { visible: false, width: 0, left: 0 } : t))
      return
    }
    const width = (clientWidth / scrollWidth) * 50
    const left = (scrollLeft / overflow) * (100 - width)
    setThumb((t) =>
      t.visible && Math.abs(t.width - width) < 0.1 && Math.abs(t.left - left) < 0.1
        ? t
        : { visible: true, width, left }
    )
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = requestAnimationFrame(() => {
        frame.current = null
        measure()
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      ro.disconnect()
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [measure])

  useEffect(() => {
    if (resetKey === undefined) return
    ref.current?.scrollTo({ left: 0, behavior: 'auto' })
  }, [resetKey])

  return {
    ref,
    thumb,
  }
}
