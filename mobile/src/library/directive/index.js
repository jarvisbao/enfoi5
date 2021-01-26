import drag from './drag-dialog'
import { permission, rolepermission } from './permission'
import display from './display'
import longtap from './longTap'

const directives = [drag, permission, display, rolepermission, longtap]
const _export = {}
const install = function(Vue) {
  directives.forEach(directive => {
    Vue.directive(directive.name, directive)
    _export[directive.name] = directive
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
_export['install'] = install
export default _export

