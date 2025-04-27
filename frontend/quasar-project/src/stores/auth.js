import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    isAdmin: false,
  }),
  actions: {
    login(userData) {
      this.user = userData
      this.isLoggedIn = true
      this.isAdmin = userData.isAdmin || false
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      this.isAdmin = false
    },
    register(userData) {
      // ovdje ide registracija
      this.login(userData) // user se odmah logira nakon registracije
    },
  },
})
