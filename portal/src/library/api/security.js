/**
 * 安全相关接口
 * @module security.js
 */
import request from '@/library/js/request'
import localstore from '@/library/js/localstore'
import Constlib from '@/library/js/constlib'
import NodeRsa from 'node-rsa'

export function security_connect(public_key) {
  /**
   * 建立安全信道
   * @method security_connect
   * @param { String } public_key 客户端公钥
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/SecurityService/connect',
    method: 'post',
    data: { public_key }
  })
}

export function security_check(public_key) {
  /**
   * 检查客户端公钥和服务端存储的公钥是否一致
   * @method security_check
   * @param { String } public_key 客户端公钥
   * @return { axios } axios 请求实例
   */
  return request({
    url: '/rpcgateway/SecurityService/check',
    method: 'post',
    data: { public_key }
  })
}

export function captcha(size = 4, width = 160, height = 60) {
  /**
   * 获取验证码
   * @method captcha
   * @param { number } size 验证码内容长度
   * @param { number } width 验证码长度
   * @param { number } height 验证码高度
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/SecurityService/create_captcha',
    method: 'get',
    params: { size, width, height }
  })
}

export function captcha_test(captcha_value) {
  /**
   * 验证验证码是否正确
   * @method captcha_test
   * @param { String } captcha_value
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/SecurityService/test_captcha',
    method: 'get',
    params: {
      captcha: captcha_value
    }
  })
}

export function appendSSOToken(url, login_type) {
  /**
   * 验证验证码是否正确
   * @method captcha_test
   * @param { String } captcha_value
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/SecurityService/appendSSOToken',
    method: 'get',
    params: {
      url: url,
      login_type: login_type
    }
  })
}

export function connect() {
  return new Promise((resolve, reject) => {
    // 需要初始化生成客户端的公私钥匙。
    var cryptor = NodeRsa({ 'b': 1024 })
    if (localstore.get('CLIENT_PRIVATE_PEM')) {
      cryptor.importKey(localstore.get('CLIENT_PRIVATE_PEM'))
    } else {
      localstore.set('CLIENT_PRIVATE_PEM', cryptor.exportKey())
    }
    if (localstore.get('CLIENT_PUBLIC_KEY')) {
      cryptor.importKey()
    }
    security_check(cryptor.exportKey('public')).then(response => {
      // 检查客户端公钥和服务端存储的客户端公钥是否一致
      const data = response
      if (data.code === Constlib.ERROR_CODE_OK) {
        if (!['True', 'true', true].includes(data.payload) || !localstore.get('SERVER_PUBLIC_PEM')) {
          // 如果不一致就重新初始化
          localStorage.clear()
          cryptor = NodeRsa({ 'b': 1024 })
          localstore.set('CLIENT_PRIVATE_PEM', cryptor.exportKey())
          security_connect(cryptor.exportKey('public')).then(response => {
            const data = response
            if (data.code === Constlib.ERROR_CODE_OK) {
              resolve(data)
              localstore.set('SERVER_PUBLIC_PEM', data['payload']['public_key'])
            } else {
              resolve(data)
            }
          })
        } else {
          resolve(data)
        }
      } else {
        resolve(data)
      }
    })
  })
}
