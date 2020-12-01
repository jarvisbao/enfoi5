/**
 * resource相关http接口
 * @module login.js
 */
import request from '@/library/js/request'

export function resource_create(
  res_code,
  text,
  parent_namespace,
  category,
  props,
  ref_id,
  instance
) {
  /**
   * @method resource_create
   * @param res_code: 资源代码
   * @param text: 资源的显示文本
   * @param parent_id: 父资源的ID
   * @param category: 资源类型
   * @param props: 资源的属性
   * @param ref_id: 资源所对应对象的ID
   * @param instance: 该资源是否为实例类资源
   */
  return request({
    url: '/rpcgateway/ResourceService/create_resource',
    method: 'post',
    data: {
      res_code: res_code,
      text: text,
      parent_namespace: parent_namespace,
      category: category,
      props: props,
      ref_id: ref_id,
      instance: instance
    },
    headers: { signature: true }
  })
}

export function resource_remove(res_id) {
  /**
   * @method resource_remove
   * @param res_id: 资源ID
   */
  return request({
    url: '/rpcgateway/ResourceService/remove_resource',
    method: 'post',
    data: {
      res_id: res_id
    },
    headers: { signature: true }
  })
}

export function resource_update(res_id, text, category, props) {
  /**
   * @method resource_update
   * @param res_id: 资源ID
   * @param text: 资源显示文本
   * @param category: 资源类型
   * @param props: 资源属性
   */
  return request({
    url: '/rpcgateway/ResourceService/update_resource',
    method: 'post',
    data: {
      res_id: res_id,
      text: text,
      category: category,
      props: props
    },
    headers: { signature: true }
  })
}

export function resource_list(parent_namespace, text, page, page_index, page_size, tree) {
  /**
   * @method resource_list
   * @param parent_id: 父资源ID
   */
  return request({
    url: '/rpcgateway/ResourceService/resources',
    method: 'get',
    params: {
      parent_namespace: parent_namespace,
      text: text,
      page: page,
      page_index: page_index,
      page_size: page_size,
      tree: tree
    }
  })
}

export function resource_info(res_id) {
  /**
   * @method resource_info
   * @param parent_id: 资源ID
   */
  return request({
    url: '/rpcgateway/ResourceService/get_resource_by_id',
    method: 'get',
    params: {
      res_id: res_id
    }
  })
}

export function attributes_create(
  namespace,
  attr_name,
  attr_label,
  attr_type,
  is_children,
  is_self,
  props
) {
  /**
   * @method attributes_create
   * @param namespace: 资源命名空间
   * @param attr_name: 属性名称
   * @param attr_label: 属性显示名
   * @param attr_type: 属性类型
   * @param is_children: 是否为子资源的属性
   * @param is_self: 是否为本资源的属性
   * @param props: 属性的保留字段
   */
  return request({
    url: '/rpcgateway/ResourceService/create_attribute',
    method: 'post',
    data: {
      namespace: namespace,
      attr_name: attr_name,
      attr_label: attr_label,
      attr_type: attr_type,
      is_children: is_children,
      is_self: is_self,
      props: props
    },
    headers: { signature: true }
  })
}
export function attributes_update(
  attr_id,
  attr_name,
  attr_label,
  attr_type,
  is_children,
  is_self,
  props
) {
  /**
   * @method attributes_update
   * @param attr_id: 属性ID
   * @param attr_name: 属性名称
   * @param attr_label: 属性显示名
   * @param attr_type: 属性类型
   * @param is_children: 是否为子资源的属性
   * @param is_self: 是否为本资源的属性
   * @param props: 属性的保留字段
   */
  return request({
    url: '/rpcgateway/ResourceService/update_attribute',
    method: 'post',
    data: {
      attr_id: attr_id,
      attr_name: attr_name,
      attr_label: attr_label,
      attr_type: attr_type,
      is_children: is_children,
      is_self: is_self,
      props: props
    },
    headers: { signature: true }
  })
}

export function attributes_remove(attr_id) {
  /**
   * @method attributes_remove
   * @param attr_id: 属性ID
   */
  return request({
    url: '/rpcgateway/ResourceService/remove_attribute',
    method: 'post',
    data: {
      attr_id: attr_id
    },
    headers: { signature: true }
  })
}

