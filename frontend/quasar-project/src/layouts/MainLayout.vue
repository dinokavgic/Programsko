<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar class="q-px-md q-py-sm">
        <q-btn flat round icon="local_cafe" size="md" @click="refreshPage" />

        <div class="q-toolbar-title">
          <q-btn flat label="Početna" to="/" />
          <q-btn flat label="Forum" to="/Forum" />
          <q-btn flat label="Profil" to="/UserProfil" />
        </div>

        <q-space />
        <q-btn flat label="Odjava" @click="showLogoutDialog = true" />
        <LogoutDialog v-model="showLogoutDialog" />
        <q-btn flat label="Prijava" to="/LogIn" />
        <q-btn flat label="Registracija" to="/Register" />
        <div class="row items-center no-wrap">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Pretraži"
            class="q-mr-sm"
            style="width: 200px"
          />
          <q-btn unelevated class="bg-green-3 text-black q-mr-sm" label="Pretraži" />

          <q-btn flat round icon="shopping_cart" @click="toggleCart" />
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="isCartOpen" side="right" overlay behavior="desktop" :width="300" elevated>
      <div class="q-pa-md column justify-between fit">
        <div>
          <div class="text-h4 text-center text-weight-bold">Košarica</div>
          <q-separator class="q-my-md" />
          <div v-if="cartItems.length === 0" class="text-subtitle1 text-center text-grey">
            Vaša košarica je prazna.
          </div>
          <q-scroll-area style="height: calc(100vh - 313px)">
            <q-card
              v-for="(item, index) in cartItems"
              :key="item.id"
              class="q-pa-sm q-mb-md"
              flat
              bordered
            >
              <div class="row items-start justify-between">
                <div class="text-blue text-subtitle2 q-mr-sm">{{ index + 1 }}.</div>
                <div class="text-subtitle1 text-weight-medium">{{ item.name }}</div>
                <q-btn icon="close" size="sm" flat dense class="q-ml-auto" />
              </div>

              <div class="row items-center justify-between q-mt-sm">
                <div class="row items-center">
                  <q-btn dense size="sm" color="primary" icon="remove" class="q-mr-sm" />
                  <div>{{ item.quantity }}</div>
                  <q-btn dense size="sm" color="primary" icon="add" class="q-ml-sm" />
                </div>
                <div class="text-weight-bold">{{ (item.price * item.quantity).toFixed(2) }} €</div>
              </div>
            </q-card>
          </q-scroll-area>
        </div>

        <div class="q-mt-md">
          <q-separator class="q-my-md" />
          <div class="text-h5 text-center text-weight-bold">{{ cartTotal }} €</div>
          <q-separator class="q-my-md" />
          <q-btn
            color="primary"
            label="Naruči"
            class="full-width"
            :disable="cartItems.length === 0"
          />
        </div>
      </div>
    </q-drawer>
    <q-page-container class="overflow-hidden">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import LogoutDialog from 'src/components/LogoutDialog.vue'
const showLogoutDialog = ref(false)
const searchQuery = ref('')

const refreshPage = () => {
  window.location.reload()
}

const isCartOpen = ref(false)
const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}
//Primjerni podaci
const cartItems = ref([
  {
    id: 1,
    name: 'Prvi proizvod',
    quantity: 2,
    price: 139.99,
  },
  {
    id: 2,
    name: 'Drugi proizvod',
    quantity: 4,
    price: 19.99,
  },
  {
    id: 3,
    name: 'Treći proizvod',
    quantity: 1,
    price: 59.99,
  },
  {
    id: 1,
    name: 'Prvi proizvod',
    quantity: 2,
    price: 139.99,
  },
  {
    id: 2,
    name: 'Drugi proizvod',
    quantity: 4,
    price: 19.99,
  },
  {
    id: 3,
    name: 'Treći proizvod',
    quantity: 1,
    price: 59.99,
  },
  {
    id: 1,
    name: 'Prvi proizvod',
    quantity: 2,
    price: 139.99,
  },
  {
    id: 2,
    name: 'Drugi proizvod',
    quantity: 4,
    price: 19.99,
  },
  {
    id: 3,
    name: 'Treći proizvod',
    quantity: 1,
    price: 59.99,
  },
])

const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
)
</script>
