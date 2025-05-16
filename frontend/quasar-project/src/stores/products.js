import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from 'src/firebase'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const isLoading = ref(false)

  const kategorije = computed(() => {
    const allCategories = products.value.map((p) => p.category)

    return [...new Set(allCategories)]
  })
  async function fetchProducts() {
    isLoading.value = true
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      const fetchedProducts = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedProducts.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.images?.[0] || '', // koristi prvu sliku iz niza
          category: data.category,
          fullData: data, // opcionalno ako ti treba cijeli objekt
        })
      })

      products.value = fetchedProducts
    } catch (error) {
      console.error('Greška pri dohvaćanju proizvoda iz Firestorea:', error)
    } finally {
      isLoading.value = false
    }
  }

  function updateProduct(updatedProduct) {
    const index = products.value.findIndex((p) => p.id === updatedProduct.id)
    if (index !== -1) {
      products.value[index] = { ...updatedProduct }
    }
  }

  async function fetchProductById(id) {
    const docRef = doc(db, 'products', id)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      const data = snapshot.data()

      return {
        id: snapshot.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price ?? 0,
        image: data.image || '',
        images: data.images || [],
        category: data.category || '',
      }
    } else {
      return null
    }
  }

  return {
    products,
    fetchProducts,
    kategorije,
    updateProduct,
    isLoading,
    fetchProductById,
  }
})
