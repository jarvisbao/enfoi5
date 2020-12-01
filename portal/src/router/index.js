import Vue from 'vue'
import VueRouter from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(VueRouter)

/* Layout */
import Layout from '../views/layout/Layout'
import commonRouterMap from '@/library/commonRouter'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const asyncRoutes = []
export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/retrieve_password',
    component: () => import('@/views/login/retrievePassword'),
    hidden: true
  },
  {
    path: '/404',
    component: Layout,
    children: [
      { path: '/404', component: () => import('@/library/ui/404'), alias: '/404' }
    ]
  },
  {
    path: '/401',
    component: Layout,
    children: [
      { path: '/401', component: () => import('@/library/ui/401'), alias: '/401' }
    ]
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@/views/portal/index')
      }
    ]
  },
  {
    path: '/widget',
    component: Layout,
    name: 'widget',
    children: [
      {
        path: '/widget',
        name: 'widget_index',
        alias: '/widget/index',
        component: () => import('@/views/dashboard/index')
      },
      {
        path: 'create',
        name: 'widget_create',
        component: () => import('@/views/dashboard/widgetCreate')
      },
      {
        path: 'edit',
        name: 'widget_edit',
        component: () => import('@/views/dashboard/widgetUpdate')
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
  }
]
commonRouterMap.forEach(router => {
  if (router.sub_component) {
    router.component = Layout
  }
})
export const routerMap = constantRouterMap.concat(commonRouterMap)

const createRouter = () =>
  new VueRouter({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: routerMap
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
