
let timer = null
let startX = 0 // touchstart 时手指的位置，用于 touchmove 时判断手指是否移动
let startY = 0
const MIN_DISTANCE = 10

export default {
  name: 'longtap',
  inserted(el, binding, vNode) {
    const value = binding.value
    const data = binding.value.item

    el.addEventListener('touchstart', event => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      // document.oncontextmenu = function(e) {
      //   e.preventDefault()
      // }

      startX = event.changedTouches[0].clientX
      startY = event.changedTouches[0].clientY
      timer = setTimeout(() => {
        if (typeof value === 'function') {
          event.preventDefault()
          value(event, data, vNode)
          return
        } else if (value && value.handler && typeof value.handler === 'function') {
          event.preventDefault()
          value.handler(event, data, vNode)
          return
        }
      }, 750)
    })

    // 若手指移动超过 10 像素，则不是长按事件，取消 timeout
    el.addEventListener('touchmove', event => {
      const offsetX = Math.abs(event.changedTouches[0].clientX - startX)
      const offsetY = Math.abs(event.changedTouches[0].clientY - startY)
      if (offsetY > offsetX && offsetY > MIN_DISTANCE) {
        // event.returnValue = true
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
      }
    })

    // 手指离开时
    el.addEventListener('touchend', event => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    })

    document.addEventListener('contextmenu', e => {
      e.preventDefault()
    })
  }
}
