/**
 * 用户管理相关http接口
 * @module user.js
 */
import request from '@/library/js/request'
import { get_server_cryptor } from '@/library/js/cryptor'

export function user_create(nickname, first_name, last_name, gender, password, birthday, props) {
  /**
   * 创建用户
   * @method user_create
   * @param { String } nickname 用户昵称
   * @param { String } password 用户密码
   * @param { String } first_name 名
   * @param { String } last_name 姓
   * @param { String } gender 性别
   * @param { String } birthday 出生日期
   * @param { String } ssh 身份证号
   * @param { String } props 扩展属性
   * @return {axios} axios请求实例
   */
  var cryptor = get_server_cryptor()
  password = cryptor.encrypt(password)
  return request({
    url: '/rpcgateway/UserService/create_user',
    method: 'post',
    data: {
      'nickname': nickname,
      'password': password,
      'first_name': first_name,
      'last_name': last_name,
      'gender': gender,
      'birthday': birthday,
      // 'ssh': ssh,
      'props': props
    },
    headers: { signature: true }
  })
}

export function user_info(openid) {
  /**
   * 获取用户信息
   * @method user_info
   * @param param openid: 指定用户的OPENID， 如果该值为空，则获取当前用户的信息，否则获取该openid所对应的用户信息
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/info',
    method: 'get',
    params: { 'openid': openid }
  })
}

export function user_update(openid, gender, birthday, last_name, first_name, props, head_id, widgets_json) {
  /**
   * 更新用户资料
   * @method user_update
   * @param openid: 指定用户的openid, 如果该值为空，则更新当前用户的资料
   * @param gender: 性别，可选
   * @param birthday: 生日， 可选
   * @param last_name: 姓，可选
   * @param first_name: 名， 可选
   * @param ssh: 身份证号码，可选
   * @param head_id:头像附件ID
   * @param props: 属性，JSON格式，可选
   * @return {axios} axios请求实例
   */
  var params = {
    // 'openid': openid,
    'gender': gender,
    'birthday': birthday,
    'last_name': last_name,
    'first_name': first_name,
    'props': props,
    'head_id': head_id,
    'widgets_json': widgets_json
  }
  if (openid) {
    params['openid'] = openid
  }
  return request({
    url: '/rpcgateway/UserService/update',
    method: 'post',
    data: params,
    headers: { signature: true }
  })
}

export function user_update_props(openid, company_title, company_logo) {
  var params = {
    'company_title': company_title,
    'company_logo': company_logo
  }
  if (openid) {
    params['openid'] = openid
  }
  return request({
    url: '/rpcgateway/UserService/update_params',
    method: 'post',
    data: params,
    headers: { signature: true }
  })
}

export function user_remove_v2(openid) {
  /**
   * 删除用户
   * @method user_remove
   * @param openid:指定用户的openid
   * @return {axios} axios请求实例
   */

  return request({
    url: '/rpcgateway/UserService/remove_v2',
    method: 'post',
    data: {
      'openid': openid
    },
    headers: { signature: true }
  })
}

export function user_remove(openid) {
  /**
   * 删除用户
   * @method user_remove
   * @param openid:指定用户的openid
   * @return {axios} axios请求实例
   */

  return request({
    url: '/rpcgateway/UserService/remove',
    method: 'post',
    data: {
      'openid': openid
    },
    headers: { signature: true }
  })
}

export function active_user(openid) {
  /**
   * 删除用户
   * @method user_remove
   * @param openid:指定用户的openid
   * @return {axios} axios请求实例
   */

  return request({
    url: '/rpcgateway/UserService/active_user',
    method: 'post',
    data: {
      'openid': openid
    },
    headers: { signature: true }
  })
}

