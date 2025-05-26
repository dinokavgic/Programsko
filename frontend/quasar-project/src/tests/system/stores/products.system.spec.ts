import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from 'src/stores/products'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'

jest.mock('src/firebase', () => ({
  db: {},
  storage: {},
  auth: {},
}))
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  onSnapshot: jest.fn(),
  updateDoc: jest.fn(),
}))

describe('Products Store System Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should subscribe and receive products from onSnapshot', async () => {
    const store = useProductsStore()
    const mockCallback = jest.fn()

    // Simuliraj firestore response
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
      forEach: (fn: any) => fakeDocs.forEach((d) => fn(d)),
    }

    const mockUnsub = jest.fn()
    ;(onSnapshot as jest.Mock).mockImplementation((_ref: any, cb: any) => {
      cb(mockQuerySnapshot)
      return mockUnsub
    })

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
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)

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
