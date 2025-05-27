import { setActivePinia, createPinia } from 'pinia'

// Polifill za localStorage u Node.js test okruženju
class LocalStorageMock {
  private store: Record<string, string> = {}

  clear() {
    this.store = {}
  }

  getItem(key: string) {
    return this.store[key] || null
  }

  setItem(key: string, value: string) {
    this.store[key] = value.toString()
  }

  removeItem(key: string) {
    delete this.store[key]
  }
}

// @ts-ignore
global.localStorage = new LocalStorageMock()

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})
