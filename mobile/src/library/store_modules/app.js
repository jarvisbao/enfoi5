// import Cookies from 'js-cookie'

const app = {
  state: {
    device: 'desktop',
    vue_app_name: process.env.VUE_APP_NAME,
    platform: null,
    Tabbar: true
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
    }
  },
  getters: {
    device: state => state.device,
    vue_app_name: state => state.vue_app_name,
    platform: state => state.platform,
    Tabbar: state => state.Tabbar
  }
}

export default app
