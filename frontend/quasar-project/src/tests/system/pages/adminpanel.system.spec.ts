import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AdminPanel from 'src/pages/AdminPanel.vue'
import {
  Quasar,
  Ripple,
  QLayout,
  QPage,
  QCard,
  QTabs,
  QTab,
  QTabPanels,
  QTabPanel,
  QForm,
  QInput,
  QSelect,
  QBtn,
  QUploader,
  QSeparator,
  QPageContainer,
} from 'quasar'

const routes = [{ path: '/', component: AdminPanel }]
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

function mountWithLayout() {
  return mount(
    {
      template: `
      <q-layout>
        <q-page-container>
          <q-page>
            <admin-panel />
          </q-page>
        </q-page-container>
      </q-layout>
    `,
      components: { AdminPanel, QLayout, QPage, QPageContainer },
    },
    {
      global: {
        plugins: [router, Quasar],
        components: {
          QCard,
          QTabs,
          QTab,
          QTabPanels,
          QTabPanel,
          QForm,
          QInput,
          QSelect,
          QBtn,
          QUploader,
          QSeparator,
        },
        directives: { Ripple },
      },
    }
  )
}

describe('AdminPanel.vue - System test', () => {
  beforeAll(async () => {
    router.push('/')
    await router.isReady()
  })

  it('prikazuje naslov i tabove', async () => {
    const wrapper = mountWithLayout()
    await flushPromises()

    expect(wrapper.text()).toContain('Administratorska ploča')

    const tabDodajProizvod = wrapper.find('[data-testid="tab-dodaj-proizvod"]')
    expect(tabDodajProizvod.exists()).toBe(true)
    expect(tabDodajProizvod.text()).toBe('Dodaj proizvod')
  })

  it('prikazuje osnovne inpute za unos proizvoda', async () => {
    const wrapper = mountWithLayout()
    await flushPromises()

    expect(wrapper.find('[data-testid="input-naziv"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-opis"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="dodaj-kategoriju"]').exists()).toBe(true)
  })

  it('omogućuje prikaz inputa za novu kategoriju nakon klika na "+"', async () => {
    const wrapper = mountWithLayout()
    await flushPromises()

    const btnDodajKategoriju = wrapper.find('[data-testid="dodaj-kategoriju"]')
    await btnDodajKategoriju.trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="input-nova-kategorija"]').exists()).toBe(true)
  })
})
