/**
 * 邮箱相关http接口
 * @module login.js
 */
import request from '@/library/js/request'

export function security_captcha_send2email(email) {
/**
 * @method security_captcha_send2email:发送验证码到邮箱
 * @param email:用户邮箱地址
 */
  return request({
    url: '/rpcgateway/SecurityService/create_captcha_email',
    method: 'post',
    data: {
      'email': email
    },
    headers: { signature: true }
  })
}

export function user_loginid_create_email(email) {
/**
 * @method user_loginid_create_email:当前用户注册邮箱
 * @param email:用户邮箱地址
 */
  return request({
    url: '/rpcgateway/UserService/register_email',
    method: 'post',
    data: {
      'email': email
    },
    headers: { signature: true }
  })
}

