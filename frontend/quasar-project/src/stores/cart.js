import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])

  const addToCart = (product) => {
    const existing = cartItems.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += product.quantity
    } else {
      cartItems.value.push({ ...product })
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

  return { cartItems, addToCart, removeItem, increaseQuantity, decreaseQuantity, cartTotal }
})
