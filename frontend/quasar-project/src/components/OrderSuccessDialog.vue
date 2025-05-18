<template>
  <q-dialog v-model="visible" persistent transition-show="scale" transition-hide="scale">
    <q-card
      class="q-pa-md text-center"
      style="min-width: 300px; max-width: 400px; border-radius: 16px"
    >
      <q-icon name="check_circle" color="green" size="40px" class="q-mr-md q-pt-xl" />
      <q-card-section class="row items-center q-py-md flex flex-center">
        <div class="text-h6">Narudžba zaprimljena!</div>
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <div>Hvala na kupnji. Vaša narudžba je uspješno poslana i bit će uskoro obrađena.</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="U redu" color="primary" @click="onClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const visible = ref(true)
const emit = defineEmits(['close'])

function onClose() {
  visible.value = false
  emit('close')
}
</script>
