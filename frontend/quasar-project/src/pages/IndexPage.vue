<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row">
      <div class="col-2 q-pa-md q-mt-md bg-white self-start">
        <q-select outlined v-model="selectedCategory" :options="categories" label="Kategorije" />

        <q-select
          outlined
          v-model="selectedSort"
          :options="sortOptions"
          label="Sortiraj"
          class="q-mt-md"
        />

        <q-expansion-item icon="filter_list" label="Filtriraj" class="q-mt-md">
          <div class="column">
            <q-checkbox v-model="filters.prviIzbor" label="Prvi izbor" />
            <q-checkbox v-model="filters.drugiIzbor" label="Drugi izbor" />
            <q-checkbox v-model="filters.treciIzbor" label="Treći izbor" />
            <q-btn
              label="Očisti filter"
              @click="clearFilters"
              flat
              class="q-mt-sm bg-grey-2 self-start self-center"
            />
          </div>
        </q-expansion-item>
        <div class="items-center column">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Pretraži"
            class="q-mt-md full-width"
          />
          <q-btn
            unelevated
            class="bg-green-3 text-black q-mt-md center items-center"
            label="Pretraži"
          />
        </div>
      </div>

      <div class="col-10 q-pa-md">
        <div class="q-pa-md q-mb-md shadow-1 bg-white rounded-borders">
          <div class="text-h5 text-center text-bold">
            {{ selectedCategory !== 'Sve' ? selectedCategory : 'Dobrodošli' }}
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card class="hoverable-card cursor-pointer">
              <router-link :to="`/Proizvod/${product.id}`" class="no-decoration">
                <q-img :src="product.image" alt="Fotografija proizvoda" style="height: 150px" />
                <q-card-section>
                  <div class="text-h6">{{ product.name }}</div>
                  <div class="text-caption">{{ product.description }}</div>
                  <div class="text-subtitle1 q-mt-sm">{{ product.price.toFixed(2) }} €</div>
                </q-card-section>
              </router-link>

              <q-card-actions>
                <q-btn
                  flat
                  unelevated
                  icon="shopping_cart"
                  label="Dodaj u košaricu"
                  @click="dodajUKosaricu(product)"
                  class="full-width bg-green-3 text-black"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <div class="row justify-center q-mt-lg">
          <q-pagination
            v-model="currentPage"
            :max="maxPages"
            max-pages="5"
            direction-links
            boundary-links
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'

const categories = ['Sve', 'Kave', 'Pjenilice', 'Aparati']
const sortOptions = ['Zadano', 'Cijena dolje', 'Cijena gore']
const selectedCategory = ref('Sve')
const selectedSort = ref('Zadano')
const currentPage = ref(1)
const itemsPerPage = 8
const searchQuery = ref('')
const cartStore = useCartStore()
const filters = ref({
  prviIzbor: false,
  drugiIzbor: false,
  treciIzbor: false,
})
//primjeri proizvoda
const products = ref([
  {
    id: 1,
    name: 'Proizvod 1',
    description: 'Opis 1',
    price: 19.99,
    image: 'https://via.placeholder.com/300x150',
  },
  {
    id: 2,
    name: 'Proizvod 2',
    description: 'Opis 2',
    price: 29.99,
    image: 'https://via.placeholder.com/300x150',
  },
  {
    id: 3,
    name: 'Proizvod 3',
    description: 'Opis 3',
    price: 39.99,
    image: 'https://via.placeholder.com/300x150',
  },
  {
    id: 4,
    name: 'Proizvod 4',
    description: 'Opis 4',
    price: 49.99,
    image: 'https://via.placeholder.com/300x150',
  },
  {
    id: 5,
    name: 'Proizvod 5',
    description: 'Opis 5',
    price: 59.99,
    image: 'https://via.placeholder.com/300x150',
  },
  {
    id: 6,
    name: 'Proizvod 6',
    description: 'Opis 6',
    price: 69.99,
    image: 'https://via.placeholder.com/300x150',
  },
  {
    id: 7,
    name: 'Proizvod 7',
    description: 'Opis 7',
    price: 79.99,
    image: 'https://via.placeholder.com/300x150',
  },
  {
    id: 6,
    name: 'Proizvod 8',
    description: 'Opis 7',
    price: 69.99,
    image: 'https://via.placeholder.com/300x150',
  },
  {
    id: 7,
    name: 'Proizvod 9',
    description: 'Opis 9',
    price: 79.99,
    image: 'https://via.placeholder.com/300x150',
  },
])

const maxPages = computed(() => Math.ceil(products.value.length / itemsPerPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage

  return products.value.slice(start, start + itemsPerPage)
})

function clearFilters() {
  filters.value = {
    prviIzbor: false,
    drugiIzbor: false,
    treciIzbor: false,
  }
}
function dodajUKosaricu(product, kolicina = 1) {
  cartStore.addToCart({ ...product, quantity: kolicina })
}
</script>

<style scoped>
.q-card {
  min-height: 300px;
}
.hoverable-card {
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.hoverable-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.no-decoration {
  text-decoration: none;
  color: inherit;
}
</style>
