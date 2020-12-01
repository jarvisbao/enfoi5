import Vue from 'vue'
import VueRouter from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(VueRouter)

/* Layout */
import Layout from '../views/layout/Layout'
import subLayout from '../views/layout/subLayout'
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
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@/views/portal/index')
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
        component: () => import('@/views/userCenter/index')
      },
      {
        path: 'info',
        component: subLayout,
        children: [
          {
            path: 'index',
            name: 'user-info',
            alias: '/user-center/info',
            component: () => import('@/views/userCenter/components/Userinfo'),
            meta: { title: '个人中心' }
          },
          {
            path: 'bind_mobile',
            name: 'bind-mobile',
            component: () => import('@/views/userCenter/components/bindMobile'),
            meta: { title: '手机号绑定', icon: '' }
          },
          {
            path: 'bind_email',
            name: 'bind-email',
            component: () => import('@/views/userCenter/components/bindEmail'),
            meta: { title: '邮箱绑定', icon: '' }
          },
          {
            path: 'set_password',
            name: 'set-password',
            component: () => import('@/views/userCenter/components/Changepassword'),
            meta: { title: '设置密码', icon: '' }
          }
        ]
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