export function attributes_list(namespace, text, page, page_index, page_size) {
  /**
   * @method attributes_list
   * @param namespace: 资源ID
   */
  return request({
    url: '/rpcgateway/ResourceService/attributes',
    method: 'get',
    params: {
      namespace: namespace,
      text: text,
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function attributes_info(attr_id) {
  /**
   * @method attributes_info
   * @param res_id: 资源ID
   */
  return request({
    url: '/rpcgateway/ResourceService/get_attribute_by_id',
    method: 'get',
    params: {
      attr_id: attr_id
    }
  })
}

export function actions_create(
  namespace,
  action_name,
  action_label,
  can_execute,
  can_create,
  can_update,
  can_delete,
  can_view,
  attributes,
  is_children,
  is_self,
  props
) {
  /**
   * @method actions_create
   * @param res_id: 资源ID
   * @param action_name: 动作名称
   * @param action_label: 动作显示文本
   * @param can_execute: 是否具有执行权限
   * @param can_create: 是否具有创建权限
   * @param can_update: 是否具有更新权限
   * @param can_delete: 是否具有删除权限
   * @param can_view: 是否具有查看权限
   * @param attributes: 动作包含的资源的字段列表
   * @param is_children: 是否为子资源的动作
   * @param is_self: 是否为本资源的动作
   * @param props: 动作的保留字段
   */
  return request({
    url: '/rpcgateway/ResourceService/create_action',
    method: 'post',
    data: {
      namespace: namespace,
      action_name: action_name,
      action_label: action_label,
      can_execute: can_execute,
      can_create: can_create,
      can_update: can_update,
      can_delete: can_delete,
      can_view: can_view,
      attributes: attributes,
      is_children: is_children,
      is_self: is_self,
      props: props
    },
    headers: { signature: true }
  })
}

export function actions_update(
  action_id,
  action_name,
  action_label,
  can_execute,
  can_create,
  can_update,
  can_delete,
  can_view,
  attributes,
  is_children,
  is_self,
  props
) {
  /**
   * @method actions_update
   * @param action_id: 动作ID
   * @param action_name: 动作名称
   * @param action_label: 动作显示文本
   * @param can_execute: 是否具有执行权限
   * @param can_create: 是否具有创建权限
   * @param can_update: 是否具有更新权限
   * @param can_delete: 是否具有删除权限
   * @param can_view: 是否具有查看权限
   * @param attributes: 动作包含的资源的字段列表
   * @param is_children: 是否为子资源的属性
   * @param is_self: 是否为本资源的属性
   * @param props: 属性的保留字段
   */
  return request({
    url: '/rpcgateway/ResourceService/update_action',
    method: 'post',
    data: {
      action_id: action_id,
      action_name: action_name,
      action_label: action_label,
      can_execute: can_execute,
      can_create: can_create,
      can_update: can_update,
      can_delete: can_delete,
      can_view: can_view,
      attributes: attributes,
      is_children: is_children,
      is_self: is_self,
      props: props
    },
    headers: { signature: true }
  })
}

export function actions_remove(action_id) {
  /**
   * @method actions_remove
   * @param action_id: Action_ID
   */
  return request({
    url: '/rpcgateway/ResourceService/remove_action',
    method: 'post',
    data: {
      action_id: action_id
    },
    headers: { signature: true }
  })
}

export function actions_list(namespace, text, page, page_index, page_size) {
  /**
   * @method actions_list
   * @param res_id: 资源ID
   */
  return request({
    url: '/rpcgateway/ResourceService/actions_by_namespace',
    method: 'get',
    params: {
      namespace: namespace,
      text: text,
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function actions_info(action_id) {
  /**
   * @method actions_info
   * @param action_id: ActionID
   */
  return request({
    url: '/rpcgateway/ResourceService/get_action_by_id',
    method: 'get',
    params: {
      action_id: action_id
    }
  })
}

export function actions_list_ref(ref_id, text, page, page_index, page_size) {
  /**
   * @method actions_list_ref
   * @param ref_id
   */
  return request({
    url: '/rpcgateway/ResourceService/actions_by_refid',
    method: 'get',
    params: {
      ref_id: ref_id,
      text: text,
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function assignments_create(action_id, namespace, role_code, expire_at) {
  /**
   * @method assignments_create
   * @param action_id: Action_ID
   * @param role_id: 角色ID
   * @param expire_at: 授权的失效时间
   */
  return request({
    url: '/rpcgateway/ResourceService/assign',
    method: 'post',
    data: {
      action_id: action_id,
      namespace: namespace,
      role_code: role_code,
      expire_at: expire_at
    },
    headers: { signature: true }
  })
}

export function assignments_remove(assignment_id) {
  /**
   * @method assignments_remove
   * @param action_id: Action_id
   * @param role_id: 角色ID
   * @param res_id: 资源ID
   */
  return request({
    url: '/rpcgateway/ResourceService/remove_assignment',
    method: 'post',
    data: {
      assignment_id: assignment_id
    },
    headers: { signature: true }
  })
}

export function assignments_list(action_id, text, page, page_index, page_size) {
  /**
   * @method assignments_list
   * @param action_id: Action_ID
   * @param text: 要搜索的文本
   * @param page: 分页开关
   * @param page_index: 当前页面
   * @param page_size: 每页包含的记录条数
   */
  return request({
    url: '/rpcgateway/ResourceService/assignments',
    method: 'get',
    params: {
      action_id: action_id,
      text: text,
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function check_action(action_uri) {
  /**
   * @method menu_assignments
   * @param res_id: res_id
   * @param role_id: 角色ID
   */
  return request({
    url: '/rpcgateway/ResourceService/check_action',
    method: 'post',
    data: {
      action_uri: action_uri
    }
  })
}

