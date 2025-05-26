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
      { path: 'Forum', component: () => import('pages/Forum.vue') },
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
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
