import Layout from '@/views/layout/Layout'

export const asyncRoutes = []
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/retrieve_password',
    component: () => import('@/views/login/retrievePassword'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    name: 'index',
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },
  {
    path: '/user-center',
    component: Layout,
    children: [
      {
        path: '/user-center',
        name: 'user-center',
        component: () => import('@/views/userCenter/index'),
        meta: { title: '个人中心', icon: 'user_center' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
