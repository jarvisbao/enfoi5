/**
 * 群组管理相关http接口
 * @module group.js
 */
import request from '@/library/js/request'

export function group_create(org_code, name, props) {
/**
 * @method group_create
 * @param org_id: 组织机构ID
 * @param name: 群组名称
 * @param props: 群组的属性
 */

  return request({
    url: '/rpcgateway/GroupService/create_group',
    method: 'post',
    data: {
      'org_code': org_code,
      'name': name,
      'props': props
    },
    headers: { signature: true }
  })
}

export function group_update(group_id, name, props) {
/**
 * @method group_update
 * @param group_id: 群组ID
 * @param name: 群组名称
 * @param props: 群组属性
 */
  return request({
    url: '/rpcgateway/GroupService/update_group',
    method: 'post',
    data: {
      'group_id': group_id,
      'name': name,
      'props': props
    },
    headers: { signature: true }
  })
}

export function group_remove(group_id) {
/**
 * @method group_remove
 * @param group_id: 群组的ID
*/

  return request({
    url: '/rpcgateway/GroupService/delete_group',
    method: 'post',
    data: {
      'group_id': group_id
    },
    headers: { signature: true }
  })
}

export function group_remove_v2(group_id) {
  /**
   * @method group_remove
   * @param group_id: 群组的ID
   */

  return request({
    url: '/rpcgateway/GroupService/delete_group_v2',
    method: 'post',
    data: {
      'group_id': group_id
    },
    headers: { signature: true }
  })
}

export function active_group(group_id) {
  /**
   * @method group_remove
   * @param group_id: 群组的ID
   */

  return request({
    url: '/rpcgateway/GroupService/active_group',
    method: 'post',
    data: {
      'group_id': group_id
    },
    headers: { signature: true }
  })
}

export function group_info(group_id) {
/**
 * @method group_info
 * @param group_id: 群组ID
 */
  return request({
    url: '/rpcgateway/GroupService/get_group',
    method: 'get',
    params: {
      'group_id': group_id
    }
  })
}

export function group_members_add(group_id, user_id, props) {
/**
 * @method group_members_add
 * @param group_id: 群组ID
 * @param users_info: [{'user_id':user_id,'props':props}]
 */
  return request({
    url: '/rpcgateway/GroupService/group_member_add',
    method: 'post',
    data: {
      'group_id': group_id,
      'user_id': user_id,
      'props': props
    },
    headers: { signature: true }
  })
}

export function group_members_remove(group_id, user_id, admin_only) {
/**
 * @method group_members_remove
 * @param org_id: 群组的ID
 * @param user_ids: [user_id]
 */
  return request({
    url: '/rpcgateway/GroupService/group_members_remove',
    method: 'post',
    data: {
      'group_id': group_id,
      'user_id': user_id,
      'admin_only': admin_only
    },
    headers: { signature: true }
  })
}

export function group_members_list(group_id, text, page, page_index, page_size) {
/**
 * @method group_members_list
 * @param group_id: 群组的ID
 * @param text: 搜索的文本
 * @param page: 分页开关
 * @param page_index: 当前页码
 * @param page_size: 每页包含的记录条数
 */
  return request({
    url: '/rpcgateway/GroupService/group_members_list',
    method: 'get',
    params: {
      'group_id': group_id,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}
export function group_admin_add(group_id, user_id, props) {
/**
 * @method group_admin_add
 * @param group_id: 群组ID
 * @param user_id: 用户的ID
 */
  return request({
    url: '/rpcgateway/GroupService/group_admin_assign',
    method: 'post',
    data: {
      'group_id': group_id,
      'user_id': user_id,
      'props': props
    },
    headers: { signature: true }
  })
}
export function group_admin_remove(group_id, user_id) {
/**
 * @method group_admin_remove
 * @param group_id: 群组ID
 * @param user_id: 用户的ID
 */
  return request({
    url: '/rpcgateway/GroupService/group_admin_remove',
    method: 'post',
    data: {
      'group_id': group_id,
      'user_id': user_id
    },
    headers: { signature: true }
  })
}

export function group_admin_list(group_id) {
/**
 * @method group_admin_list
 * @param group_id: 群组ID
 */
  return request({
    url: '/rpcgateway/GroupService/group_admin_list',
    method: 'get',
    params: {
      'group_id': group_id
    }
  })
}

export function group_role_add(group_id, role_code) {
/**
 * @method group_role_add
 * @param group_id: 群组ID
 * @param role_ids: [role_id]
 */
  return request({
    url: '/rpcgateway/GroupService/group_role_add',
    method: 'post',
    data: {
      'group_id': group_id,
      'role_code': role_code
    },
    headers: { signature: true }
  })
}

export function group_role_remove(group_id, role_code) {
/**
 * @method group_role_remove
 * @param group_id: 群组ID
 * @param role_ids: [role_id]
 */
  return request({
    url: '/rpcgateway/GroupService/group_role_remove',
    method: 'post',
    data: {
      'group_id': group_id,
      'role_code': role_code
    },
    headers: { signature: true }
  })
}

export function group_role_list(group_id, text, page, page_index, page_size) {
/**
 * @method group_role_list
 * @param group_id: 群组ID
 */
  return request({
    url: '/rpcgateway/GroupService/group_role_list',
    method: 'get',
    params: {
      'group_id': group_id,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function group_list(text, page, page_index, page_size, status) {
/**
 * 机构列表
 * @method group_list
 * @param text:要搜索的文本，可选，如果该值不为空，则返回包含文本的角色
 * @param page: on或者off, 缺省为off, on代表要分页, off代表不分页
 * @param page_index: 当前页码，缺省为1，只有page为on时生效
 * @param page_size: 每页包含的记录条数，缺省为10，只有page为on时生效
 */
  return request({
    url: '/rpcgateway/GroupService/group_list',
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

