/**
 * 流程表单相关http接口
 * @module form.js
 */
import request from '@/library/js/request'

export function form_create(flow_id, owner_id, name, label) {
  /**
   * 创建表单
   * @method form_create
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param name 表单名
   * @param label 表单标签
   */
  return request({
    url: '/rpcgateway/FormService/create',
    method: 'post',
    data: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'name': name,
      'label': label
    },
    headers: { signature: true }
  })
}

export function form_update(flow_id, owner_id, form_id, name, label, props) {
  /**
   * 更新表单
   * @method form_update
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   * @param name 表单名
   * @param label 表单标签
   */
  return request({
    url: '/rpcgateway/FormService/update',
    method: 'post',
    data: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id,
      'name': name,
      'label': label,
      'props': props
    },
    headers: { signature: true }
  })
}

export function form_delete(flow_id, owner_id, form_id) {
  /**
   * 删除表单
   * @method form_delete
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   */
  return request({
    url: '/rpcgateway/FormService/delete',
    method: 'post',
    data: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id
    },
    headers: { signature: true }
  })
}

export function form_info(flow_id, owner_id, form_id) {
  /**
   * 表单信息
   * @method form_info
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   */
  return request({
    url: '/rpcgateway/FormService/info',
    method: 'get',
    params: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id
    }
  })
}

export function form_list(flow_id, owner_id) {
  /**
   * 表单列表
   * @method form_info
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   */
  return request({
    url: '/rpcgateway/FormService/list',
    method: 'get',
    params: {
      'flow_id': flow_id,
      'owner_id': owner_id
    }
  })
}

export function form_all_list(flow_id) {
  /**
   * 所有表单列表
   * @method form_all_list
   * @param flow_id 流程ID
   */
  return request({
    url: '/rpcgateway/FormService/all_list',
    method: 'get',
    params: {
      'flow_id': flow_id
    }
  })
}

export function get_form(flow_id, owner_id, form_id) {
  /**
   * 获取表单和流程
   * @method get_form
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   */
  return request({
    url: '/rpcgateway/FormService/get_form',
    method: 'get',
    params: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id
    }
  })
}

export function field_create(flow_id, owner_id, form_id, name, label, cls_name, rule_js, rule_py, props) {
  /**
   * 创建表单字段
   * @method form_create
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   * @param name 字段名称
   * @param label 字段标签
   * @param cls_name 字段类型
   * @param rule_js 验证的js
   * @param rule_py 验证的py
   * @param props 字段的扩展属性
   */
  return request({
    url: '/rpcgateway/FieldService/create',
    method: 'post',
    data: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id,
      'name': name,
      'label': label,
      'cls_name': cls_name,
      'rule_js': rule_js,
      'rule_py': rule_py,
      'props': props
    },
    headers: { signature: true }
  })
}

export function field_update(flow_id, owner_id, form_id, field_id, name, label, rule_js, rule_py, props) {
  /**
   * 更新表单字段
   * @method form_update
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   * @param field_id 字段ID
   * @param name 字段名称
   * @param label 字段标签
   * @param cls_name 字段类型
   * @param rule_js 验证的js
   * @param rule_py 验证的py
   * @param props 字段的扩展属性
   */
  return request({
    url: '/rpcgateway/FieldService/update',
    method: 'post',
    data: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id,
      'field_id': field_id,
      'name': name,
      'label': label,
      'rule_js': rule_js,
      'rule_py': rule_py,
      'props': props
    },
    headers: { signature: true }
  })
}

export function field_remove(flow_id, owner_id, form_id, field_id) {
  /**
   * 删除表单字段
   * @method field_remove
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   * @param field_id 字段ID
   */
  return request({
    url: '/rpcgateway/FieldService/delete',
    method: 'post',
    data: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id,
      'field_id': field_id
    },
    headers: { signature: true }
  })
}

export function field_info(flow_id, owner_id, form_id, field_id) {
  /**
   * 表单字段信息
   * @method field_info
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   * @param field_id 字段ID
   */
  return request({
    url: '/rpcgateway/FieldService/info',
    method: 'get',
    params: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id,
      'field_id': field_id
    }
  })
}

export function field_list(flow_id, owner_id, form_id) {
  /**
   * 表单字段列表
   * @method field_list
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   */
  return request({
    url: '/rpcgateway/FieldService/list',
    method: 'get',
    params: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id
    }
  })
}

export function get_field(flow_id, owner_id, form_id, field_id) {
  /**
   * 获取表单字段
   * @method get_field
   * @param flow_id 流程ID
   * @param owner_id 所属ID, 流程id / 节点id
   * @param form_id 表单ID
   * @param field_id 字段ID
   */
  return request({
    url: '/rpcgateway/FieldService/get_field',
    method: 'get',
    params: {
      'flow_id': flow_id,
      'owner_id': owner_id,
      'form_id': form_id,
      'field_id': field_id
    }
  })
}
