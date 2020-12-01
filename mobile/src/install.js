import Vue from 'vue'
/**
 * @description 统一注册需要在main.js引入的外部插件、样式、服务等
 */

// 注册Vant
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
Vue.use(ElementUI, { locale })

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

// 注册vueCropper 剪裁图片
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

// 注册公共指令
import '@/library/directive/install'
// 注册公共组件
import '@/library/ui/install'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import '@/iconfont/iconfont.css'
import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/permission' // permission control
import jQuery from 'jquery'
import utils from '@/library/js'
import apis from '@/library/api'
window.jQuery = jQuery
window.$ = jQuery
Vue.prototype.$Utils = utils
Vue.prototype.$Apis = apis

// 全局过滤器，时间戳转换
Vue.filter('formatData', function(value) {
  if (!value) return ''
  if (Number.isFinite(value)) {
    const time = parseInt(value / 1000000)
    return Vue.prototype.$Utils.util.formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
  } else {
    return value
  }
})
