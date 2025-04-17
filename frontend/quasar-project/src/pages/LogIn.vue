<template>
  <q-page class="column flex-center items-center bg-grey-2">
    <div class="q-mb-xl">
      <img
        alt="Quasar logo"
        src="~assets/quasar-logo-vertical.svg"
        style="width: 140px; height: 140px"
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
        <router-link to="/register" class="text-primary">Registrirajte se</router-link>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      console.log('Email:', this.email)
      console.log('Password:', this.password)
    },
  },
}
</script>
