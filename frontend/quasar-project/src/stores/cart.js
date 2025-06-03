import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from 'src/firebase'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])
  const savedCart = localStorage.getItem('cartItems')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
  watch(
    cartItems,
    (newCart) => {
      localStorage.setItem('cartItems', JSON.stringify(newCart))
    },
    { deep: true }
  )
  const addToCart = (product) => {
    const quantity = Number(product.quantity) || 1
    const price = Number(product.price) || 0
    const inStock = Number(product.inStock) || 0

    const existing = cartItems.value.find((item) => item.id === product.id)
    const currentQuantity = existing ? existing.quantity : 0
    const allowedQuantity = inStock - currentQuantity
    if (allowedQuantity <= 0) {
      return
    }
    const quantityToAdd = Math.min(quantity, allowedQuantity)
    if (existing) {
      existing.quantity += quantityToAdd
    } else {
      cartItems.value.push({ ...product, price, quantity: quantityToAdd, inStock })
    }
    subscribeToCartStock()
  }

  const removeItem = (productId) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== productId)
  }

  const increaseQuantity = (productId) => {
    const item = cartItems.value.find((item) => item.id === productId)
    if (item && item.quantity < item.inStock) item.quantity += 1
  }

  const decreaseQuantity = (productId) => {
    const item = cartItems.value.find((item) => item.id === productId)
    if (!item) return

    if (item.quantity > 1) {
      item.quantity -= 1
    } else {
      removeItem(productId)
    }
  }

  const cartTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  })

  const clearCart = () => {
    cartItems.value = []
  }

  const syncCartWithStock = async () => {
    const updatedCart = []

    for (const item of cartItems.value) {
      const docRef = doc(db, 'products', item.id)
      const snapshot = await getDoc(docRef)

      if (snapshot.exists()) {
        const data = snapshot.data()
        const inStock = Number(data.inStock) || 0

        if (inStock > 0) {
          const quantity = Math.min(item.quantity, inStock)
          if (quantity > 0) {
            updatedCart.push({ ...item, inStock, quantity })
          }
        }
      }
    }

    cartItems.value = updatedCart
  }

  const unsubscribes = []
  const subscribeToCartStock = () => {
    unsubscribes.forEach((unsub) => unsub())
    unsubscribes.length = 0

    cartItems.value.forEach((item) => {
      const docRef = doc(db, 'products', item.id)
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists()) {
          removeItem(item.id)

          return
        }
        if (snapshot.exists()) {
          const data = snapshot.data()
          const newStock = Number(data.inStock) || 0

          const cartItem = cartItems.value.find((i) => i.id === item.id)
          if (cartItem) {
            if (newStock === 0) {
              removeItem(item.id)

              return
            }

            if (cartItem.quantity > newStock) {
              cartItem.quantity = newStock
            }
            cartItem.inStock = newStock
          }
        }
      })

      unsubscribes.push(unsubscribe)
    })
  }

  watch(
    cartItems,
    () => {
      subscribeToCartStock()
    },
    { deep: true }
  )

  return {
    cartItems,
    addToCart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
    clearCart,
    syncCartWithStock,
    subscribeToCartStock,
  }
})
