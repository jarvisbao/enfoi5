import {
  registerMicroApps,
  // runAfterFirstMounted,
  // setDefaultMountApp,
  initGlobalState,
  start
} from 'qiankun'
/**
 * @name 导入render函数兼容qiakun1.0装载子应用方法，如果使用2.0container装载则不需要此方法,此处留着注释代码提供兼容qiankun1.0的示例
 * @description 此处留下注释代码仅为提供兼容qiankun1.0示例
 */
import render from './render'
import store from './store'
import Vue from 'vue'
/**
 * @name 声明要传递给子应用的信息
 * @param data 主应要传递给子应用的数据类信息
 * @param emits 主应要传递给子应用的方法类信息
 * @param utils 主应要传递给子应用的工具类信息（只是一种方案）
 * @param components 主应要传递给子应用的组件类信息（只是一种方案）
 * @param i18n 国际化语言设置
 */
import store_modules from '@/library/store_modules'
import directive from '@/library/directive'
import LibraryJs from '@/library/js'
import LibraryUi from '@/library/ui'
import LibraryApi from '@/library/api'
import commonRouterMap from '@/library/commonRouter'
import i18n from '@/library/lang'

// 通讯
const actions = initGlobalState({
  rsgComponent: null, // 初始化state，里面内容您随意
  showComponent: null
})
// 在项目中任何需要监听的地方进行监听，在这里监听是为了方便
actions.onGlobalStateChange((state, prev) => {
  // console.log('main state change', state)
})
// 将action对象绑到Vue原型上，为了项目中其他地方使用方便
Vue.prototype.$actions = actions

const props = {
  store_modules: store_modules,
  directive: directive,
  utils: LibraryJs,
  components: LibraryUi,
  Apis: LibraryApi,
  commonRouterMap: commonRouterMap,
  i18n: i18n,
  emits: [{ actions }]
}

// 注册store模块
Object.keys(store_modules).forEach(module_name => {
  store.registerModule(module_name, store_modules[module_name])
})
function genActiveRule(routerPrefix) {
  return (location) => location.pathname.startsWith(routerPrefix)
}

/**
 * @name 请求获取子应用注册表并注册启动微前端
 */
let _res = []
const appconfig = store.getters.appconfig && store.getters.appconfig.length > 0
if (!appconfig) {
  store.dispatch('GetAppConfig', {}).then(response => {
    if (response.code === LibraryJs.Constlib.ERROR_CODE_OK) {
      _res = response.payload.items
      // 处理子应用注册表数据
      const apps = [] // 子应用数组盒子
      const isDev = process.env.NODE_ENV === 'development' // 根据开发环境|线上环境加载不同entry
      _res.forEach((i) => {
        if (i.depEntry.startsWith(':')) {
          i.depEntry = window.location.protocol + '//' + window.location.hostname + i.depEntry
        } else if (i.depEntry.startsWith('/')) {
          i.depEntry = window.location.protocol + '//' + window.location.host + i.depEntry
        }
        if (i.devEntry.startsWith(':')) {
          i.devEntry = '//' + window.location.hostname + i.devEntry
        }
        apps.push({
          name: i.name,
          entry: isDev ? i.devEntry : i.depEntry,
          render: ({ appContent, loading }) => render({ appContent, loading }),
          activeRule: genActiveRule(i.routerBase),
          props: { ...props, routerBase: i.routerBase }
        })
        // 启用qiankun微前端应用
        useQianKun(apps)
      })
    }
  })
}

/**
 * @name 启用qiankun微前端应用
 * @param {*} list
 * @param {*} defaultApp
 */
const useQianKun = (list, defaultApp) => {
  /**
   * @name 注册子应用
   * @param {Array} list subApps
   */
  registerMicroApps(list, {
    beforeLoad: [
      (app) => {
        // console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
      }
    ],
    beforeMount: [
      (app) => {
        // console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      }
    ],
    afterUnmount: [
      (app) => {
        // console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
      }
    ]
  })

  /**
   * @name 设置默认进入的子应用
   * @param {String} 需要进入的子应用路由前缀
   */
  // setDefaultMountApp(defaultApp);

  /**
   * @name 启动微前端
   */
  start({ prefetch: false, sandbox: true, singular: true })

  /**
   * @name 微前端启动进入第一个子应用后回调函数
   */
  // runAfterFirstMounted(() => {
  //   console.log('[MainApp] first app mounted');
  // });
}
