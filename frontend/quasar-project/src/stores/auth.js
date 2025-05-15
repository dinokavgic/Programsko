import { defineStore } from 'pinia'
import { auth, db } from 'src/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

let autoLogoutTimer = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    isAdmin: false,
  }),
  actions: {
    async loginWithEmail({ email, password }) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        const userDocRef = doc(db, 'users', user.uid)
        const userSnapshot = await getDoc(userDocRef)

        if (!userSnapshot.exists()) {
          throw new Error('Korisnički podaci nisu pronađeni u bazi.')
        }

        const userData = userSnapshot.data()
        this.user = {
          uid: user.uid,
          email: user.email,
          fullName: userData.fullName,
          isAdmin: userData.isAdmin || false,
        }
        this.isLoggedIn = true
        this.isAdmin = this.user.isAdmin || false

        localStorage.setItem('authUser', JSON.stringify(this.user))
        if (this.isAdmin) {
          const loginTime = Date.now()
          localStorage.setItem('adminLoginTime', loginTime.toString())

          this.setAdminAutoLogout()
        }
      } catch (error) {
        console.error('Greška pri loginu:', error.message)
        throw error
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
    async register(newUser) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          newUser.email,
          newUser.password
        )
        const user = userCredential.user
        this.user = user

        await setDoc(doc(db, 'users', user.uid), {
          fullName: newUser.fullName,
          email: newUser.email,
          isAdmin: false,
          createdAt: new Date(),
        })
      } catch (error) {
        console.error('Greška pri registraciji:', error.message)
        throw error
      }
      this.login(newUser)
    },
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
