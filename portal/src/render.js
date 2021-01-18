import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import i18n from './library/lang'
/**
 * @description 实例化vue，并提供子应用 render函数模式的装载能力
 * @description 如果使用qiankun2.0 版本，只需正常实例化vue即可 不需要存在此render函数
 * @param {Object} param0
 * @description {String} appContent 子应用内容
 * @description {Boolean} loading 是否显示加载动画（需手动实现loading效果）
 * @param {Boolean} notCompatible true则不兼容qiankun1.0 【此参数为示例添加，实际应用自酌】
 */
export function vueRender({ appContent, loading }, notCompatible) {
  Vue.config.productionTip = false

  // 实际上本实例只用到此if内的代码
  // 本文件其他代码只为做兼容qiankun1.0 render挂载子应用的参考
  if (notCompatible) {
    new Vue({
      router,
      store,
      i18n,
      render: (h) => h(App)
    }).$mount('#container')
    return
  }

  return new Vue({
    router,
    store,
    i18n,
    data() {
      return {
        content: appContent,
        loading
      }
    },
    render(h) {
      return h(App, {
        props: {
          content: this.content,
          loading: this.loading
        }
      })
    }
  }).$mount('#container')
}

let app = null

/**
 * @name 提供render装载子应用方法
 * @param {Object} param0
 * @description {String} appContent 子应用内容
 * @description {Boolean} loading 是否显示加载动画（需手动实现loading效果）
 */
export default function render({ appContent, loading }) {
  if (!app) {
    app = vueRender({ appContent, loading })
  } else {
    app.content = appContent
    app.loading = loading
  }
}
