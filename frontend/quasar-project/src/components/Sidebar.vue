<template>
    <div>
      <q-card class="q-mb-md">
        <q-card-section class="text-subtitle2">Kategorije</q-card-section>
        <q-list bordered>
          <q-item clickable v-ripple>
            <q-item-section>Općenito</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>Iskustva</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>Moji članci</q-item-section>
          </q-item>
        </q-list>
      </q-card>
  
      <q-card>
        <q-card-section class="text-subtitle2">Sortiraj</q-card-section>
        <q-list bordered>
         
            <q-item clickable v-ripple @click="sortBy('date_desc')">
  <q-item-section>Datum dolje</q-item-section>
</q-item>
          <q-item clickable v-ripple @click="sortBy('date_asc')">
  <q-item-section>Datum gore</q-item-section>
</q-item>
        </q-list>
      </q-card>
      <q-card class="q-mt-md">
 
    </q-card>

    </div>
    
  </template>
  
  <script setup>
  const emit = defineEmits(['sort'])

function sortBy(option) {
  emit('sort', option)
}
  </script>


