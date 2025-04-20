<template>
  <div class="bg-grey-2" style="min-height: 93vh; display: grid; place-items: center">
    <div class="" style="max-width: 60%; width: 100%">
      <q-card class="bg-grey-1 q-pa-md q-rounded-lg shadow-2 animate__animated animate__fadeInUp">
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
              <div class="text-h4 q-mb-xs">{{ product.name }}</div>
              <div class="text-caption text-grey">{{ product.category }}</div>

              <q-separator class="q-my-sm" />

              <div class="q-mb-md">{{ product.description }}</div>

              <div class="text-grey text-caption q-mb-xs">Cijena</div>
              <div class="text-h4 text-bold q-mb-md">{{ product.price }} €</div>
            </div>

            <div class="row items-center q-gutter-sm">
              <q-btn flat color="primary" icon="remove" @click="decreaseQuantity" />
              <q-input
                dense
                v-model="quantity"
                type="number"
                style="width: 60px"
                min="1"
                max="99"
                :rules="[(val) => (val >= 1 && val <= 99) || 'Min 1, Max 99']"
              />
              <q-btn flat color="primary" icon="add" @click="increaseQuantity" />
              <q-btn
                color="green"
                class="q-ml-sm"
                icon="shopping_cart"
                label="Dodaj u košaricu"
                @click="addToCart"
              />
              <AddToCartDialog ref="addToCartDialog" />

              <CartAnimation />
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AddToCartDialog from 'components/AddToCartDialog.vue'

const route = useRoute()
const productId = route.params.id
const slide = ref(0)
const quantity = ref(1)
const addToCartDialog = ref(null)

const product = ref({
  id: productId,
  name: 'Naziv proizvoda',
  category: 'Kategorija',
  description: 'Neki brzi primjerni tekst u funkciji opisa proizvoda...',
  price: 29.99,
  images: [],
})

function increaseQuantity() {
  quantity.value++
}
function decreaseQuantity() {
  if (quantity.value > 1) quantity.value--
}

function addToCart() {
  console.log('Dodano u košaricu:', productId, 'x', quantity.value)

  addToCartDialog.value.open()
  quantity.value = 1
}
</script>
