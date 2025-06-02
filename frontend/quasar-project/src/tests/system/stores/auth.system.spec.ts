import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from 'stores/auth.js'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('src/firebase', () => ({
  db: {},
  auth: {},
  storage: {},
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(() =>
    Promise.resolve({ user: { uid: 'abc123', email: 'test@mail.com' } })
  ),
  createUserWithEmailAndPassword: vi.fn(() =>
    Promise.resolve({ user: { uid: 'abc123', email: 'test@mail.com' } })
  ),
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'mockDocRef'),
  getDoc: vi.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({ fullName: 'Test Korisnik', isAdmin: false }),
    })
  ),
  setDoc: vi.fn(() => Promise.resolve()),
}))

describe('Auth Store – System Test (Vitest)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('loginWithEmail should set user state after successful login', async () => {
    const store = useAuthStore()
    await store.loginWithEmail({ email: 'test@mail.com', password: 'pass123' })

    expect(store.user.email).toBe('test@mail.com')
    expect(store.isLoggedIn).toBe(true)
  })

  it('register should create user and login', async () => {
    const store = useAuthStore()
    await store.register({
      email: 'new@mail.com',
      password: 'lozinka123',
      fullName: 'Novi Korisnik',
    })

    expect(store.user.email).toBe('test@mail.com')
    expect(store.user.fullName).toBe('Test Korisnik')
    expect(store.isLoggedIn).toBe(true)
  })
})
