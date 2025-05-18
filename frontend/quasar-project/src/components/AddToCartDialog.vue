<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="q-pa-md" style="min-width: 300px; border-radius: 16px">
      <q-card-section class="row text-center q-pa-none">
        <q-icon name="shopping_cart" size="48px" color="black" class="q-mb-md" />
        <div class="text-h6">Proizvod je dodan u košaricu.</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
let autoCloseTimer = null

function open() {
  clearTimeout(autoCloseTimer)
  isOpen.value = true
  autoCloseTimer = setTimeout(() => {
    isOpen.value = false
  }, 900)
}

function close() {
  clearTimeout(autoCloseTimer)
  isOpen.value = false
}

defineExpose({ open, close })
</script>
