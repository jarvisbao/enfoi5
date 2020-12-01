/**
 * hashlib 相关
 * @module hashlib.js
 * 依赖开源项目 https://github.com/kelektiv/node-uuid
 */

import uuidv1 from 'uuid/v1'
import sparkmd5 from 'spark-md5'

function get_uuid(split = '') {
  /**
   * 获取基于uuid v1
   * @method get_uuid
   * @param { String } split 分割符. 默认使用空格分割
   * @return { String } 生成的uuid字符串
   */
  return uuidv1().split('-').join(split)
}

function get_md5(text) {
  /**
   * 将传入的文本生成md5
   * @method get_md5
   * @param { String } text 文本
   * @return { String } 返回生成的md5
   */
  return sparkmd5.hash(text)
}

export {
  get_uuid,
  get_md5
}
