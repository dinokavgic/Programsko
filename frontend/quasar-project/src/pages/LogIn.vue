<template>
  <q-page class="column flex-center items-center bg-grey-2">
    <div class="q-mb-xl">
      <img
        alt="coffee cup logo"
        src="~assets/coffee-cup-logo-coffee-shop-icon-design-free-vector.jpg"
        style="width: 120px; height: 120px"
      />
    </div>
    <q-card class="q-pa-lg" style="width: 100%; max-width: 400px">
      <div class="text-h6 text-center q-mb-md">Postojeći korisnik</div>

      <q-input
        v-model="email"
        type="email"
        label="Email adresa"
        placeholder="email@primjer.com"
        class="q-mb-md"
        outlined
      />

      <q-input
        v-model="password"
        type="password"
        label="Lozinka"
        placeholder="Lozinka"
        class="q-mb-lg"
        outlined
      />

      <q-btn label="Prijava" color="primary" class="full-width" @click="login" />
      <div class="text-center q-mt-md">
        Nemate račun?
        <router-link to="/Register" class="text-primary">Registrirajte se</router-link>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function login() {
  try {
    await authStore.loginWithEmail({ email: email.value, password: password.value })

    const redirectPath = router.currentRoute.value.query.redirect || '/'
    router.push(redirectPath)
  } catch (error) {
    console.error('Login error:', error)
    alert('Neispravni podaci. Pokušajte ponovno.')
  }
}
</script>
