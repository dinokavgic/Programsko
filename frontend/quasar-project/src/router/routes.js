const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'LogIn', component: () => import('pages/LogIn.vue'), meta: { guestOnly: true } },
      {
        path: 'Register',
        component: () => import('pages/Register.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'UserProfil',
        component: () => import('pages/UserProfil.vue'),
        meta: { requiresAuth: true },
      },
      { path: 'Proizvod/:id', component: () => import('pages/Proizvod.vue') },

      {
        path: 'Forum',
        component: () => import('pages/Forum.vue')
      },
      {
        path: 'AdminPanel',
        component: () => import('pages/AdminPanel.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'PredajNarudzbu',
        component: () => import('pages/PredajNarudzbu.vue'),
        meta: { requiresAuth: true },
      },
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
  {
    path: '/UserProfil',
    name: 'UserProfil',
    component: () => import('src/pages/UserProfil.vue'),
  },
  {
    path: '/Proizvod/:id',
    component: () => import('src/pages/Proizvod.vue'),
  },
  {
    path: '/Forum',
    name: 'Forum',
    component: () => import('src/pages/Forum.vue'),
  },
  {
    path: '/AdminPanel',
    component: () => import('src/pages/AdminPanel.vue'),
  },
  {
    path: '/PredajNarudzbu',
    component: () => import('src/pages/PredajNarudzbu.vue'),
  },
]

export default routes
