<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar class="q-px-md q-py-sm">
        <q-btn flat round icon="local_cafe" size="md" @click="refreshPage" />

        <div class="q-toolbar-title">
          <q-btn flat label="Početna" to="/" />
          <q-btn flat label="Forum" to="/Forum" />
          <q-btn flat label="Profil" to="/Profil" />
        </div>

        <q-space />
        <q-btn flat label="Prijava" to="/LogIn" />
        <q-btn flat label="Registracija" />
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
        <div class="text-h4 text-center q-mb-sm text-weight-bold">Košarica</div>
        <q-separator class="q-my-md" />
        <!-- Ovdje idu artikli (ostavljam prazno) -->

        <div class="scroll" style="flex: 1; overflow-y: auto"></div>
        <q-separator class="q-my-md" />
        <div class="q-mt-md">
          <div class="text-h4 text-center q-mb-sm">300,00€</div>
          <q-separator class="q-my-md" />
          <q-btn color="primary" label="Naruči" class="full-width" />
        </div>
      </div>
    </q-drawer>
    <q-page-container class="overflow-hidden">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const refreshPage = () => {
  window.location.reload()
}

const isCartOpen = ref(false)
const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}
</script>
