// import Cookies from 'js-cookie'

const app = {
  state: {
    device: 'desktop',
    vue_app_name: process.env.VUE_APP_NAME,
    platform: null,
    Tabbar: true, // 标签栏是否显示
    tabbar_active: 'home' // 标签栏高亮
  },
  mutations: {
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_VUE_APP_NAME: (state, vue_app_name) => {
      state.vue_app_name = vue_app_name
    },
    SET_PLATFORM: (state, platform) => {
      state.platform = platform
    },
    SET_TABBAR: (state, Tabbar) => {
      state.Tabbar = Tabbar
    },
    SET_TABBER_ACTIVE: (state, tabbar_active) => {
      state.tabbar_active = tabbar_active
    }
  },
  actions: {
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    getVueAppName({ commit }, vue_app_name) {
      commit('SET_VUE_APP_NAME', vue_app_name)
    },
    SetPlatform({ commit }, platform) {
      commit('SET_PLATFORM', platform)
    },
    getTabbar({ commit }, Tabbar) {
      commit('SET_TABBAR', Tabbar)
    },
    getTabberActive({ commit }, tabbar_active) {
      commit('SET_TABBER_ACTIVE', tabbar_active)
    }
  },
  getters: {
    device: state => state.device,
    vue_app_name: state => state.vue_app_name,
    platform: state => state.platform,
    Tabbar: state => state.Tabbar,
    tabbar_active: state => state.tabbar_active
  }
}

export default app
