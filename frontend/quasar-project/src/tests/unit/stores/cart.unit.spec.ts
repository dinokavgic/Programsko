import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from 'src/stores/cart'

describe('Cart Store Unit Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should add new product to cart', () => {
    const store = useCartStore()
    store.addToCart({ id: 'p1', price: 10, quantity: 2, inStock: 5 })

    expect(store.cartItems.length).toBe(1)
    expect(store.cartItems[0].quantity).toBe(2)
  })

  it('should increase quantity if product already in cart', () => {
    const store = useCartStore()
    store.addToCart({ id: 'p1', price: 10, quantity: 2, inStock: 5 })
    store.addToCart({ id: 'p1', price: 10, quantity: 3, inStock: 5 })

    expect(store.cartItems.length).toBe(1)
    expect(store.cartItems[0].quantity).toBe(5) // ne prelazi inStock
  })

  it('should not exceed inStock quantity', () => {
    const store = useCartStore()
    store.addToCart({ id: 'p1', price: 10, quantity: 10, inStock: 3 })

    expect(store.cartItems[0].quantity).toBe(3)
  })

  it('should remove item', () => {
    const store = useCartStore()
    store.addToCart({ id: 'p1', price: 10, quantity: 1, inStock: 5 })
    store.removeItem('p1')

    expect(store.cartItems.length).toBe(0)
  })

  it('should increase quantity by 1', () => {
    const store = useCartStore()
    store.addToCart({ id: 'p1', price: 10, quantity: 1, inStock: 5 })
    store.increaseQuantity('p1')

    expect(store.cartItems[0].quantity).toBe(2)
  })

  it('should not increase quantity above inStock', () => {
    const store = useCartStore()
    store.addToCart({ id: 'p1', price: 10, quantity: 5, inStock: 5 })
    store.increaseQuantity('p1')

    expect(store.cartItems[0].quantity).toBe(5)
  })

  it('should decrease quantity by 1 or remove if 1', () => {
    const store = useCartStore()
    store.addToCart({ id: 'p1', price: 10, quantity: 2, inStock: 5 })
    store.decreaseQuantity('p1')

    expect(store.cartItems[0].quantity).toBe(1)

    store.decreaseQuantity('p1')

    expect(store.cartItems.length).toBe(0)
  })

  it('should compute cart total correctly', () => {
    const store = useCartStore()
    store.addToCart({ id: 'p1', price: 10, quantity: 2, inStock: 5 })
    store.addToCart({ id: 'p2', price: 5.5, quantity: 3, inStock: 5 })

    expect(store.cartTotal).toBe('36.50')
  })

  it('should clear cart', () => {
    const store = useCartStore()
    store.addToCart({ id: 'p1', price: 10, quantity: 2, inStock: 5 })
    store.clearCart()

    expect(store.cartItems.length).toBe(0)
  })
})
