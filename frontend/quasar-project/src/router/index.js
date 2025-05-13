import { defineRouter } from '#q-app/wrappers'
import { useAuthStore } from 'stores/auth'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import 'animate.css'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    // Ako ruta traži logiranog korisnika, ali korisnik nije logiran
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return next('/LogIn')
    }

    // Ako ruta traži admina, a korisnik nije admin
    if (to.meta.requiresAdmin && !auth.isAdmin) {
      return next('/')
    }

    // Ako je korisnik logiran, a pokušava na login ili register
    if (to.meta.guestOnly && auth.isLoggedIn) {
      return next('/')
    }

    return next()
  })

  return Router
})
