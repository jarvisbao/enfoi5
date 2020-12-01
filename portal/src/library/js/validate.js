/**
 * 验证工具
 * @module validate
 */

export function isvalidUsername(username) {
  /**
   * 验证是否有效的用户名
   * @method isvalidUsername
   * @param {str} username
   * @return {bool} 布尔值
   */
  // TODO 功能需完善， 验证非法字符
  return true
}

export function isExternal(path) {
  return /^(\/?https?:|mailto:|tel:)/.test(path)
}

export function isJSON(str) {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true
    }
  } catch (e) {
    console.log('error：' + str + '!!!' + e)
  }
  return false
}