export function user_list(text, page, page_index, page_size, status) {
  /**
   * 用户列表
   * @method user_list
   * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的用户
   * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
   * @param page_index: 当前页码，缺省为1，只有page为on时生效
   * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/user_list',
    method: 'get',
    params: {
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size,
      status: status
    }
  })
}

export function user_myorgs(openid, text, page, page_index, page_size) {
  /**
   * 获取当前用户或指定用户所属的部门
   * @method user_myorgs
   * @param openid: 缺省为空，获取当前用户的部门，否则获取指定用户的部门
   * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的部门
   * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
   * @param page_index: 当前页码，缺省为1，只有page为on时生效
   * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/orgs_list',
    method: 'get',
    params: {
      'openid': openid,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function user_mygroups(openid, text, page, page_index, page_size) {
  /**
   * 获取当前用户或指定用户所属的群组
   * @method user_mygroups
   * @param openid: 缺省为空，获取当前用户的部门，否则获取指定用户的部门
   * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的部门
   * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
   * @param page_index: 当前页码，缺省为1，只有page为on时生效
   * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/groups_list',
    method: 'get',
    params: {
      'openid': openid,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function user_myroles(openid) {
  /**
   * 获取当前用户或指定用户所拥有的全部角色
   * @method user_myroles
   * @param openid: 缺省为空，获取当前用户的角色，否则获取指定用户的角色
   * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的部门
   * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
   * @param page_index: 当前页码，缺省为1，只有page为on时生效
   * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/get_roles',
    method: 'get',
    params: {
      'openid': openid
    }
  })
}

export function user_roles(openid, text, page, page_index, page_size) {
  /**
   * 获取当前用户或指定用户所拥有的全部角色
   * @method user_myroles
   * @param openid: 缺省为空，获取当前用户的角色，否则获取指定用户的角色
   * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的部门
   * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
   * @param page_index: 当前页码，缺省为1，只有page为on时生效
   * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/roles_list',
    method: 'get',
    params: {
      'openid': openid,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function user_roles_add(user_id, role_code) {
  /**
   * 添加用户角色
   * @method user_roles_add
   * @param user_id: 用户ID
   * @param role_id:角色ID
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/add_role_bycode',
    method: 'post',
    data: {
      'user_id': user_id,
      'role_code': role_code
    },
    headers: { signature: true }
  })
}

export function user_roles_remove(user_id, role_code) {
  /**
   * 移除用户所拥有的角色
   * @method user_roles_remove
   * @param user_id: 用户ID
   * @param role_id:角色ID
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/UserService/user_roles_remove',
    method: 'post',
    data: {
      'user_id': user_id,
      'role_code': role_code
    },
    headers: { signature: true }
  })
}

export function user_loginid_list() {
/**
 * 获取当前登录用户的账户列表
 * @method user_loginid_list
 */
  return request({
    url: '/rpcgateway/UserService/loginid_list',
    method: 'get'
  })
}

export function update_pwd(old_pwd, new_pwd) {
/**
 * 修改个人密码
 * @method update_pwd
 * @param old_pwd:旧密码
 * @param new_pwd:新密码
 */
  var cryptor = get_server_cryptor()
  old_pwd = cryptor.encrypt(old_pwd)
  new_pwd = cryptor.encrypt(new_pwd)
  return request({
    url: '/rpcgateway/UserService/update_pwd',
    method: 'post',
    data: {
      'old_pwd': old_pwd,
      'new_pwd': new_pwd
    },
    headers: { signature: true }
  })
}

export function clear_cache() {
  /**
   * 修改个人密码
   * @method update_pwd
   * @param old_pwd:旧密码
   * @param new_pwd:新密码
   */
  return request({
    url: '/rpcgateway/UserService/clear_cache',
    method: 'post',
    data: {
    }
  })
}

export function set_active_org_id(org_id) {
  /**
   * 修改个人密码
   * @method update_pwd
   * @param old_pwd:旧密码
   * @param new_pwd:新密码
   */
  return request({
    url: '/rpcgateway/UserService/set_active_org_id',
    method: 'post',
    data: {
      org_id: org_id
    }
  })
}

export function get_active_org_id() {
  /**
   * 修改个人密码
   * @method update_pwd
   * @param old_pwd:旧密码
   * @param new_pwd:新密码
   */
  return request({
    url: '/rpcgateway/UserService/get_active_org_id',
    method: 'get',
    params: {
    }
  })
}

export function get_orgs() {
  /**
   * 修改个人密码
   * @method update_pwd
   * @param old_pwd:旧密码
   * @param new_pwd:新密码
   */
  return request({
    url: '/rpcgateway/UserService/get_orgs',
    method: 'get',
    params: {
    }
  })
}

export function bindThrid(code, platform) {
  /**
   * 修改个人密码
   * @method update_pwd
   * @param old_pwd:旧密码
   * @param new_pwd:新密码
   */
  return request({
    url: '/rpcgateway/UserService/bindThrid',
    method: 'post',
    data: {
      code: code,
      platform: platform
    }
  })
}

export function user_loginid_create_mobile(mobile) {
  /**
   * @method user_loginid_create_email:当前用户注册邮箱
   * @param email:用户邮箱地址
   */
  return request({
    url: '/rpcgateway/UserService/register_mobile',
    method: 'post',
    data: {
      'mobile': mobile
    },
    headers: { signature: true }
  })
}

export function SyncUser(platform, openids) {
  /**
   * @method SyncUser:同步用户到钉钉或飞书
   */
  return request({
    url: '/rpcgateway/UserService/SyncUser',
    method: 'post',
    data: {
      'platform': platform,
      'ids': openids
    }
  })
}

export function bindSSOToken(SSOToken) {
  /**
   * 修改个人密码
   * @method update_pwd
   * @param old_pwd:旧密码
   * @param new_pwd:新密码
   */
  return request({
    url: '/rpcgateway/UserService/bindSSOToken',
    method: 'post',
    data: {
      SSOToken: SSOToken
    }
  })
}

export function param_info_by_key_openid(sys_key) {
  return request({
    url: '/rpcgateway/sysControlService/ParamInfoByKeyOpenid',
    method: 'get',
    params: {
      sys_key: sys_key
    }
  })
}
