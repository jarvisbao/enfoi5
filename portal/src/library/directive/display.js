export default {
  name: 'display',
  inserted(el, binding, vnode) {
    const { value } = binding
    const delete_applycondition = value[0]
    let row = {}
    row = value[1]
    let can_delete = true
    if (delete_applycondition) {
      if (!eval(delete_applycondition)) {
        can_delete = false
      }
    }
    if (!can_delete) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
