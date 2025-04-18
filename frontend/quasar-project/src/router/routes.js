const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'LogIn', component: () => import('pages/LogIn.vue') },
      { path: 'Register', component: () => import('pages/Register.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
  {
    path: '/LogIn',
    name: 'Login',
    component: () => import('pages/LogIn.vue'),
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import('pages/Register.vue'),
  },
]

export default routes
