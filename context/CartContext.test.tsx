/// <reference types="vitest/globals" />
import type { ColorOption, StorageOption } from '@/lib/types/domain'
import { act, renderHook } from '@testing-library/react'

import { CartProvider, useCart } from './CartContext'

const color: ColorOption = {
  name: 'Black',
  hexCode: '#000000',
  imageUrl: 'https://example.com/x.png',
}
const storage: StorageOption = { capacity: '256 GB', price: 999 }

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('CartProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts with zero count', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.count).toBe(0)
    expect(result.current.items).toEqual([])
  })

  it('adds an item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => {
      result.current.addToCart({
        id: 'SM24U',
        brand: 'Samsung',
        name: 'Galaxy S24 Ultra',
        color,
        storage,
      })
    })
    expect(result.current.count).toBe(1)
    expect(result.current.items).toHaveLength(1)
  })

  it('increments quantity for the same id/color/storage combo', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => {
      result.current.addToCart({
        id: 'SM24U',
        brand: 'Samsung',
        name: 'Galaxy S24 Ultra',
        color,
        storage,
      })
      result.current.addToCart({
        id: 'SM24U',
        brand: 'Samsung',
        name: 'Galaxy S24 Ultra',
        color,
        storage,
      })
    })
    expect(result.current.count).toBe(2)
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]?.quantity).toBe(2)
  })

  it('treats different color as a new line', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    const otherColor: ColorOption = { ...color, name: 'Blue' }
    act(() => {
      result.current.addToCart({
        id: 'SM24U',
        brand: 'Samsung',
        name: 'Galaxy S24 Ultra',
        color,
        storage,
      })
      result.current.addToCart({
        id: 'SM24U',
        brand: 'Samsung',
        name: 'Galaxy S24 Ultra',
        color: otherColor,
        storage,
      })
    })
    expect(result.current.count).toBe(2)
    expect(result.current.items).toHaveLength(2)
  })

  it('removes a line by id/color/storage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => {
      result.current.addToCart({
        id: 'SM24U',
        brand: 'Samsung',
        name: 'Galaxy S24 Ultra',
        color,
        storage,
      })
      result.current.removeFromCart('SM24U', 'Black', '256 GB')
    })
    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
  })

  it('persists items to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => {
      result.current.addToCart({
        id: 'SM24U',
        brand: 'Samsung',
        name: 'Galaxy S24 Ultra',
        color,
        storage,
      })
    })
    const stored = window.localStorage.getItem('zara_shopping_cart')
    expect(stored).toContain('SM24U')
    expect(stored).toContain('256 GB')
  })
})
