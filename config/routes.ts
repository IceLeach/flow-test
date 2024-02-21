export default [
  {
    path: '/',
    component: '@/layouts/GlobalLayout',
    routes: [
      { path: '/', redirect: '/guide' },
      { path: '/guide', component: './Guide' },
      { path: '/configuration', component: './Configuration' },
    ],
  },
];
