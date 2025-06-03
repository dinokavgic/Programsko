import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterPage from 'src/pages/Register.vue'
import { Quasar, QInput, QForm, QBtn, QCard } from 'quasar'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'

describe('RegisterPage.vue – System Test', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
  })

  it('prikazuje formu i reagira na validaciju', async () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [Quasar, createTestingPinia(), router],
        components: { QInput, QForm, QBtn, QCard },
        stubs: ['router-link'],
      },
    })

    expect(wrapper.text()).toContain('Novi korisnik')

    const button = wrapper.findComponent(QBtn)
    await button.trigger('click')

    expect(wrapper.text()).toContain('Ime je obavezno')
    expect(wrapper.text()).toContain('Email je obavezan')
    expect(wrapper.text()).toContain('Lozinka je obavezna')

    await wrapper.findAllComponents(QInput)[0].setValue('Test Korisnik')
    await wrapper.findAllComponents(QInput)[1].setValue('test@example.com')
    await wrapper.findAllComponents(QInput)[2].setValue('lozinka123')
    await wrapper.findAllComponents(QInput)[3].setValue('lozinka123')

    await button.trigger('click')

    expect(wrapper.text()).not.toContain('Ime je obavezno')
    expect(wrapper.text()).not.toContain('Lozinka je obavezna')
  })
})
