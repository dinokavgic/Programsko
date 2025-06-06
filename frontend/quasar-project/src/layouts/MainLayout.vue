<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar class="q-px-md q-py-sm">
        <q-btn flat round icon="local_cafe" size="md" @click="refreshPage"
          ><q-tooltip>Osvježi</q-tooltip></q-btn
        >

        <div class="q-toolbar-title">
          <q-btn flat label="Početna" to="/" />
          <q-btn flat label="Forum" to="/Forum" />
          <q-btn v-if="auth.isLoggedIn && !auth.isAdmin" flat label="Profil" to="/UserProfil" />
          <q-btn
            v-if="auth.isAdmin"
            flat
            round
            color="black"
            icon="vpn_key"
            size="md"
            to="/AdminPanel"
          >
            <q-tooltip>Admin panel</q-tooltip>
          </q-btn>
        </div>

        <q-space />
        <q-btn v-if="auth.isLoggedIn" flat label="Odjava" @click="showLogoutDialog = true" />
        <LogoutDialog v-model="showLogoutDialog" />
        <q-btn v-if="!auth.isLoggedIn" flat label="Prijava" to="/LogIn" />
        <q-btn v-if="!auth.isLoggedIn" flat label="Registracija" to="/Register" />
        <div class="row items-center no-wrap">
          <q-btn v-if="!auth.isAdmin" flat round icon="shopping_cart" @click="toggleCart"
            ><q-tooltip>Košarica</q-tooltip>
          </q-btn>
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
                <q-btn
                  icon="close"
                  size="sm"
                  flat
                  dense
                  class="q-ml-auto"
                  @click="removeItem(item.id)"
                />
              </div>

              <div class="row items-center justify-between q-mt-sm">
                <div class="row items-center">
                  <q-btn
                    dense
                    size="sm"
                    color="primary"
                    icon="remove"
                    class="q-mr-sm"
                    @click="decreaseQuantity(item.id)"
                  />
                  <div>{{ item.quantity }}</div>
                  <q-btn
                    dense
                    size="sm"
                    color="primary"
                    icon="add"
                    class="q-ml-sm"
                    @click="increaseQuantity(item.id)"
                  />
                </div>
                <div class="text-weight-bold">{{ (item.price * item.quantity).toFixed(2) }} €</div>
              </div>
            </q-card>
          </q-scroll-area>
        </div>

        <div v-if="cartItems.length > 0" class="q-mt-md">
          <q-separator class="q-my-md" />
          <div class="text-h5 text-center text-weight-bold">{{ cartTotal }} €</div>
          <q-separator class="q-my-md" />
          <q-btn
            color="primary"
            label="Naruči"
            class="full-width"
            :disable="cartItems.length === 0"
            to="/PredajNarudzbu"
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
import { ref, computed, onMounted } from 'vue'
import LogoutDialog from 'src/components/LogoutDialog.vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.cartItems)
const cartTotal = computed(() => cartStore.cartTotal)

const showLogoutDialog = ref(false)

const auth = useAuthStore()

const refreshPage = () => {
  window.location.reload()
}

const isCartOpen = ref(false)
const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const removeItem = (productId) => {
  cartStore.removeItem(productId)
}

const increaseQuantity = (productId) => {
  cartStore.increaseQuantity(productId)
}

const decreaseQuantity = (productId) => {
  cartStore.decreaseQuantity(productId)
}

onMounted(async () => {
  await cartStore.syncCartWithStock()
  cartStore.subscribeToCartStock()
})
</script>
