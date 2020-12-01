/**
 * 存储相关
 * @module localstore.js
 * 依赖开源项目 https://github.com/marcuswestin/store.js
 */
import store from 'store'
import expire from 'store/plugins/expire'
import { get_md5 } from './hashlib'
import { AesCryptor } from './cryptor'

store.addPlugin(expire)

store.addPlugin(() => {
  return {
    // 重写 store 的 set get del 三个方法
    set: (super_fn, key, value, expiration = 1000 * 60 * 60 * 24 * 30, cryptor = true) => {
      /**
       * 重写 store 的 set 方法。将key进行md5 value 进行aes加密
       * @method set
       * @for store
       * @param { function } super_fn 原始方法
       * @param { String } key 键。
       * @param { [Number, String, Array, Object, bool] } value 值
       * @param { bool } cryptor 是否进行加解密。默认为 true
       * @param { DateTime } expiration 过期时间. 为时间戳
       */
      key = cryptor ? get_md5(key) : key
      value = cryptor ? AesCryptor.encrypt(JSON.stringify(value)) : value
      super_fn(key, value, new Date().getTime() + expiration)
    },
    get: (super_fn, key, default_ = undefined, cryptor = true) => {
      /**
       * 重写 store 的 get 方法。
       * @method get
       * @for store
       * @param { function } super_fn 原始方法
       * @param { String } key 键
       * @param { * } default_ 默认值。 当key不存在会返回此值。默认为 undefined
       * @param { bool } cryptor 是否进行加解密。默认为 true
       * @return { * } 返回经过解密的值
       */
      key = cryptor ? get_md5(key) : key
      let value = super_fn(key)
      if (value) {
        value = cryptor ? JSON.parse(AesCryptor.decrypt(value)) : value
      }
      if (value === undefined) {
        value = default_
      }
      return value
    },
    remove: (super_fn, key, cryptor = true) => {
      /**
       * 重写 store.remove 方法
       * @method remove
       * @for store
       * @param { function } super_fn 原始方法
       * @param { String } key 键
       * @param { bool } cryptor 是否进行加解密。默认为 true
       */
      key = cryptor ? get_md5(key) : key
      super_fn(key)
    }
  }
})

export default store
