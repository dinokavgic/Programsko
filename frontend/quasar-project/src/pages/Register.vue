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
      <div class="text-h6 text-center q-mb-md">Novi korisnik</div>
      <q-input
        v-model="fullName"
        label="Ime i prezime"
        placeholder="Ime i prezime"
        class="q-mb-md"
        outlined
      />

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
        class="q-mb-md"
        outlined
      />

      <q-input
        v-model="confirmPassword"
        type="password"
        label="Ponovite lozinku"
        placeholder="Lozinka"
        class="q-mb-lg"
        outlined
      />

      <q-btn label="Registracija" color="primary" class="full-width" @click="register" />

      <div class="text-center q-mt-md">
        Već posjedujete račun?
        <router-link to="/login" class="text-primary">Prijavite se</router-link>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  },

  methods: {
    register() {
      if (this.password !== this.confirmPassword) {
        alert('Lozinke se ne podudaraju!')

        return
      }
      console.log('Ime i prezime:', this.fullName)
      console.log('Email:', this.email)
      console.log('Lozinka:', this.password)
    },
  },
}
</script>
