import { access_menus, access_menus_list } from '@/library/api/menu.js'
import Constlib from '@/library/js/constlib'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    menus: []
  },

  mutations: {
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },

  actions: {
    // 获取用户菜单
    GetPermissionMenus({ commit, state }, { addon_menu, device }) {
      return new Promise((resolve, reject) => {
        access_menus(addon_menu, device).then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            commit('SET_MENUS', response.payload)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {
    permission_menus: state => state.menus,
    permission_routes: state => state.routes
  },
  preserveState: true
}

export default permission
