'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { ColorOption, PhoneId, StorageOption } from '@/shared/lib/types/domain'

export type CartItem = {
  id: PhoneId
  brand: string
  name: string
  color: ColorOption
  storage: StorageOption
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: PhoneId, colorName: string, storageCapacity: string) => void
}

const STORAGE_KEY = 'zara_shopping_cart'

const CartContext = createContext<CartContextValue | null>(null)

const isCartItem = (value: unknown): value is CartItem => {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.brand === 'string' &&
    typeof v.name === 'string' &&
    typeof v.quantity === 'number' &&
    typeof v.color === 'object' &&
    v.color !== null &&
    typeof v.storage === 'object' &&
    v.storage !== null
  )
}

const readStoredItems = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isCartItem)
  } catch {
    return []
  }
}

const sameSelection = (a: CartItem, b: Omit<CartItem, 'quantity'>): boolean =>
  a.id === b.id && a.color.name === b.color.name && a.storage.capacity === b.storage.capacity

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Intentional: hydrate from localStorage on mount. The first render uses the
    // empty default to match SSR
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStoredItems())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore quota / private mode errors
    }
  }, [items])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((current) => {
      const existing = current.find((entry) => sameSelection(entry, item))
      if (existing) {
        return current.map((entry) =>
          sameSelection(entry, item) ? { ...entry, quantity: entry.quantity + 1 } : entry
        )
      }
      return [...current, { ...item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: PhoneId, colorName: string, storageCapacity: string) => {
    setItems((current) =>
      current.filter(
        (entry) =>
          !(
            entry.id === id &&
            entry.color.name === colorName &&
            entry.storage.capacity === storageCapacity
          )
      )
    )
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addToCart,
      removeFromCart,
    }),
    [items, addToCart, removeFromCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
