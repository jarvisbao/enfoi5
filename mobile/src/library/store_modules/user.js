import { login, login_by_thrid, logout, getInfo } from '@/library/api/login'
import { download_attachment_by_id } from '@/library/api/attachment'
import { getToken, setToken, removeToken } from '@/library/js/auth'
import localstore from '@/library/js/localstore'
import { user_myroles, clear_cache, get_orgs, get_active_org_id, set_active_org_id, param_info_by_key_openid } from '@/library/api/user'
import Constlib from '@/library/js/constlib'
import { connect } from '@/library/api/security'
import { getAppConfigApi } from '@/library/api/sysControl'
import { get_auto_orm, set_auto_orm } from '@/library/api/repository'
import router from '@/router'
import path from 'path'

let ppath = ''
const routes = []
const getRoutes = function(data) {
  data.forEach(item => {
    if (item.path.indexOf('404') === -1 && item.path.indexOf('401') === -1 && item.path !== '/') {
      if (item.children) {
        ppath = item.path
        getRoutes(item.children)
      } else {
        routes.push(path.resolve(ppath, item.path))
      }
    }
  })
}
getRoutes(router.options.routes)

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    openid: '',
    roles: [],
    actions: [],
    myroles: [],
    appconfig: [],
    orgs: [],
    active_org_id: null,
    auto_orm: true,
    company_title: '盈丰软件',
    company_logo: '',
    routes: routes
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_OPENID: (state, openid) => {
      state.openid = openid
    },
    SET_USERINFO: (state, userinfo) => {
      state.userinfo = userinfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ACTIONS: (state, action) => {
      state.actions = action
    },
    SET_MYROLES: (state, myroles) => {
      state.myroles = myroles
    },
    SET_APPCONFIG: (state, appconfig) => {
      state.appconfig = appconfig
    },
    SET_ORGS: (state, orgs) => {
      state.orgs = orgs
    },
    SET_ACTIVE_ORG: (state, active_org_id) => {
      state.active_org_id = active_org_id
    },
    SET_AUTO_ORM: (state, auto_orm) => {
      state.auto_orm = auto_orm
    },
    SET_COMPANY_TITLE: (state, company_title) => {
      state.company_title = company_title
    },
    SET_COMPANY_LOGO: (state, company_logo) => {
      state.company_logo = company_logo
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            commit('SET_TOKEN', response['payload'])
          } else {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_NAME', '')
            commit('SET_AVATAR', '')
            localstore.remove('SERVER_PUBLIC_PEM')
            localstore.remove('CLIENT_PRIVATE_PEM')
            removeToken()
            // resetRouter()
            connect()
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 第三方登录
    ThridLogin({ commit }, { code, platform, injected }) {
      return new Promise((resolve, reject) => {
        login_by_thrid(code, platform, injected).then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            commit('SET_TOKEN', response['payload'])
          } else {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_NAME', '')
            commit('SET_AVATAR', '')
            localstore.remove('SERVER_PUBLIC_PEM')
            localstore.remove('CLIENT_PRIVATE_PEM')
            removeToken()
            // resetRouter()
            connect()
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户角色
    GetUserRoles({ commit, state }) {
      return new Promise((resolve, reject) => {
        user_myroles().then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            var roles = []
            response.payload.forEach(item => {
              roles.push(item.role_code)
            })
            commit('SET_ROLES', roles)
            commit('SET_MYROLES', response.payload)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户的所属机构列表
    GetUserOrgs({ commit, state }) {
      return new Promise((resolve, reject) => {
        get_orgs().then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            commit('SET_ORGS', response.payload)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户当前所属组织机构
    GetUserActiveOrg({ commit, state }) {
      return new Promise((resolve, reject) => {
        get_active_org_id().then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            commit('SET_ACTIVE_ORG', response.payload)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 设置当前用户的当前所属组织机构
    SetUserActiveOrg({ commit, state }, active_org_id) {
      return new Promise((resolve, reject) => {
        set_active_org_id(active_org_id).then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            commit('SET_ACTIVE_ORG', active_org_id)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            if (!state.name) {
              const name = response.payload.full_name
              const openid = response.payload.openid
              const userinfo = response.payload
              commit('SET_NAME', name)
              commit('SET_OPENID', openid)
              commit('SET_USERINFO', userinfo)
              param_info_by_key_openid('company_title').then(response => {
                if (response.code === Constlib.ERROR_CODE_OK) {
                  if (response.payload !== '') {
                    commit('SET_COMPANY_TITLE', response.payload)
                  } else {
                    commit('SET_COMPANY_TITLE', '盈丰软件')
                  }
                }
              })
              param_info_by_key_openid('company_logo').then(response => {
                if (response.code === Constlib.ERROR_CODE_OK) {
                  if (response.payload !== '') {
                    commit('SET_COMPANY_LOGO', response.payload)
                  } else {
                    commit('SET_COMPANY_LOGO', '')
                  }
                }
              })
            }
            if (state.avatar.length <= 0) {
              const attach_id = response.payload.head_id
              if (!attach_id) {
                const avatar = require('@/assets/images/user_default.png')
                commit('SET_AVATAR', avatar)
              } else {
                download_attachment_by_id(attach_id).then(response => {
                  if (response.code === Constlib.ERROR_CODE_OK) {
                    const avatar = response.payload.content
                    commit('SET_AVATAR', avatar)
                  } else {
                    const avatar = require('@/assets/images/user_default.png')
                    commit('SET_AVATAR', avatar)
                  }
                })
              }
            }
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_MYROLES', [])
          commit('SET_NAME', '')
          commit('SET_AVATAR', '')
          commit('SET_ORGS', [])
          commit('SET_ACTIVE_ORG', null)
          localstore.remove('SERVER_PUBLIC_PEM')
          localstore.remove('CLIENT_PRIVATE_PEM')
          removeToken()
          // resetRouter()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_MYROLES', [])
        commit('SET_ORGS', [])
        commit('SET_ACTIVE_ORG', null)
        removeToken()
        resolve()
        // resetRouter()
      })
    },

    GetAppConfig({ commit, state }, { device }) {
      return new Promise((resolve, reject) => {
        getAppConfigApi(device).then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            const portal = [{
              name: 'mobile'
            }]
            commit('SET_APPCONFIG', portal.concat(response.payload.items))
            const app_config_path = response.payload.items.map(item => {
              return item.routerBase
            })
            commit('SET_ROUTES', routes.concat(app_config_path))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    ClearCache({ commit, state }) {
      return new Promise((resolve, reject) => {
        clear_cache().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    SetAutoOrm({ commit, state }, auto_orm) {
      return new Promise((resolve, reject) => {
        set_auto_orm(auto_orm).then(response => {
          if (response.code === Constlib.ERROR_CODE_OK) {
            commit('SET_AUTO_ORM', auto_orm)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {
    token: state => state.token,
    avatar: state => state.avatar,
    name: state => state.name,
    openid: state => state.openid,
    userinfo: state => state.userinfo,
    roles: state => state.roles,
    myroles: state => state.myroles,
    actions: state => state.actions,
    appconfig: state => state.appconfig,
    orgs: state => state.orgs,
    active_org_id: state => state.active_org_id,
    auto_orm: state => state.auto_orm,
    company_title: state => state.company_title,
    company_logo: state => state.company_logo,
    routes: state => state.routes
  }
}

export default user
