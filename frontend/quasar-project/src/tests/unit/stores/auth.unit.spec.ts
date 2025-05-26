import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from 'stores/auth.js'

describe('Auth Store – Unit Test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('logs user in and sets admin state', () => {
    const store = useAuthStore()

    const userData = {
      uid: '123',
      email: 'admin@example.com',
      fullName: 'Admin User',
      isAdmin: true,
    }

    store.login(userData)

    expect(store.user).toEqual(userData)
    expect(store.isLoggedIn).toBe(true)
    expect(store.isAdmin).toBe(true)
    expect(localStorage.getItem('authUser')).toBe(JSON.stringify(userData))
  })

  it('logs out user and clears localStorage', () => {
    const store = useAuthStore()

    store.user = { uid: '123', email: '', fullName: '', isAdmin: false }
    store.isLoggedIn = true
    store.isAdmin = true
    localStorage.setItem('authUser', 'something')
    localStorage.setItem('adminLoginTime', '123')

    store.logout()

    expect(store.user).toBeNull()
    expect(store.isLoggedIn).toBe(false)
    expect(store.isAdmin).toBe(false)
    expect(localStorage.getItem('authUser')).toBeNull()
    expect(localStorage.getItem('adminLoginTime')).toBeNull()
  })
})
