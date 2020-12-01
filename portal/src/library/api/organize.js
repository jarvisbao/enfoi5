/**
 * 组织机构管理相关http接口
 * @module organize.js
 */
import request from '@/library/js/request'

export function organize_create(org_code, org_name, parent_code, props) {
/**
 * @method organize_create
 * @param org_code: 组织机构代码
 * @param org_name: 组织机构名称
 * @param parent: 父级组织机构代码
 * @param props: 组织机构属性
 */

  return request({
    url: '/rpcgateway/OrganizeService/organize_create',
    method: 'post',
    data: {
      'org_code': org_code,
      'org_name': org_name,
      'parent_code': parent_code,
      'props': props
    },
    headers: { signature: true }
  })
}

export function organize_update(org_code, name, props) {
/**
 * @method organize_update
 * @param org_id: 组织机构ID
 * @param name: 组织机构名称
 * @param props: 组织机构属性
 */
  return request({
    url: '/rpcgateway/OrganizeService/organize_update',
    method: 'post',
    data: {
      'org_code': org_code,
      'name': name,
      'props': props
    },
    headers: { signature: true }
  })
}

export function organize_remove(org_code) {
/**
 * @method organize_remove
 * @param org_id: 组织机构ID
*/
  return request({
    url: '/rpcgateway/OrganizeService/organize_remove',
    method: 'post',
    data: {
      'org_code': org_code
    }
  })
}

export function organize_remove_v2(org_code) {
  /**
   * @method organize_remove
   * @param org_id: 组织机构ID
   */
  return request({
    url: '/rpcgateway/OrganizeService/organize_remove_v2',
    method: 'post',
    data: {
      'org_code': org_code
    }
  })
}

export function active_organize(org_code) {
  /**
   * @method organize_remove
   * @param org_id: 组织机构ID
   */
  return request({
    url: '/rpcgateway/OrganizeService/active_organize',
    method: 'post',
    data: {
      'org_code': org_code
    }
  })
}

export function organize_list(parent_code, recursive, text, page, page_index, page_size, tree, status) {
/**
 * @method organize_list
 */
  return request({
    url: '/rpcgateway/OrganizeService/organizes',
    method: 'get',
    params: {
      'parent_code': parent_code,
      'recursive': recursive,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size,
      'tree': tree,
      status: status
    }
  })
}

export function organize_info(org_code) {
/**
 * @method organize_info
 * @param org_id: 组织机构ID
 */
  return request({
    url: '/rpcgateway/OrganizeService/org_by_code',
    method: 'get',
    params: {
      'org_code': org_code
    }
  })
}

export function organize_members_add(org_code, user_id, title, isadmin, props) {
/**
 * @method organize_members_add
 * @param org_id: 组织机构ID
 * @param users_info: 用户信息,允许为多个.[{'user_id':user_id,'props':props}]
 */
  return request({
    url: '/rpcgateway/OrganizeService/add_member',
    method: 'post',
    data: {
      'org_code': org_code,
      'user_id': user_id,
      'title': title,
      'isadmin': isadmin,
      'props': props
    },
    headers: { signature: true }
  })
}

export function organize_members_remove(org_code, user_id) {
/**
 * @method organize_members_remove
 * @param org_id: 组织机构ID
 * @param user_ids: [user_id]
 */
  // var cryptor = get_server_cryptor()
  // org_id = cryptor.encrypt(org_id)
  // user_ids = cryptor.encrypt(user_ids)
  return request({
    url: '/rpcgateway/OrganizeService/remove_member',
    method: 'post',
    data: {
      'org_code': org_code,
      'user_id': user_id
    },
    headers: { signature: true }
  })
}

