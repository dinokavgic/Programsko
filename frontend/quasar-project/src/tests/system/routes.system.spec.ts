import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'

const IndexPage = defineComponent({ template: '<div>Index Page</div>' })
const LogIn = defineComponent({ template: '<div>Login Page</div>' })
const ErrorNotFound = defineComponent({ template: '<div>404 Not Found</div>' })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: defineComponent({ template: '<router-view />' }),
    children: [
      { path: '', component: IndexPage },
      { path: 'LogIn', component: LogIn },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },
]

const AppWrapper = defineComponent({
  template: '<router-view />',
})

describe('Router - System Tests', () => {
  let router: ReturnType<typeof createRouter>

  const mountWithRouter = async (initialPath: string) => {
    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    router.push(initialPath)
    await router.isReady()

    return mount(AppWrapper, {
      global: {
        plugins: [router],
      },
    })
  }

  it('navigira na početnu stranicu "/"', async () => {
    const wrapper = await mountWithRouter('/')
    expect(wrapper.html()).toContain('Index Page')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('navigira na /LogIn', async () => {
    const wrapper = await mountWithRouter('/LogIn')
    expect(wrapper.html()).toContain('Login Page')
    expect(router.currentRoute.value.path).toBe('/LogIn')
  })

  it('navigira na nepostojeću stranicu', async () => {
    const wrapper = await mountWithRouter('/nepostojeca')
    expect(wrapper.html()).toContain('404 Not Found')
    expect(router.currentRoute.value.matched[0].path).toBe('/:catchAll(.*)*')
  })
})
