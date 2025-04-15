<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar class="q-px-md q-py-sm">
        <q-btn flat round icon="local_cafe" size="md" />

        <div class="q-toolbar-title">
          <q-btn flat label="Početna" />
          <q-btn flat label="Forum" />
          <q-btn flat label="Profil" />
        </div>

        <q-space />

        <div class="row items-center no-wrap">
          <q-input dense outlined placeholder="Pretraži" class="q-mr-sm" style="width: 200px" />
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
