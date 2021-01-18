import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh-CN'
import en from './en-US'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'zh-CN', // 设置语言环境
  messages: {
    zh,
    en
  } // 设置语言环境信息
})

export default i18n
