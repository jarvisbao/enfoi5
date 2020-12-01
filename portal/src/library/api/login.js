/**
 * 登录请求相关http接口
 * @module login.js
 */
import request from '@/library/js/request'
import { get_server_cryptor } from '@/library/js/cryptor'

export function login(username, password) {
  /**
   * 登录
   * @method login
   * @param { String } username 登录用户 login_id
   * @param { String } password 用户密码
   * @return {axios} axios请求实例
   */
  var cryptor = get_server_cryptor()
  password = cryptor.encrypt(password)
  return request({
    url: '/rpcgateway/UserService/login_by_userid',
    method: 'post',
    data: {
      'userid': username,
      'password': password
    },
    headers: { signature: true }
  })
}

export function login_by_thrid(code, platform, injected) {
  /**
   * 登录
   * @method login
   * @param { String } username 登录用户 login_id
   * @param { String } password 用户密码
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/login_by_thrid',
    method: 'post',
    data: {
      code: code,
      platform: platform,
      injected: injected
    }
  })
}

export function getInfo() {
  /**
   * 获取用户信息
   * @method getInfo
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/info',
    method: 'get'
  })
}

export function logout() {
  /**
   * 登出
   * @method logout
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/logout',
    method: 'get'
  })
}

export function retrieve_pwd(nickname, email) {
  /**
   * 忘记密码
   * @method retrieve_pwd
   * @param nickname:用户名
   * @param email:用户绑定的邮箱
   */
  return request({
    url: '/rpcgateway/UserService/user_retrieve_pwd',
    method: 'post',
    data: {
      'nickname': nickname,
      'email': email
    },
    headers: { signature: true }
  })
}

export function login_by_ssotoken(SSOToken) {
  /**
   * 登录
   * @method login
   * @param { String } username 登录用户 login_id
   * @param { String } password 用户密码
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/login_by_ssotoken',
    method: 'post',
    data: {
      SSOToken: SSOToken
    }
  })
}

