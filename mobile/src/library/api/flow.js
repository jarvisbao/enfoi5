/**
 * 流程管理相关http接口
 * @module flow.js
 */
import request from '@/library/js/request'

export function flow_create(name, namespace, classify, description) {
  /**
   * 创建流程
   * @method flow_create
   * @param name 流程名称
   * @param namespace 工作流命名空间
   * @param description 工作流描述
   */
  return request({
    url: '/rpcgateway/FlowService/create',
    method: 'post',
    data: {
      'name': name,
      'namespace': namespace,
      'classify': classify,
      'description': description
    },
    headers: { signature: true }
  })
}

export function flow_remove(namespace) {
  /**
   * 删除流程
   * @method flow_remove
   * @param namespace 流程命名空间
   */
  return request({
    url: '/rpcgateway/FlowService/delete',
    method: 'post',
    data: {
      'namespace': namespace
    },
    headers: { signature: true }
  })
}

export function flow_removes(namespaces) {
  /**
   * 删除流程
   * @method flow_removes
   * @param namespaces 流程命名空间 []
   */
  return request({
    url: '/rpcgateway/FlowService/deletes',
    method: 'post',
    data: {
      'namespaces': namespaces
    },
    headers: { signature: true }
  })
}

export function flow_info(flow_id) {
  /**
   * 流程信息
   * @method flow_info
   * @param flow_id 流程id
   */
  return request({
    url: '/rpcgateway/FlowService/flow',
    method: 'get',
    params: {
      'flow_id': flow_id
    }
  })
}

export function flow_list(text, page, page_index, page_size, class_id) {
  /**
   * 流程列表
   * @method flow_list
   * @param text
   * @param page
   * @param page_index
   * @param page_size
   * @param class_id 流程分类ID
   */
  return request({
    url: '/rpcgateway/FlowService/list',
    method: 'get',
    params: {
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size,
      'class_id': class_id
    }
  })
}

export function version_all(namespace) {
  /**
   * 根据流程命名空间获取所有的版本
   * @method all_version
   * @param namespace
   */
  return request({
    url: '/rpcgateway/FlowService/all_version',
    method: 'get',
    params: {
      'namespace': namespace
    }
  })
}

export function flow_design(flow_id, name, act_def_id, status, support_mobile, description, def_setting, is_new_version) {
  /**
   * 创建节点
   * @method flow_design
   * @param flow_id 所创建的节点流程ID
   * @param name 节点名字
   * @param act_def_id bpmn定义的流程ID
   * @param status 流程状态
   * @param support_mobile 支持移动端
   * @param description 流程描述
   * @param def_setting 流程设计信息
   * @param is_new_version 是否发布新版本，发布新版本会 将当前流程复制并版本加1
   */
  return request({
    url: '/rpcgateway/FlowService/design',
    method: 'post',
    data: {
      'flow_id': flow_id,
      'name': name,
      'act_def_id': act_def_id,
      'status': status,
      'support_mobile': support_mobile,
      'description': description,
      'def_setting': def_setting,
      'is_new_version': is_new_version
    },
    headers: { signature: true }
  })
}

export function set_main_version(flow_id) {
  /**
   * 将指定流程ID设置为主版本
   * @method set_main
   * @param flow_id 流程ID
   */
  return request({
    url: '/rpcgateway/FlowService/set_main',
    method: 'post',
    data: {
      'flow_id': flow_id
    },
    headers: { signature: true }
  })
}

export function classify_add(name, parent_id) {
  /**
   * 添加流程分类
   * @param name 流程名称
   * @param parent_id 父分类ID, 为空带表顶级分类
   */
  return request({
    url: '/rpcgateway/FlowService/add_classify',
    method: 'post',
    data: {
      name: name,
      parent_id: parent_id
    },
    headers: { signature: true }
  })
}

export function classify_del(class_id) {
  /**
   * 删除流程分类
   * @param name 流程名称
   * @param class_id 分类ID
   */
  return request({
    url: '/rpcgateway/FlowService/del_classify',
    method: 'post',
    data: {
      class_id: class_id
    },
    headers: { signature: true }
  })
}

export function all_classify() {
  /**
   * 获取所有的分类
   */
  return request({
    url: '/rpcgateway/FlowService/all_classify',
    method: 'get',
    params: {}
  })
}

export function classify_tree() {
  /**
   * 获取分类树
   */
  return request({
    url: '/rpcgateway/FlowService/tree_classify',
    method: 'get',
    params: {}
  })
}

export function flows_auth(openid) {
  /**
   * 获取指定用户可以发起的流程
   */
  return request({
    url: '/rpcgateway/FlowService/auth_flows',
    method: 'get',
    params: {
      openid: openid
    }
  })
}

export function buttons_default() {
  /**
   * 获取默认按钮
   */
  return request({
    url: '/rpcgateway/FlowService/default_buttons',
    method: 'get',
    params: {}
  })
}

export function apis_extension() {
  /**
   * 获取扩展脚本接口
   */
  return request({
    url: '/rpcgateway/FlowService/extension_apis',
    method: 'get',
    params: {}
  })
}

export function download(namespaces) {
  /**
   * 流程导出
   */
  return request({
    url: '/rpcgateway/FlowService/downloads',
    method: 'get',
    params: {
        namespaces: namespaces
    }
  })
}

export function upload(datas) {
  /**
   * 流程导入
   */
  return request({
    url: '/rpcgateway/FlowService/upload',
    method: 'post',
    data: {
      datas: datas
    }
  })
}

export function the_observed() {
  return request({
    url: '/rpcgateway/FlowService/the_observer',
    method: 'get',
    params: {}
  })
}

export function auth_add_edit(from_user, to_user, start_time, end_time, auth_type, value, status, auth_id) {
  /**
   * 添加/编辑授权
   * @param from_user 授权人
   * @param to_user 被授权人
   * @param start_time 开始时间
   * @param end_time 结束时间
   * @param auth_type 授权类型
   * @param value 授权值
   * @param status 授权状态
   * @param auth_id 授权ID,不存在即添加
   */
  return request({
    url: '/rpcgateway/FlowService/edit_auth',
    method: 'post',
    data: {
      from_user: from_user,
      to_user: to_user,
      start_time: start_time,
      end_time: end_time,
      auth_type: auth_type,
      value: value,
      status: status,
      auth_id: auth_id
    }
  })
}

export function auth_delete(auth_id) {
  /**
   * 删除授权
   * @param auth_id 授权ID
   */
  return request({
    url: '/rpcgateway/FlowService/del_auth',
    method: 'post',
    data: {
      auth_id: auth_id
    }
  })
}

export function auth_list(text, page, page_index, page_size) {
  /**
   * 删除授权
   * @param auth_id 授权ID
   */
  return request({
    url: '/rpcgateway/FlowService/list_auth',
    method: 'get',
    params: {
      text: text,
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function auth_view(auth_id) {
  /**
   * 授权信息
   * @param auth_id 授权ID
   */
  return request({
    url: '/rpcgateway/FlowService/view_auth',
    method: 'get',
    params: {
      auth_id: auth_id
    }
  })
}
