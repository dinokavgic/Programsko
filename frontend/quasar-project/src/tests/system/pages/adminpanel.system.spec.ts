import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AdminPanel from 'src/pages/AdminPanel.vue'

const routes = [{ path: '/', component: AdminPanel }]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

describe('AdminPanel.vue - System', () => {
  it('navigira na panel i prikazuje tab za dodavanje proizvoda', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(AdminPanel, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Dodaj proizvod')
  })
})
