'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
  categoryName: string
}

interface CartStore {
  items: CartItem[]
  couponCode: string | null
  couponDiscount: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
}

const isBrowser = typeof window !== 'undefined'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      applyCoupon: (code, discount) =>
        set({ couponCode: code, couponDiscount: discount }),

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().couponDiscount
        return Math.max(0, subtotal - discount)
      },

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'watermelon-cart',
      storage: createJSONStorage(() => (isBrowser ? localStorage : undefined as any)),
    }
  )
)

export interface WishlistStore {
  items: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) =>
        set((state) => ({
          items: state.items.includes(id)
            ? state.items.filter((i) => i !== id)
            : [...state.items, id],
        })),
      has: (id) => get().items.includes(id),
    }),
    {
      name: 'watermelon-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