export function organize_members_list(org_code, recursive, text, page, page_index, page_size) {
/**
 * @method organize_members_list
 * @param org_id: 组织机构ID
 */
  return request({
    url: '/rpcgateway/OrganizeService/members',
    method: 'get',
    params: {
      'org_code': org_code,
      'recursive': recursive,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function organize_groups_list(org_code, text, page, page_index, page_size) {
/**
 * @method organize_groups_list
 * @param org_id: 组织机构ID
 * @param text: 搜索的文本
 * @param page: 分页开关
 * @param page_index: 当前页码
 * @param page_size: 每页包含的记录条数
 */
  return request({
    url: '/rpcgateway/OrganizeService/groups',
    method: 'get',
    params: {
      'org_code': org_code,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function organize_roles_add(org_code, role_code) {
  /**
     * @method organize_roles_add
     * @param org_id: 组织机构ID
     * @param role_ids: 角色id, 可以是多个 [role_id, role_id]
     */
  return request({
    url: '/rpcgateway/OrganizeService/add_role',
    method: 'post',
    data: {
      'org_code': org_code,
      'role_code': role_code
    },
    headers: { signature: true }
  })
}

export function organize_roles_remove(org_code, role_code) {
  /**
         * @method organize_roles_remove
         * @param org_id: 组织机构ID
         * @param role_ids: 角色id, 可以是多个 [role_id, role_id]
         */
  return request({
    url: '/rpcgateway/OrganizeService/remove_role',
    method: 'post',
    data: {
      'org_code': org_code,
      'role_code': role_code
    },
    headers: { signature: true }
  })
}

export function organize_roles_list(org_code, recursive, text, page, page_index, page_size) {
/**
 * @method organize_roles_list
 * @param org_id: 组织机构ID
 * @param text: 搜索的文本
 * @param page: 分页开关
 * @param page_index: 当前页码
 * @param page_size: 每页包含的记录条数
 */
  return request({
    url: '/rpcgateway/OrganizeService/roles',
    method: 'get',
    params: {
      'org_code': org_code,
      'recursive': recursive,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function CreatePosition(org_code, name, code) {
/**
 * @method CreatePosition
 * @param org_code
 * @param name: 组织机构职位名称
 * @param code: 组织机构职位编码*/
  return request({
    url: '/rpcgateway/OrganizeService/CreatePosition',
    method: 'post',
    data: {
      org_code: org_code,
      name: name,
      code: code
    }
  })
}

export function RemovePosition(code) {
  /**
   * @method RemovePosition
   * @param code: 组织机构职位编码*/
  return request({
    url: '/rpcgateway/OrganizeService/RemovePosition',
    method: 'post',
    data: {
      code: code
    }
  })
}

export function CreatePositionUser(user_id, code) {
  /**
   * @method CreatePositionUser
   * @paraam user_id
   * @param code: 组织机构职位编码*/
  return request({
    url: '/rpcgateway/OrganizeService/CreatePositionUser',
    method: 'post',
    data: {
      user_id: user_id,
      code: code
    }
  })
}

export function RemovePositionUser(user_id, code) {
  /**
   * @method RemovePositionUser
   * @paraam user_id
   * @param code: 组织机构职位编码*/
  return request({
    url: '/rpcgateway/OrganizeService/RemovePositionUser',
    method: 'post',
    data: {
      user_id: user_id,
      code: code
    }
  })
}

export function OrgPositions(org_code, text, page, page_index, page_size) {
  /**
   * @method organize_roles_list
   * @param org_code: 组织机构编码
   * @param text: 搜索的文本
   * @param page: 分页开关
   * @param page_index: 当前页码
   * @param page_size: 每页包含的记录条数
   */
  return request({
    url: '/rpcgateway/OrganizeService/OrgPositions',
    method: 'get',
    params: {
      'org_code': org_code,
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function PositionUsers(code, text, page, page_index, page_size) {
  /**
   * @method PositionUsers
   * @param code: 组织机构职位编码
   * @param text: 搜索的文本
   * @param page: 分页开关
   * @param page_index: 当前页码
   * @param page_size: 每页包含的记录条数
   */
  return request({
    url: '/rpcgateway/OrganizeService/PositionUsers',
    method: 'get',
    params: {
      code: code,
      text: text,
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function SyncDept(platform) {
  /**
   * @method SyncDept:同步组织机构到钉钉或飞书
   */
  return request({
    url: '/rpcgateway/OrganizeService/SyncDept',
    method: 'post',
    data: {
      'platform': platform
    }
  })
}
