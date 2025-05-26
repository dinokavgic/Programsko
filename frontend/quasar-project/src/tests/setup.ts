import '@testing-library/jest-dom' // za custom jest matchere (ako koristiš testing-library)
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})
