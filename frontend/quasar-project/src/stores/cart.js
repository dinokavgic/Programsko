import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

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

    const existing = cartItems.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      cartItems.value.push({ ...product, price, quantity })
    }
  }

  const removeItem = (productId) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== productId)
  }

  const increaseQuantity = (productId) => {
    const item = cartItems.value.find((item) => item.id === productId)
    if (item) item.quantity += 1
  }

  const decreaseQuantity = (productId) => {
    const item = cartItems.value.find((item) => item.id === productId)
    if (item && item.quantity > 1) item.quantity -= 1
  }

  const cartTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  })

  const clearCart = () => {
    cartItems.value = []
  }

  return {
    cartItems,
    addToCart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
    clearCart,
  }
})
