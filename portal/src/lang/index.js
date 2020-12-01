import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh-cn'
import en from './en'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'zh-cn', // 设置语言环境
  messages: {
    zh,
    en
  } // 设置语言环境信息
})

export default i18n
