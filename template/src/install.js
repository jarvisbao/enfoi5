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
