<template>
  <div v-if="loading" class="q-pa-xl text-center">
    <q-spinner size="50px" color="primary" />
    <div class="q-mt-md">Učitavanje proizvoda...</div>
  </div>
  <div v-else class="bg-grey-2" style="min-height: 93vh; display: grid; place-items: center">
    <div class="" style="max-width: 60%; width: 100%">
      <q-card
        v-if="product"
        class="bg-grey-1 q-pa-md q-rounded-lg shadow-2 animate__animated animate__fadeInUp"
      >
        <div class="row q-col-gutter-md">
          <div class="col-10 col-md-6">
            <q-carousel
              v-if="product?.images?.length"
              v-model="slide"
              arrows
              navigation
              height="300px"
              class="rounded-borders"
            >
              <q-carousel-slide
                v-for="(img, index) in product.images"
                :key="index"
                :name="index"
                :img-src="img"
              />
            </q-carousel>

            <div v-else class="flex flex-center bg-grey-4 rounded-borders" style="height: 300px">
              <div class="text-subtitle2 text-grey-7">Nema fotografije</div>
            </div>
          </div>

          <div class="col-12 col-md-6 column justify-between">
            <div>
              <q-input v-if="editing" v-model="editedProduct.name" label="Naziv" />
              <div v-else class="text-h4 q-mb-xs">{{ product.name }}</div>
              <q-select
                v-if="editing"
                v-model="editedProduct.category"
                :options="kategorije"
                label="Kategorija"
                emit-value
                map-options
                dense
              />
              <div v-else class="text-caption text-grey">{{ product.category }}</div>

              <q-separator class="q-my-sm" />
              <q-input v-if="editing" v-model="editedProduct.description" label="Opis" />
              <div v-else class="q-mb-md">{{ product.description }}</div>

              <div class="text-grey text-caption q-mb-xs">Cijena</div>
              <q-input
                v-if="editing"
                v-model="editedProduct.price"
                label="Cijena"
                type="number"
                step="0.01"
                min="0"
              />
              <div v-else class="text-h4 text-bold q-mb-md">{{ product.price }} €</div>
            </div>
            <div
              v-if="product.inStock !== undefined && product.inStock > 0 && product.inStock < 10"
              class="text-negative q-mt-xs"
            >
              Požuri, ostalo na stanju samo {{ product.inStock }} artikala
            </div>
            <div class="row items-center q-gutter-sm">
              <q-btn
                flat
                color="primary"
                icon="remove"
                @click="decreaseQuantity"
                :disable="isProductDisabled(product)"
              />
              <q-input
                dense
                v-model="kolicina"
                type="number"
                style="width: 60px"
                min="1"
                max="product.inStock"
                :rules="[
                  (val) => (val >= 1 && val <= product.inStock) || `Min 1, Max ${product.inStock}`,
                ]"
                :disable="isProductDisabled(product)"
              />
              <q-btn
                flat
                color="primary"
                icon="add"
                @click="increaseQuantity"
                :disable="isProductDisabled(product)"
              />
              <q-btn
                color="green"
                class="q-ml-sm"
                icon="shopping_cart"
                :label="getButtonLabel(product)"
                @click="addToCart"
                :disable="isProductDisabled(product)"
              />
              <AddToCartDialog ref="addToCartDialog" />

              <CartAnimation />
            </div>
          </div>
        </div>
      </q-card>
      <div v-else>
        <q-banner class="bg-red text-white"> Proizvod više nije dostupan. </q-banner>
      </div>
      <q-card
        v-if="auth.isAdmin && product"
        class="q-mt-md bg-grey-1 q-pa-md q-rounded-lg shadow-1 flex-center animate__animated animate__fadeInUp"
      >
        <div v-if="editing" class="row q-gutter-sm justify-end">
          <q-btn color="primary" label="Spremi promjene" @click="saveChanges" />
          <q-btn color="grey" label="Odustani" flat @click="cancelEditing" />
        </div>
        <div v-else class="row q-gutter-sm justify-end">
          <q-btn color="primary" label="Uredi proizvod" @click="startEditing" />
          <q-btn color="negative" label="Obriši proizvod" @click="deleteProduct" />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'
import AddToCartDialog from 'components/AddToCartDialog.vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const route = useRoute()
const productId = route.params.id
const slide = ref(0)
const kolicina = ref(1)
const addToCartDialog = ref(null)
const cartStore = useCartStore()
const productsStore = useProductsStore()

const product = ref(null)
const loading = ref(true)
const kategorije = productsStore.kategorije
const auth = useAuthStore()
const editing = ref(false)
const editedProduct = ref({ ...product.value })

let unsubscribe = null

onMounted(() => {
  loading.value = true
  unsubscribe = productsStore.subscribeProductById(productId, (updatedProduct) => {
    product.value = updatedProduct
    if (updatedProduct) {
      editedProduct.value = { ...updatedProduct }
    }
    loading.value = false
  })
})

onUnmounted(() => {
  if (typeof unsubscribe === 'function') {
    unsubscribe()
  }
})

function increaseQuantity() {
  if (kolicina.value < product.value.inStock) {
    kolicina.value++
  }
}
function decreaseQuantity() {
  if (kolicina.value > 1) kolicina.value--
}

function addToCart() {
  if (kolicina.value > product.value.inStock) {
    alert(`Nažalost, na zalihi je samo ${product.value.inStock} komada.`)

    return
  }
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    quantity: kolicina.value,
    inStock: product.value.inStock,
  })

  addToCartDialog.value.open()

  kolicina.value = 1
}

function startEditing() {
  editing.value = true
  editedProduct.value = { ...product.value, images: [...(product.value.images || [])] }
}

function cancelEditing() {
  editing.value = false
}

async function saveChanges() {
  editedProduct.value.price = parseFloat(editedProduct.value.price)
  try {
    await productsStore.saveProductChanges(editedProduct.value)
    product.value = { ...editedProduct.value }
    editing.value = false
  } catch (error) {
    console.error('Spremanje nije uspjelo:', error)
  }
}
const router = useRouter()
async function deleteProduct() {
  const confirmed = confirm('Jeste li sigurni da želite obrisati ovaj proizvod?')
  if (!confirmed) return
  const id = product.value?.id
  try {
    await productsStore.deleteProductById(id)
    cartStore.removeItem(id)
    await router.push('/')
  } catch (error) {
    console.error('Greška pri brisanju proizvoda:', error)
  }
}

function isProductDisabled(product) {
  return auth.isAdmin || !product.inStock || product.inStock <= 0 || product.price <= 0
}

function getButtonLabel(product) {
  return isProductDisabled(product) ? 'Trenutno nedostupno' : 'Dodaj u košaricu'
}
</script>
