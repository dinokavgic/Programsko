import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from 'src/stores/products'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest'

// Mock Firebase modula
vi.mock('src/firebase', () => ({
  db: {},
  storage: {},
  auth: {},
}))

// Mock funkcija Firestorea
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  updateDoc: vi.fn(),
}))

describe('Products Store System Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should subscribe and receive products from onSnapshot', async () => {
    const store = useProductsStore()
    const mockCallback = vi.fn()

    const fakeDocs = [
      {
        id: 'p1',
        data: () => ({
          name: 'Test',
          description: '',
          price: 10,
          images: ['a.jpg'],
          category: 'cat1',
          inStock: 5,
        }),
      },
    ]

    const mockQuerySnapshot = {
      forEach: (fn: (doc: any) => void) => fakeDocs.forEach(fn),
    }

    const mockUnsub = vi.fn()
    ;(onSnapshot as unknown as Mock).mockImplementation(
      (_ref: any, cb: (snapshot: any) => void) => {
        cb(mockQuerySnapshot)
        return mockUnsub
      }
    )

    const unsubscribe = await store.subscribeProducts(mockCallback)

    expect(mockCallback).toHaveBeenCalledWith([
      {
        id: 'p1',
        name: 'Test',
        description: '',
        price: 10,
        image: 'a.jpg',
        category: 'cat1',
        inStock: 5,
        fullData: expect.any(Object),
      },
    ])

    expect(unsubscribe).toBe(mockUnsub)
  })

  it('should save product changes and call updateDoc', async () => {
    const store = useProductsStore()
    const fakeProduct = { id: 'p1', name: 'Updated', price: 99 }

    const mockDocRef = {}
    ;(doc as unknown as Mock).mockReturnValue(mockDocRef)

    await store.saveProductChanges(fakeProduct)

    expect(updateDoc).toHaveBeenCalledWith(
      mockDocRef,
      expect.objectContaining({
        name: 'Updated',
        price: 99,
      })
    )
  })
})
