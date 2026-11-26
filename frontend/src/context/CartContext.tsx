import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { ordersAPI } from '@/services/endpoints'
import { CartType } from '@/services/endpoints'

interface CartContextType {
  cart: CartType | null
  isLoading: boolean
  itemCount: number
  fetchCart: () => Promise<void>
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateItem: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    try {
      const res = await ordersAPI.getCart()
      setCart(res.data)
    } catch {
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    await ordersAPI.addToCart({ product_id: productId, quantity })
    await fetchCart()
  }, [fetchCart])

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    await ordersAPI.updateCartItem(itemId, quantity)
    await fetchCart()
  }, [fetchCart])

  const removeItem = useCallback(async (itemId: number) => {
    await ordersAPI.removeCartItem(itemId)
    await fetchCart()
  }, [fetchCart])

  const clearCart = useCallback(async () => {
    await ordersAPI.clearCart()
    await fetchCart()
  }, [fetchCart])

  const itemCount = cart?.item_count ?? 0

  return (
    <CartContext.Provider value={{ cart, isLoading, itemCount, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
