<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar class="q-px-md q-py-sm">
        <q-btn flat round icon="local_cafe" size="md" @click="refreshPage" />

        <div class="q-toolbar-title">
          <q-btn flat label="Početna" to="/" />
          <q-btn flat label="Forum" to="/Forum" />
          <q-btn flat label="Profil" to="/Profil" />
        </div>

        <q-space />
        <q-btn flat label="Prijava" />
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

          <q-btn flat round icon="shopping_cart" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
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
</script>
