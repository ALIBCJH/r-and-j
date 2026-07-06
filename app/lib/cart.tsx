'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type CartItem = {
  productId:   number
  name:        string
  image:       string
  collection:  string
  priceKsh:    number
  quantity:    number
}

type CartState = {
  items:          CartItem[]
  totalItems:     number
  totalKsh:       number
  hydrated:       boolean
  drawerOpen:     boolean
  addToCart:      (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeFromCart: (productId: number) => void
  updateQty:      (productId: number, qty: number) => void
  clearCart:      () => void
  openDrawer:     () => void
  closeDrawer:    () => void
}

const CartContext = createContext<CartState | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items,      setItems]      = useState<CartItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hydrated,   setHydrated]   = useState(false)

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rj-cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setHydrated(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('rj-cart', JSON.stringify(items))
  }, [items, hydrated])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId)
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      }
      return [...prev, { ...item, quantity: qty }]
    })
    setDrawerOpen(true)
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }, [])

  const updateQty = useCallback((productId: number, qty: number) => {
    if (qty < 1) return
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalKsh   = items.reduce((s, i) => s + i.priceKsh * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, totalItems, totalKsh,
      hydrated,
      drawerOpen,
      addToCart, removeFromCart, updateQty, clearCart,
      openDrawer:  () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
