import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from 'stores/auth'

jest.mock('src/firebase', () => ({
  db: {},
  auth: {},
  storage: {},
}))

jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: 'abc123', email: 'test@mail.com' } })
  ),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: 'abc123', email: 'test@mail.com' } })
  ),
}))

// Mock Firebase firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => 'mockDocRef'),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({ fullName: 'Test Korisnik', isAdmin: false }),
    })
  ),
  setDoc: jest.fn(() => Promise.resolve()),
}))

describe('Auth Store – System Test (Jest)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
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

    expect(store.user.email).toBe('test@mail.com') // Ovo može zbuniti jer registracija vraća email iz mocka (test@mail.com), a ne new@mail.com
    expect(store.user.fullName).toBe('Test Korisnik') // Ovo dolazi iz mock `getDoc` firestore funkcije
    expect(store.isLoggedIn).toBe(true)
  })
})
