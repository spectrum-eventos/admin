
export default [
  {
    path: '/',
    component: () => import('layouts/private'),
    meta: { auth: true },
    children: [
      {
        path: '',
        component: () => import('pages/qrcodegenerator/index'),
      },
      {
        path: 'admin',
        component: () => import('pages/admin/index'),
        children: [
          { path: '', component: () => import('pages/admin/list') },
          { path: 'create', component: () => import('pages/admin/create') },
          { path: 'edit/:id', component: () => import('pages/admin/edit'), props: route => ({ id: route.params.id }) },
          { path: 'show/:id', component: () => import('pages/admin/show'), props: route => ({ id: route.params.id }) },
        ],
      },
      {
        path: 'event',
        component: () => import('pages/event/list'),
      },
    ],
  },

  {
    path: '/event/:id',
    component: () => import('pages/event/index'),
    meta: { auth: true },
    children: [
      { path: 'list', component: () => import('pages/list/list') },
      { path: 'frequency', component: () => import('pages/event/frequency') },
    ],
  },

  {
    path: '/list/:id',
    component: () => import('pages/list/index'),
    meta: { auth: true },
    children: [
      { path: 'presence', component: () => import('pages/presence/list') },
    ],
  },

  {
    path: '/login',
    component: () => import('layouts/public'),
    meta: { auth: false },
    children: [
      { path: '', component: () => import('pages/login/index') },
    ],
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404'),
  },
];
