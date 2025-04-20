<template>
  <q-dialog v-model="internalModelValue" persistent>
    <q-card
      class="bg-white text-black q-pa-lg"
      style="min-width: 300px; max-width: 90vw; border-radius: 16px"
    >
      <div class="text-h6 text-center q-mb-md">
        <q-icon name="home" size="36px" color="black" class="q-mb-sm" />
        <div>Jeste li sigurni da se želite odjaviti?</div>
      </div>
      <q-card-actions align="around">
        <q-btn flat label="Ne" color="primary" @click="emit('update:modelValue', false)" />
        <q-btn unelevated label="Da" color="negative" @click="handleLogout" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])

const router = useRouter()

const internalModelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function handleLogout() {
  console.log('Korisnik se odjavio')
  emit('update:modelValue', false)
  router.push('/')
}
</script>
