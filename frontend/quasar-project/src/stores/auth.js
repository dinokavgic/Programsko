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

      localStorage.setItem('authUser', JSON.stringify(userData))
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      this.isAdmin = false

      localStorage.removeItem('authUser')
    },
    register(userData) {
      // ovdje ide registracija
      this.login(userData) // user se odmah logira nakon registracije
    },
    loadUserFromStorage() {
      const storedUser = localStorage.getItem('authUser')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        this.login(userData)
      }
    },
  },
})
