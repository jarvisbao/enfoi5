import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getToken } from '@/library/js/auth' // getToken from cookie
import checkPermission from '@/library/js/permission'
import Constlib from '@/library/js/constlib'

NProgress.configure({ showSpinner: false }) // NProgress configuration
// permission judge function
const whiteList = ['/login', '/retrieve_password'] // 不重定向白名单
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      const isLogin = to.query.isLogin
      if (typeof isLogin === 'string' && isLogin === 'false') {
        next()
      } else {
        const redirect = to.query.redirect || '/'
        next({ path: redirect })
      }
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      const hasOrgs = store.getters.orgs && store.getters.orgs.length > 0
      // const hasActions = store.getters.actions && store.getters.actions.length > 0
      // const hasAvatar = store.getters.avatar && store.getters.avatar.length > 0
      const hasName = store.getters.name && store.getters.name.length > 0
      const permission_menus =
        store.getters.permission_menus &&
        store.getters.permission_menus.length > 0
      const appconfig = store.getters.appconfig && store.getters.appconfig.length > 0
      const hasGroups = store.getters.groups && store.getters.groups.length > 0
      if (!hasName) {
        try {
          // 获取用户信息
          await store.dispatch('GetInfo')
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('FedLogOut')
          Message.error(error || 'Verification failed, please login again')
          next(`/login?redirect=${to.fullPath}`)
        }
      }
      if (!hasRoles) {
        try {
          // 获取用户角色
          await store.dispatch('GetUserRoles').then((response) => {
            if (response.code !== Constlib.ERROR_CODE_OK) {
              store.dispatch('FedLogOut')
              Message.error(
                response.message || 'Verification failed, please login again'
              )
              next(`/login?redirect=${to.fullPath}`)
              NProgress.done()
            }
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('FedLogOut')
          Message.error(error || 'Verification failed, please login again')
          next(`/login?redirect=${to.fullPath}`)
        }
      }
      if (!hasOrgs) {
        try {
          // 获取用户的所属机构列表
          await store.dispatch('GetUserOrgs').then((response) => {
            if (response.code !== Constlib.ERROR_CODE_OK) {
              store.dispatch('FedLogOut')
              Message.error(
                response.message || 'Verification failed, please login again'
              )
              next(`/login?redirect=${to.fullPath}`)
              NProgress.done()
            }
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('FedLogOut')
          Message.error(error || 'Verification failed, please login again')
          next(`/login?redirect=${to.fullPath}`)
        }
      }
      const active_org_id = store.getters.active_org_id
      if (!active_org_id) {
        try {
          // 获取用户当前所属组织机构
          await store.dispatch('GetUserActiveOrg').then((response) => {
            if (response.code !== Constlib.ERROR_CODE_OK) {
              store.dispatch('FedLogOut')
              Message.error(
                response.message || 'Verification failed, please login again'
              )
              next(`/login?redirect=${to.fullPath}`)
              NProgress.done()
            }
            const active_org_id = store.getters.active_org_id
            if (store.getters.orgs.length > 0) {
              let has_active_org_id = false
              if (active_org_id) {
                for (var i = 0; i < store.getters.orgs.length; i++) {
                  const org = store.getters.orgs[i]
                  if (active_org_id === org['org_id']) {
                    has_active_org_id = true
                  }
                }
              }
              if (!has_active_org_id) {
                store.dispatch('SetUserActiveOrg', store.getters.orgs[0].org_id)
              }
            } else {
              store.dispatch('SetUserActiveOrg', null)
            }
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('FedLogOut')
          Message.error(error || 'Verification failed, please login again')
          next(`/login?redirect=${to.fullPath}`)
        }
      }
      const openid = store.getters.openid
      if (!hasGroups) {
        try {
          // 获取用户的所属群组列表
          await store.dispatch('GetUserGroups', openid).then((response) => {
            if (response.code !== Constlib.ERROR_CODE_OK) {
              Message.error(
                response.message || 'Verification failed, please login again'
              )
            }
          })
        } catch (error) {
          Message.error(error || 'Verification failed, please login again')
        }
      }
      if (!permission_menus) {
        try {
          // 获取用户菜单
          await store.dispatch('GetPermissionMenus', {}).then((response) => {
            if (response.code !== Constlib.ERROR_CODE_OK) {
              store.dispatch('FedLogOut')
              Message.error(
                response.message || 'Verification failed, please login again'
              )
              next(`/login?redirect=${to.fullPath}`)
              NProgress.done()
            }
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('FedLogOut')
          Message.error(error || 'Verification failed, please login again')
          next(`/login?redirect=${to.fullPath}`)
        }
      }
      if (!appconfig) {
        try {
          await store.dispatch('GetAppConfig', {}).then(response => {
            if (response.code !== Constlib.ERROR_CODE_OK) {
              store.dispatch('FedLogOut')
              Message.error(
                response.message || 'Verification failed, please login again'
              )
              next(`/login?redirect=${to.fullPath}`)
              NProgress.done()
            }
          })
        } catch (error) {
          await store.dispatch('FedLogOut')
          Message.error(error || 'Verification failed, please login again')
          next(`/login?redirect=${to.fullPath}`)
        }
      }
      // 路由权限控制
      if (to.meta.role && !checkPermission(to.meta.role)) {
        next({
          path: '/401',
          replace: true,
          query: { noGoBack: true, role: to.meta.role }
        })
      }
      // potal 404跳转
      if (to.path !== '/404' && to.path !== '/401' && to.path !== '/') {
        let flag = false
        store.getters.routes.some(item => {
          if (to.path.indexOf(item) !== -1) {
            flag = true
            return true
          }
        })
        if (!flag) {
          next({ path: '/404' })
        }
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      const SSOToken = to.query.SSOToken
      const query = { redirect: to.fullPath }
      if (SSOToken) {
        delete to.query.SSOToken
        query['SSOToken'] = SSOToken
        query['redirect'] = router.resolve({ path: to.path, query: to.query, params: to.params, name: to.name })['href']
      }
      next({ name: 'login', query: query }) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
