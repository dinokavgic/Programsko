import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useProductsStore = defineStore('products', () => {
  const products = ref([
    {
      id: 1,
      name: 'Covfefe 1',
      description: 'Opis 1',
      price: 19.99,
      image: 'https://via.placeholder.com/300x150',
      category: 'Kave',
    },
    {
      id: 2,
      name: 'Nescaffe 2',
      description: 'Opis 2',
      price: 29.99,
      image: 'https://via.placeholder.com/300x150',
      category: 'Kave',
    },
    {
      id: 3,
      name: 'Kava turska 3',
      description: 'Opis 3',
      price: 39.99,
      image: 'https://via.placeholder.com/300x150',
      category: 'Kave',
    },
    {
      id: 4,
      name: 'Pjenilica 4',
      description: 'Opis 4',
      price: 49.99,
      image: 'https://via.placeholder.com/300x150',
      category: 'Pjenilice',
    },
    {
      id: 5,
      name: 'Aparat 5',
      description: 'Opis 5',
      price: 59.99,
      image: 'https://via.placeholder.com/300x150',
      category: 'Aparati',
    },
    {
      id: 6,
      name: 'Pjenilica 6',
      description: 'Opis 6',
      price: 69.99,
      image: 'https://via.placeholder.com/300x150',
      category: 'Pjenilice',
    },
    {
      id: 7,
      name: 'Aparat 7',
      description: 'Opis 7',
      price: 79.99,
      image: 'https://via.placeholder.com/300x150',
      category: 'Aparati',
    },
    {
      id: 8,
      name: 'Pjenilica 8',
      description: 'Opis 7',
      price: 69.99,
      image: 'https://via.placeholder.com/300x150',
      category: 'Pjenilice',
    },
    {
      id: 9,
      name: 'Aparat 9',
      description: 'Opis 9',
      price: 79.99,
      image: 'https://via.placeholder.com/300x150',
      category: 'Aparati',
    },
  ])
  async function fetchProducts() {
    //naknadna logika za firebase
  }

  return {
    products,
    fetchProducts,
  }
})
