import Vue from 'vue'
/**
 * @description 统一注册需要在main.js引入的外部插件、样式、服务等
 */

// 注册element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
Vue.use(ElementUI, { locale })

// 注册vueCropper 剪裁图片
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

// 注册公共指令
import '@/library/directive/install'
// 注册公共组件
import '@/library/ui/install'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import '@/iconfont/iconfont.css' // 字体图标
// import '@/library/ui/FormMaking/iconfont/iconfont.css' // form-making字体图标
import '@/library/styles/common.scss' // 公共css
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
Vue.use(require('vue-wechat-title'))

import VeChart from 'v-charts/lib/chart.common'
import VeLine from 'v-charts/lib/line.common' // 折线图
import VeHistogram from 'v-charts/lib/histogram.common' // 柱状图
import VePie from 'v-charts/lib/pie.common' // 饼图
import 'v-charts/lib/style.css'

[VeChart, VeLine, VeHistogram, VePie].forEach(comp => {
  Vue.component(comp.name, comp);
})

import FormMaking from 'vue-form-making'
import 'vue-form-making/dist/FormMaking.css'
Vue.use(FormMaking)