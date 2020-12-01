import { check_action } from '@/library/api/resource'
import store from '@/store'

const permission = {
  name: 'permission',
  inserted(el, binding, vnode) {
    const { value } = binding
    const action_uri = value
    check_action(action_uri).then((response) => {
      var hasPermission = false
      if (['True', 'true', true].includes(response.payload)) {
        hasPermission = true
      } else {
        hasPermission = false
      }
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    })
  }
}

const rolepermission = {
  name: 'role-permission',
  inserted(el, binding, vnode) {
    const { value } = binding
    var hasPermission = false
    const role_codes = store.getters.roles
    if (typeof value === 'string') {
      hasPermission = role_codes.includes(value)
    } else {
      hasPermission = value.some(val => role_codes.includes(val))
    }
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

export { permission, rolepermission }
