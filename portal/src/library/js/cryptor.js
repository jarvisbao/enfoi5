/**
 * 加密相关代码
 * @module cryptor.js
 * 依赖开源库 https://github.com/rzcoder/node-rsa https://github.com/brix/crypto-js
 */

import NodeRsa from 'node-rsa'
import Store from '@/library/js/localstore'
import CryptoJS from 'crypto-js'

class RsaCryptor {
  constructor(cryptor) {
    /**
     * Rsa加解密模块
     * @class RsaCryptor
     * @constructor
     * @param { NodeRsa } cryptor NodeRsa 实例
     */
    this._cryptor = cryptor
  }

  encrypt(text, encode = 'base64') {
    /**
     * 加密
     * @method encrypt
     * @for RsaCryptor
     * @param { String } text 需要加密的文本
     * @param { String } encode 加密完成后生成那种形式的密文。默认为base64 扩展可以参考 https://github.com/rzcoder/node-rsa
     * @return { String } 根据传入encode的不同生成不同的返回值。默认为base64
     */
    return this._cryptor.encrypt(text, encode)
  }

  decrypt(text, decod = 'utf8') {
    /**
     * 解密
     * @method decrypt
     * @for RsaCryptor
     * @param { String } text 需要解密的文本
     * @param { String } decod 解密完成后以哪种编码形式展示。默认为utf8 扩展可以参考 https://github.com/rzcoder/node-rsa
     * @return { String } 根据传入decod的不同生成不同的返回值。默认为utf8
     */
    return this._cryptor.decrypt(text, decod)
  }

  exportKey(type = 'private') {
    /**
     * 导出公私钥
     * @method exportKey
     * @for RsaCryptor
     * @param { String } type 导出密钥的类型。默认为私钥，公钥参数为 public 可以参考 https://github.com/rzcoder/node-rsa
     * @return { String } 字符串
     */
    return this._cryptor.exportKey(type)
  }

  sign(data, encode = 'base64') {
    /**
     * 对数据进行签名
     * @method sign
     * @for RsaCryptor
     * @param { String } data 字符串。要加密的数据，以字符串形式传入
     * @param { String } encode 签名后数据展现形式。默认为base64， 扩展可以参考 https://github.com/rzcoder/node-rsa
     * @return { String } 签名后生成的数据。
     */
    return this._cryptor.sign(data, encode)
  }

  static create(private_pem, public_pem) {
    /**
     * 创建 RsaCryptor 实例
     * @method create
     * @for RsaCryptor
     * @static
     * @param { String } private_pem Rsa私钥。可以为空
     * @param { String } public_pem Rsa公钥。可以为空。
     * @return { RsaCryptor }  RsaCryptor 返回RsaCryptor的实例
     */
    const rsa = NodeRsa()
    if (private_pem) {
      rsa.importKey(private_pem)
    }
    if (public_pem) {
      rsa.importKey(public_pem)
    }
    return new RsaCryptor(rsa)
  }
}

function get_server_cryptor() {
  /**
   * 获取服务端加密的实例, 仅支持加密
   * @method get_server_cryptor
   * @return { RsaCryptor } 返回RsaCryptor的实例
   */
  var public_pem = Store.get('SERVER_PUBLIC_PEM')
  return RsaCryptor.create(null, public_pem)
}

function get_client_cryptor() {
  /**
   * 获取客户端加解密实例
   * @method get_client_cryptor
   * @return { RsaCryptor } 返回RsaCryptor的实例
   */
  var private_pem = Store.get('CLIENT_PRIVATE_PEM')
  return RsaCryptor.create(private_pem, null)
}

function JSON_stringify(s, emit_unicode) {
  var json = JSON.stringify(s)
  return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g, function(c) { return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4) })
}

// 用于aes加密的密钥
const SERET_KEY = '-----BEGIN RSA PRIVATE KEY-----' +
    'MIICXAIBAAKBgQDGguekAqYjgZXaGIkrMZ5X6K95xmuRhHshmji61fZonyzTfCvI' +
    'II9O6IUwpzJPnx0phHL+KMFFuX9AnbMg69aZNnbckpzJC27O48rtdb2Lon2P9PT+' +
    'r7WdgOFsowrDLLAJg5yhx2g+Mf6rh9MRz4A7TvHMlnhFVkQjyZ+5nJw1xQIDAQAB' +
    'AoGATBqBfcI6OWCDt6IybCnQn7koFNJ6CMa2gfJjD1XZ6tAjWky/aDD7X/AKp9Vh' +
    'l17Tykfp4gBz4Cw2WepbcyKXGWba7b6k1Ef+t7NiOPlgJSCI0U67umc2ETb1ovqt' +
    '32if1nR0UKAyJTv18w/Upa5tLFhWRqKNZK0L2FqBMLSmr/0CQQDsPE42UvYPkwP+' +
    'JWw5uznH5b9LvCUlWjjZnEXl7txtaBfnMCSRuQGnksKzx7H42mPUStiZ8OvZNCvJ' +
    'kD3gholLAkEA1x6fLUKR//RfJZLLSEkg6K9fsHnvoYWpyS5Jp0Ph3yuWO4xw79dD' +
    '0Ips6+PI4G5IexBHEdqnJ7vidP6mHNNjLwJBAIYhm5r2seWX6O11nCSPbLhWd65t' +
    'zn2N47eTJpDuddPdBa1rxWfELu9RwiFH4oJUpdgVAzUs+QzjtXUF5ExGt08CQBCQ' +
    '/CMpKEM014r2Ng94Cj/BGbZmfYzL1Vp35RYrhR6Bpc0qMJxX0JIjxuWXoiWeeJh5' +
    'lW+LjiniLzthTPuVT+MCQBexvf7NqFkUDmpL6/qwU+Tk62/KDAzPNSS75aB7Ul9R' +
    'ksAhEshtJRVFfxExqNauxit2qn87i72wOORhxP2BGJM=' +
    '-----END RSA PRIVATE KEY-----'

class AesCryptor {
  static encrypt(text, seret_key = SERET_KEY) {
    /**
     * aes加密方法
     * @method encrypt
     * @for AesCryptor
     * @static
     * @param { String } text 被加密的文本。
     * @param { String } seret_key 使用的密钥。默认为 SERET_KEY
     * @return { String } 加密完成的字符串。默认为base64形式的数据
     */
    return CryptoJS.AES.encrypt(text, seret_key).toString()
  }

  static decrypt(text, seret_key = SERET_KEY) {
    /**
     * aes解密方法
     * @method decrypt
     * @for AesCryptor
     * @static
     * @param { String } text 被解密的文本
     * @param { String } seret_key 使用的密钥。默认为 SERET_KEY
     * @return { String } 解密完成后的字符串。 默认以utf8编码
     */
    return CryptoJS.AES.decrypt(text, seret_key).toString(CryptoJS.enc.Utf8)
  }
}

export {
  RsaCryptor,
  get_server_cryptor,
  get_client_cryptor,
  AesCryptor,
  JSON_stringify
}
