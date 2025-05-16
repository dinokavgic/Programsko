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
      <q-form @submit="register" ref="registerForm">
        <q-input
          v-model="fullName"
          label="Ime i prezime"
          placeholder="Ime i prezime"
          class="q-mb-md"
          outlined
          :rules="[(val) => !!val || 'Ime je obavezno']"
          hide-bottom-space
        />

        <q-input
          v-model="email"
          type="email"
          label="Email adresa"
          placeholder="email@primjer.com"
          class="q-mb-md"
          outlined
          :rules="[
            (val) => !!val || 'Email je obavezan',
            (val) => val.includes('@') || 'Email mora sadržavati @',
          ]"
          hide-bottom-space
        />

        <q-input
          v-model="password"
          type="password"
          label="Lozinka"
          placeholder="Lozinka"
          class="q-mb-md"
          outlined
          :rules="[
            (val) => !!val || 'Lozinka je obavezna',
            (val) => val.length >= 8 || 'Lozinka mora imati barem 8 znakova',
          ]"
          hide-bottom-space
        />

        <q-input
          v-model="confirmPassword"
          type="password"
          label="Ponovite lozinku"
          placeholder="Lozinka"
          class="q-mb-lg"
          outlined
          :rules="[(val) => val === password || 'Lozinke se ne podudaraju']"
        />
      </q-form>

      <q-btn label="Registracija" color="primary" class="full-width" @click="register" />

      <div class="text-center q-mt-md">
        Već posjedujete račun?
        <router-link to="/login" class="text-primary">Prijavite se</router-link>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { useAuthStore } from 'stores/auth'
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
    async register() {
      const isValid = await this.$refs.registerForm.validate()
      if (!isValid) return
      const authStore = useAuthStore()
      const newUser = {
        fullName: this.fullName,
        email: this.email,
        password: this.password,
        isAdmin: false,
      }
      try {
        authStore.register(newUser)
        const redirectPath = this.$route.query.redirect || '/'
        this.$router.push(redirectPath)
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          alert('Email adresa je već u upotrebi.')
        } else {
          alert('Registracija nije uspjela. ' + error.message)
        }

        return
      }
    },
  },
}
</script>
