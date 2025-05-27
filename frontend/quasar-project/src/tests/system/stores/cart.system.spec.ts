import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from 'src/stores/cart'
import { getDoc, onSnapshot, doc } from 'firebase/firestore'
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest'

vi.mock('src/firebase', () => ({
  db: {},
  auth: {},
  storage: {},
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn((db, collection, id) => ({ id })),
  getDoc: vi.fn(),
  onSnapshot: vi.fn((docRef, callback) => {
    callback({
      exists: () => true,
      data: () => ({ inStock: 4 }),
    })
    return () => {}
  }),
}))

describe('Cart Store System Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should sync cart stock correctly', async () => {
    const store = useCartStore()
    store.cartItems = [
      { id: 'p1', price: 10, quantity: 5, inStock: 5 },
      { id: 'p2', price: 20, quantity: 3, inStock: 3 },
    ]
    ;(doc as unknown as Mock).mockImplementation((db, collection, id) => ({ id }))
    ;(getDoc as unknown as Mock).mockImplementation(async (docRef: any) => {
      if (docRef.id === 'p1') {
        return {
          exists: () => true,
          data: () => ({ inStock: 4 }),
          id: docRef.id,
          ref: docRef,
          metadata: {},
          get: (field: string) => {
            const data = { inStock: 4 }
            return data[field as keyof typeof data]
          },
        }
      }
      if (docRef.id === 'p2') {
        return {
          exists: () => true,
          data: () => ({ inStock: 0 }),
          id: docRef.id,
          ref: docRef,
          metadata: {},
          get: () => undefined,
        }
      }
      return {
        exists: () => false,
        id: docRef.id,
        ref: docRef,
        metadata: {},
        get: () => undefined,
        data: () => undefined,
      }
    })

    await store.syncCartWithStock()

    expect(store.cartItems.length).toBe(1)
    expect(store.cartItems[0].id).toBe('p1')
    expect(store.cartItems[0].quantity).toBe(4)
  })

  it('should subscribe to stock changes and update cart', () => {
    const store = useCartStore()
    store.cartItems = [{ id: 'p1', price: 10, quantity: 2, inStock: 5 }]
    ;(doc as unknown as Mock).mockImplementation((db, collection, id) => ({ id }))
    ;(onSnapshot as unknown as Mock).mockImplementation((docRef, callback) => {
      callback({
        exists: () => true,
        data: () => ({ inStock: 1 }),
      })
      return vi.fn() // unsubscribe function
    })

    store.subscribeToCartStock()

    expect(store.cartItems[0].quantity).toBe(1)
    expect(store.cartItems[0].inStock).toBe(1)
  })

  it('should remove item if stock is zero in subscription', () => {
    const store = useCartStore()
    store.cartItems = [{ id: 'p1', price: 10, quantity: 2, inStock: 5 }]
    ;(doc as unknown as Mock).mockImplementation((db, collection, id) => ({ id }))
    ;(onSnapshot as unknown as Mock).mockImplementation((docRef, callback) => {
      callback({
        exists: () => true,
        data: () => ({ inStock: 0 }),
      })
      return vi.fn() // unsubscribe function
    })

    store.subscribeToCartStock()

    expect(store.cartItems.length).toBe(0)
  })
})
