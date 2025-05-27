import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from 'src/stores/products'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})
describe('Products Store Unit Tests', () => {
  it('should update product in products array', () => {
    const store = useProductsStore()
    store.products = [{ id: 'p1', name: 'Test', price: 100 }]

    store.updateProduct({ id: 'p1', name: 'Updated', price: 200 })

    expect(store.products[0].name).toBe('Updated')
    expect(store.products[0].price).toBe(200)
  })

  it('should compute unique categories', () => {
    const store = useProductsStore()
    store.products = [
      { id: 'p1', category: 'A' },
      { id: 'p2', category: 'B' },
      { id: 'p3', category: 'A' },
    ]

    expect(store.kategorije).toEqual(['A', 'B'])
  })
})
