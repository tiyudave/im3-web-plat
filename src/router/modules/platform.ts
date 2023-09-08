import { $t } from '@/plugins/i18n'
import { about } from '@/router/enums'

export default {
  path: '/platforms',
  name: 'platform',
  redirect: '/platforms/list',
  meta: {
    icon: 'menu',
    title: '平台管理',
    rank: 10,
  },
  children: [
    {
      path: '/platforms/list',
      name: 'Platforms',
      component: () => import('@/views/platforms/index.vue'),
      meta: {
        icon: 'listCheck',
        title: '平台管理',
      },
    },
    {
      path: '/sites/list',
      name: 'Sites',
      component: () => import('@/views/sites/index.vue'),
      meta: {
        icon: 'card',
        title: '站点管理',
      },
    },
    {
      path: '/configs/index',
      name: 'Configs',
      component: () => import('@/views/configs/index.vue'),
      meta: {
        icon: 'edit',
        title: '配置管理',
      },
    },
    {
      path: '/admins/list',
      name: 'Admins',
      component: () => import('@/views/admins/index.vue'),
      meta: {
        icon: 'edit',
        title: '后台管理',
      },
    },
  ],
} as RouteConfigsTable
