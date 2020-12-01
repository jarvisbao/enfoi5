/**
 * 角色相关http接口
 * @module role.js
 */
import request from '@/library/js/request'

export function role_list(owner, text, page, page_index, page_size, status) {
/**
 * 用户列表
 * @method role_list
 * @param owner: 可选，只返回指定owner的角色列表
 * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的角色
 * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
 * @param page_index: 当前页码，缺省为1，只有page为on时生效
 * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
 * @return {axios} axios请求实例
 */
  return request({
    url: '/rpcgateway/RoleService/roles',
    method: 'get',
    params: {
      'owner': owner,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size,
      status: status
    }
  })
}

export function role_create(role_code, name, category, comment, owner, props) {
/**
 * 添加一个角色
 * @method role_create
 * @param role_code: 角色代码
 * @param name: 角色名称
 * @param category: 角色分类
 * @param comment: 角色描述
 * @param owner: 角色的拥有者
 * @param props: 角色属性
 */
  return request({
    url: '/rpcgateway/RoleService/create_role',
    method: 'post',
    data: {
      'role_code': role_code,
      'name': name,
      'category': category,
      'comment': comment,
      'owner': owner,
      'props': props
    },
    headers: { signature: true }
  })
}

export function role_remove(role_code) {
/**
 * 删除一个角色
 * @method role_remove
 * @param role_id: 角色ID
 */
  return request({
    url: '/rpcgateway/RoleService/remove',
    method: 'post',
    data: {
      'role_code': role_code
    },
    headers: { signature: true }
  })
}

export function role_remove_v2(role_code) {
  /**
   * 删除一个角色
   * @method role_remove
   * @param role_id: 角色ID
   */
  return request({
    url: '/rpcgateway/RoleService/remove_v2',
    method: 'post',
    data: {
      'role_code': role_code
    },
    headers: { signature: true }
  })
}

export function active_role(role_code) {
  /**
   * 删除一个角色
   * @method role_remove
   * @param role_id: 角色ID
   */
  return request({
    url: '/rpcgateway/RoleService/active_role',
    method: 'post',
    data: {
      'role_code': role_code
    },
    headers: { signature: true }
  })
}

export function role_update(old_role_code, new_role_code, name, category, comment, owner, props) {
/**
 * 更新一个角色
 * @method role_update
 * @param role_id: 角色ID
 * @param role_code: 角色代码
 * @param name: 角色名称
 * @param category: 角色分类
 * @param comment: 角色描述
 * @param owner: 角色的拥有者
 * @param props: 角色属性
 */
  return request({
    url: '/rpcgateway/RoleService/update',
    method: 'post',
    data: {
      'old_role_code': old_role_code,
      'new_role_code': new_role_code,
      'name': name,
      'category': category,
      'comment': comment,
      'owner': owner,
      'props': props
    },
    headers: { signature: true }
  })
}

export function role_info(role_code) {
  /**
   * 获取用户信息
   * @method role_info
   * @param param role_id: 指定角色的ID
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/RoleService/role_by_code',
    method: 'get',
    params: { 'role_code': role_code }
  })
}

export function role_groups_list(role_code, text, page, page_index, page_size) {
/**
 * 获取拥有此角色的群组列表
 * @method role_group_list
 * @param role_id: 角色ID
 * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的角色
 * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
 * @param page_index: 当前页码，缺省为1，只有page为on时生效
 * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
 */
  return request({
    url: '/rpcgateway/RoleService/groups',
    method: 'get',
    params: {
      'role_code': role_code,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function role_orgs_list(role_code, text, page, page_index, page_size) {
/**
 * 获取拥有此角色的机构列表
 * @method role_orgs_list
 * @param role_id: 角色ID
 * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的角色
 * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
 * @param page_index: 当前页码，缺省为1，只有page为on时生效
 * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
 */
  return request({
    url: '/rpcgateway/RoleService/orgs',
    method: 'get',
    params: {
      'role_code': role_code,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function role_user_list(role_code, text, page, page_index, page_size) {
/**
 * 获取拥有此角色的机构列表
 * @method role_user_list
 * @param role_id: 角色ID
 * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的角色
 * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
 * @param page_index: 当前页码，缺省为1，只有page为on时生效
 * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
 */
  return request({
    url: '/rpcgateway/RoleService/users',
    method: 'get',
    params: {
      'role_code': role_code,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}
