import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    reload: '',
    vue_app_name: process.env.VUE_APP_NAME,
    loading: false,
    platform: null,
    theme: 'black'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    OPEN_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = true
      state.sidebar.withoutAnimation = withoutAnimation
    },
    SET_RELOAD: (state, reload) => {
      state.reload = reload
    },
    SET_VUE_APP_NAME: (state, vue_app_name) => {
      state.vue_app_name = vue_app_name
    },
    SET_LOADING: (state, loading) => {
      state.loading = loading
    },
    SET_PLATFORM: (state, platform) => {
      state.platform = platform
    },
    SET_THEME: (state, theme) => {
      state.theme = theme
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    OpenSidebar({ commit }, { withoutAnimation }) {
      commit('OPEN_SIDEBAR', withoutAnimation)
    },
    reload({ commit }, reload) {
      commit('SET_RELOAD', reload)
    },
    getVueAppName({ commit }, vue_app_name) {
      commit('SET_VUE_APP_NAME', vue_app_name)
    },
    getLoading({ commit }, loading) {
      commit('SET_LOADING', loading)
    },
    SetPlatform({ commit }, platform) {
      commit('SET_PLATFORM', platform)
    },
    getTheme({ commit }, theme) {
      commit('SET_THEME', theme)
    }
  },
  getters: {
    sidebar: state => state.sidebar,
    device: state => state.device,
    reload: state => state.reload,
    vue_app_name: state => state.vue_app_name,
    loading: state => state.loading,
    platform: state => state.platform,
    theme: state => state.theme
  }
}

export default app
