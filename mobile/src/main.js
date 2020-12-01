/**
 * @name 统一注册外部插件、样式、服务等
 */
import './install'

/**
 * @name 微前端基座主应用vue实例化
 * @description 为了兼容 qiankun1.0 的render函数装载子应用能力
 * @description 2.0版本正常实例化vue即可，不需要此render函数
 * @description qiankun registerMicroApps方法 render用到，如果使用container装载子应用，无需此render函数
 * @deprecated 本示例只针对 qiankun2.0 因此只留下注释后的代码在此提醒各位读者如何兼容qiankun1.0
 */
import render from './render'
render({ loading: true })
// import { vueRender } from './render'
// vueRender({}, true)

/**
 * @name 注册微应用并启动微前端
 */
import './appRegister'
