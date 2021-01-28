import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

Vue.use(ElementUI, { locale })
import jQuery from 'jquery'

window.jQuery = jQuery
window.$ = jQuery

import '@/styles/index.scss' // global css
import '@/iconfont/iconfont.css'
import '@/icons' // icon

import VeChart from 'v-charts/lib/chart.common'
import VeLine from 'v-charts/lib/line.common' // 折线图
import VeHistogram from 'v-charts/lib/histogram.common' // 柱状图
import VePie from 'v-charts/lib/pie.common' // 饼图
import 'v-charts/lib/style.css'

[VeChart, VeLine, VeHistogram, VePie].forEach(comp => {
  Vue.component(comp.name, comp);
})

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import FormMaking from 'vue-form-making'
import 'vue-form-making/dist/FormMaking.css'
Vue.use(FormMaking)