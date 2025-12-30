+13
-8

import { createContext, useCallback, useMemo, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = useCallback((product, quantity = 1, options = {}) => {
    const safeQuantity = Math.max(1, Math.min(Number(quantity) || 0, 10))
    const size = options.size || product.size || product.sizes?.[0] || 'Único'
    const cartId = `${product.id}-${size}`

    setItems((prev) => {
      const existing = prev.find((item) => item.cartId === cartId)

      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity: Math.min(item.quantity + safeQuantity, 10),
              }
            : item,
        )
      }

      return [
        ...prev,
        { ...product, productId: product.id, size, cartId, quantity: safeQuantity },
      ]
    })
  }, [])

  const updateQuantity = useCallback((cartId, quantity) => {
    const nextQuantity = Math.max(0, Math.min(Number(quantity) || 0, 10))

    setItems((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId ? { ...item, quantity: nextQuantity } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeItem = useCallback((cartId) => {
    setItems((prev) => prev.filter((item) => item.cartId !== cartId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items],
  )

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [addItem, clearCart, items, removeItem, totalItems, totalPrice, updateQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export { CartContext }
