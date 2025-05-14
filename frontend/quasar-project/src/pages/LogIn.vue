<template>
  <q-page class="column flex-center items-center bg-grey-2">
    <div class="q-mb-xl">
      <img
        alt="Quasar logo"
        src="~assets/quasar-logo-vertical.svg"
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
const auth = useAuthStore()

const email = ref('')
const password = ref('')

function login() {
  console.log('Email:', email.value)
  console.log('Password:', password.value)

  if (email.value === 'korisnik@email.com' && password.value === 'korisnik') {
    auth.login({
      username: 'korisnik',
      isAdmin: false,
    })
    router.push('/')
  } else if (email.value === 'admin@email.com' && password.value === 'admin') {
    auth.login({
      username: 'admin',
      isAdmin: true,
    })
    router.push('/')
  } else {
    alert('Neispravni podaci. Pokušajte ponovno.')
  }
}
</script>
