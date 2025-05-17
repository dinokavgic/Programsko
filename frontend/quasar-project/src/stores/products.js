import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from 'src/firebase'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const isLoading = ref(false)

  const kategorije = computed(() => {
    const allCategories = products.value.map((p) => p.category)

    return [...new Set(allCategories)]
  })
  async function subscribeProducts(callback) {
    isLoading.value = true
    const colRef = collection(db, 'products')
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const updatedProducts = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        updatedProducts.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.images?.[0] || '',
          category: data.category,
          inStock: data.inStock,
          fullData: data,
        })
      })

      callback(updatedProducts)
    })
    isLoading.value = false

    return unsubscribe
  }

  function updateProduct(updatedProduct) {
    const index = products.value.findIndex((p) => p.id === updatedProduct.id)
    if (index !== -1) {
      products.value[index] = { ...updatedProduct }
    }
  }

  async function subscribeProductById(id, callback) {
    const docRef = doc(db, 'products', id)
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()

          callback({
            id: docSnap.id,
            name: data.name || '',
            description: data.description || '',
            price: data.price ?? 0,
            image: data.image || '',
            images: data.images || [],
            category: data.category || '',
            inStock: data.inStock ?? 0,
          })
        } else {
          callback(null)
        }
      },
      (error) => {
        console.error('Greška u onSnapshot:', error)
        callback(null)
      }
    )

    return unsubscribe
  }

  async function saveProductChanges(updatedProduct) {
    const docRef = doc(db, 'products', updatedProduct.id)
    const { ...rest } = updatedProduct
    try {
      await updateDoc(docRef, {
        ...rest,
      })
      updateProduct(updatedProduct)
    } catch (err) {
      console.error('Greška pri spremanju proizvoda:', err)
      throw err
    }
  }

  return {
    products,
    subscribeProducts,
    kategorije,
    updateProduct,
    isLoading,
    subscribeProductById,
    saveProductChanges,
  }
})
