<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row">
      <div class="col-2 q-pa-md q-mt-md bg-white self-start">
        <h6 class="q-ma-md text-center">Mogućnosti</h6>
        <q-separator class="q-mb-md" />
        <q-select outlined v-model="selectedCategory" :options="categories" label="Kategorije" />

        <q-select
          outlined
          v-model="selectedSort"
          :options="sortOptions"
          label="Sortiraj"
          class="q-mt-md"
        />

        <!--q-expansion-item icon="filter_list" label="Filtriraj" class="q-mt-md">
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
        </q-expansion-item-->
        <div class="items-center column">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Pretraži proizvode"
            class="q-mt-md full-width"
          />
        </div>
        <q-separator class="q-mt-md" />
      </div>

      <div class="col-10 q-pa-md">
        <div class="q-pa-md q-mb-md shadow-1 bg-white rounded-borders">
          <div class="text-h5 text-center text-bold">
            {{ selectedCategory !== 'Sve' ? selectedCategory : 'Dobrodošli' }}
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <template v-if="paginatedProducts.length">
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
          </template>
          <template v-else>
            <div class="full-width text-center q-mt-xl">
              <q-icon name="sentiment_dissatisfied" size="64px" color="grey" />
              <div class="text-h6 q-mt-md">Nema pronađenih rezultata</div>
            </div>
          </template>
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
import { ref, computed, watch } from 'vue'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const categories = ['Sve', 'Kave', 'Pjenilice', 'Aparati']
const sortOptions = ['Zadano', 'Cijena dolje', 'Cijena gore']
const selectedCategory = ref('Sve')
const selectedSort = ref('Zadano')
const currentPage = ref(1)
const itemsPerPage = 8
const searchQuery = ref('')
const cartStore = useCartStore()
/*const filters = ref({
  prviIzbor: false,
  drugiIzbor: false,
  treciIzbor: false,
})*/
const productsStore = useProductsStore()
const products = computed(() => productsStore.products)
const searchResults = ref([])

const maxPages = computed(() => Math.ceil(searchResults.value.length / itemsPerPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage

  return searchResults.value.slice(start, start + itemsPerPage)
})

/*function clearFilters() {
  filters.value = {
    prviIzbor: false,
    drugiIzbor: false,
    treciIzbor: false,
  }
}*/
function dodajUKosaricu(product, kolicina = 1) {
  cartStore.addToCart({ ...product, quantity: kolicina })
}

function pretrazi() {
  let productsToSearch = products.value

  if (selectedCategory.value !== 'Sve') {
    productsToSearch = productsToSearch.filter((p) => p.category === selectedCategory.value)
  }

  if (selectedSort.value === 'Cijena gore') {
    productsToSearch = productsToSearch.sort((a, b) => b.price - a.price)
  } else if (selectedSort.value === 'Cijena dolje') {
    productsToSearch = productsToSearch.sort((a, b) => a.price - b.price)
  }

  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.trim().toLowerCase()
    productsToSearch = productsToSearch.filter((p) => p.name.toLowerCase().includes(query))
  }

  searchResults.value = productsToSearch
  currentPage.value = 1
}

pretrazi()
watch(searchQuery, () => {
  pretrazi()
})
watch([selectedCategory, selectedSort], () => {
  pretrazi()
})
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
