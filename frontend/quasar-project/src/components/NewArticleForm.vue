<template>
    <q-card style="min-width: 400px">
      <q-card-section class="text-h6">Novi članak</q-card-section>
      <q-separator />
  
      <q-card-section>
        <q-input
          v-model="form.title"
          label="Naslov"
          outlined
          dense
          lazy-rules
          :rules="[ val => !!val || 'Naslov je obavezan' ]"
        />
        <q-select
          v-model="form.category"
          :options="categories"
          label="Kategorija"
          outlined
          dense
          class="q-mt-md"
        />
        <q-input
          v-model="form.text"
          type="textarea"
          label="Tekst"
          outlined
          dense
          rows="4"
          class="q-mt-md"
        />
      </q-card-section>
  
      <q-card-actions align="right">
        <q-btn flat label="Odustani" @click="$emit('cancel')" />
        <q-btn
          color="primary"
          label="Objavi"
          :disable="!canSubmit"
          @click="submit()"
        />
      </q-card-actions>
    </q-card>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const emit = defineEmits(['submitted','cancel'])
  const form = ref({
    title: '',
    category: null,
    text: ''
  })
  const categories = ['Općenito','Iskustva','Moji članci']
  
  const canSubmit = computed(() =>
    form.value.title && form.value.category && form.value.text
  )
  
  function submit() {
    const now = new Date()
    emit('submitted', {
      id: Date.now(),
      title: form.value.title,
      category: form.value.category,
      author: 'Trenutni korisnik',  // kasnije iz auth
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString(),
      text: form.value.text,
      comments: [],
      points: 0
    })
    // očisti formu
    form.value.title = ''
    form.value.category = null
    form.value.text = ''
  }
  </script>