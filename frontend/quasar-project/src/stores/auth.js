import { defineStore } from 'pinia'

let autoLogoutTimer = null

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
      if (this.isAdmin) {
        const loginTime = Date.now()
        localStorage.setItem('adminLoginTime', loginTime.toString())

        this.setAdminAutoLogout()
      }
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      this.isAdmin = false

      localStorage.removeItem('authUser')
      localStorage.removeItem('adminLoginTime')
      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer)
        autoLogoutTimer = null
      }
    },
    register(userData) {
      // ovdje ide registracija
      this.login(userData)
    },
    loadUserFromStorage() {
      const storedUser = localStorage.getItem('authUser')

      if (storedUser) {
        const userData = JSON.parse(storedUser)

        if (userData.isAdmin) {
          const loginTime = Number(localStorage.getItem('adminLoginTime'))
          const now = Date.now()
          const diff = now - loginTime

          const fifteenMinutes = 15 * 60 * 1000
          if (diff >= fifteenMinutes) {
            this.logout()

            return
          }

          this.setAdminAutoLogout(fifteenMinutes - diff)
        }

        this.login(userData)
      }
    },

    setAdminAutoLogout(remainingTime = 15 * 60 * 1000) {
      if (autoLogoutTimer) clearTimeout(autoLogoutTimer)

      autoLogoutTimer = setTimeout(() => {
        this.logout()
        alert('Admin sesija je istekla nakon 15 minuta.')
      }, remainingTime)
    },
  },
})
