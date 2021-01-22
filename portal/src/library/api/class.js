/**
 * 对象类相关http接口
 * @module class.js
 */
import request from '@/library/js/request'

export function class_create(repo_name, cls_name, cls_table, cls_comment, is_view, props, versioned) {
  /**
   * @method class_create
   * @param repo_id: 数据仓库ID
   * @param cls_name: 类名称
   * @param cls_table: 表名称
   * @param cls_comment: 表描述
   */

  return request({
    url: '/rpcgateway/ClassService/create',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      cls_table: cls_table,
      cls_comment: cls_comment,
      is_view: is_view,
      props: props,
      versioned: versioned
    },
    headers: { signature: true }
  })
}

export function class_edit(
  repo_name,
  old_cls_name,
  cls_name,
  cls_table,
  cls_comment,
  props,
  versioned
) {
  /**
   * @method class_edit
   * @param class_id: 对象类ID
   * @param repo_id: 数据仓库ID
   * @param cls_name: 类名称
   * @param cls_table: 表名称
   * @param cls_comment: 表描述
   */

  return request({
    url: '/rpcgateway/ClassService/update_by_name',
    method: 'post',
    data: {
      repo_name: repo_name,
      old_cls_name: old_cls_name,
      cls_name: cls_name,
      cls_table: cls_table,
      cls_comment: cls_comment,
      props: props,
      versioned: versioned
    },
    headers: { signature: true }
  })
}

export function class_delete(repo_name, cls_name) {
  /**
   * @method class_delete
   * @param class_id 对象类的相关ID
   */

  return request({
    url: '/rpcgateway/ClassService/remove_by_name',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_names: cls_name
    },
    headers: { signature: true }
  })
}

export function class_list(repo_name, text, page_index, page_size, page, is_view) {
  /**
   * @method class_list
   */
  return request({
    url: '/rpcgateway/ClassService/lists',
    method: 'get',
    params: {
      repo_name: repo_name,
      text: text,
      page_index: page_index,
      page_size: page_size,
      page: page,
      is_view: is_view
    }
  })
}

export function class_info(repo_name, cls_name) {
  /**
   * @method class_info
   * @param class_id: 类ID
   */
  return request({
    url: '/rpcgateway/ClassService/find_class_by_name',
    method: 'get',
    params: {
      repo_name: repo_name,
      class_name: cls_name
    }
  })
}

export function column_create(
  repo_name,
  cls_name,
  column_name,
  column_type,
  column_type_args,
  column_props,
  column_comment,
  data_convert,
  data_format,
  suffix_letter,
  deferred
) {
  /**
   * @method column_create
   * @param class_id: 类的ID
   * @param column_name: 栏目名
   * @param column_type: 栏目类型
   * @param column_type_args: 栏目的类型参数
   * @param column_props: 栏目的属性
   * @param column_comment: 栏目描述
   */

  return request({
    url: '/rpcgateway/ColumnService/create',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      column_name: column_name,
      column_type: column_type,
      column_type_args: column_type_args,
      column_props: column_props,
      column_comment: column_comment,
      data_convert: data_convert,
      data_format: data_format,
      suffix_letter: suffix_letter,
      deferred: deferred
    },
    headers: { signature: true }
  })
}

export function column_edit(
  repo_name,
  cls_name,
  old_column_name,
  column_name,
  column_type,
  column_type_args,
  column_props,
  column_comment,
  data_convert,
  data_format,
  suffix_letter,
  deferred
) {
  /**
   * @method column_edit
   * @param column_id: 栏目ID
   * @param class_id: 类的ID
   * @param column_name: 栏目名
   * @param column_type: 栏目类型
   * @param column_type_args: 栏目的类型参数
   * @param column_props: 栏目的属性
   * @param column_comment: 栏目描述
   */

  return request({
    url: '/rpcgateway/ColumnService/update',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      old_column_name: old_column_name,
      column_name: column_name,
      column_type: column_type,
      column_type_args: column_type_args,
      column_props: column_props,
      column_comment: column_comment,
      data_convert: data_convert,
      data_format: data_format,
      suffix_letter: suffix_letter,
      deferred: deferred
    },
    headers: { signature: true }
  })
}

export function column_delete(repo_name, cls_name, column_names) {
  /**
   * @method column_delete
   * @param column_id 栏目ID
   */

  return request({
    url: '/rpcgateway/ColumnService/remove_by_name',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      column_names: column_names
    },
    headers: { signature: true }
  })
}

export function column_list(repo_name, cls_name, text, page_index, page_size, page) {
  /**
   * @method column_list
   */
  return request({
    url: '/rpcgateway/ColumnService/columns',
    method: 'get',
    params: {
      repo_name: repo_name,
      cls_name: cls_name,
      text: text,
      page_index: page_index,
      page_size: page_size,
      page: page
    }
  })
}

export function column_info(repo_name, cls_name, column_name) {
  /**
   * @method column_info
   * @param column_id: 栏目ID
   */
  return request({
    url: '/rpcgateway/ColumnService/get_column_by_name',
    method: 'get',
    params: {
      repo_name: repo_name,
      cls_name: cls_name,
      column_name: column_name
    }
  })
}

export function column_types() {
  /**
   * @method column_info
   * @param column_id: 栏目ID
   */
  return request({
    url: '/rpcgateway/ColumnService/types',
    method: 'get',
    params: {
    }
  })
}

export function property_create(
  repo_name,
  cls_name,
  prop_name,
  prop_decorator,
  prop_code,
  prop_comment,
  params
) {
  /**
   * @method property_create
   * @param class_id: 类的ID
   * @param prop_name: 属性名
   * @param prop_decorator: 属性装饰器
   * @param prop_code: 属性的代码
   * @param prop_comment: 属性描述
   */

  return request({
    url: '/rpcgateway/PropertyService/create',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      prop_name: prop_name,
      prop_decorator: prop_decorator,
      prop_code: prop_code,
      prop_comment: prop_comment,
      params: params
    },
    headers: { signature: true }
  })
}

export function property_edit(
  repo_name,
  cls_name,
  old_prop_name,
  prop_name,
  prop_decorator,
  prop_code,
  prop_comment,
  params
) {
  /**
   * @method property_edit
   * @param property_id: 属性ID
   * @param class_id: 类的ID
   * @param prop_name: 属性名
   * @param prop_decorator: 属性装饰器
   * @param prop_code: 属性的代码
   * @param prop_comment: 属性描述
   */

  return request({
    url: '/rpcgateway/PropertyService/update_by_name',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      old_prop_name: old_prop_name,
      prop_name: prop_name,
      prop_decorator: prop_decorator,
      prop_code: prop_code,
      prop_comment: prop_comment,
      params: params
    },
    headers: { signature: true }
  })
}

export function property_delete(repo_name, cls_name, prop_names) {
  /**
   * @method property_delete
   * @param property_id: 属性ID
   */

  return request({
    url: '/rpcgateway/PropertyService/remove_by_name',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      prop_names: prop_names
    },
    headers: { signature: true }
  })
}

export function property_list(repo_name, cls_name, text, page_index, page_size, page) {
  /**
   * @method property_list
   */
  return request({
    url: '/rpcgateway/PropertyService/propertys',
    method: 'get',
    params: {
      repo_name: repo_name,
      cls_name: cls_name,
      text: text,
      page_index: page_index,
      page_size: page_size,
      page: page
    }
  })
}

export function property_info(repo_name, cls_name, prop_name) {
  /**
   * @method property_info
   * @param property_id: 属性ID
   */
  return request({
    url: '/rpcgateway/PropertyService/get_property_by_name',
    method: 'get',
    params: {
      repo_name: repo_name,
      cls_name: cls_name,
      prop_name: prop_name
    }
  })
}

export function relationship_create(
  repo_name,
  cls_name,
  name,
  argument,
  props,
  multiple,
  comment
) {
  /**
   * @method relationship_create
   * @param name: 关系名
   * @param class_id: 类的ID
   * @param argument: 被映射的类
   * @param props: 关系的属性
   * @param multiple: 是否为一对多
   * @param comment: 关系描述
   */

  return request({
    url: '/rpcgateway/RelationshipService/create',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      name: name,
      argument: argument,
      props: props,
      multiple: multiple,
      comment: comment
    },
    headers: { signature: true }
  })
}

export function relationship_edit(
  repo_name,
  cls_name,
  old_name,
  name,
  argument,
  props,
  multiple,
  comment
) {
  /**
   * @method relationship_edit
   * @param relationship_id: 关系ID
   * @param name: 关系名
   * @param argument: 被映射的类
   * @param props: 关系的属性
   * @param multiple: 是否为一对多
   * @param comment: 关系描述
   */

  return request({
    url: '/rpcgateway/RelationshipService/update_by_name',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      old_name: old_name,
      name: name,
      argument: argument,
      props: props,
      multiple: multiple,
      comment: comment
    },
    headers: { signature: true }
  })
}

export function relationship_delete(repo_name, cls_name, names) {
  /**
   * @method relationship_delete
   * @param relationship_id: 关系ID
   */

  return request({
    url: '/rpcgateway/RelationshipService/remove_by_name',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      names: names
    },
    headers: { signature: true }
  })
}

export function relationship_list(repo_name, cls_name, text, page_index, page_size, page) {
  /**
   * @method relationship_list
   */
  return request({
    url: '/rpcgateway/RelationshipService/relationships',
    method: 'get',
    params: {
      repo_name: repo_name,
      cls_name: cls_name,
      text: text,
      page_index: page_index,
      page_size: page_size,
      page: page
    }
  })
}

export function relationship_info(repo_name, cls_name, name) {
  /**
   * @method relationship_info
   * @param relationship_id: 关系ID
   */
  return request({
    url: '/rpcgateway/RelationshipService/get_relationship_by_name',
    method: 'get',
    params: {
      repo_name: repo_name,
      cls_name: cls_name,
      name: name
    }
  })
}

export function class_download(repo_name, cls_names, is_view) {
  /**
   * @method project_info
   * @param project_id: 项目ID
   */
  return request({
    url: '/rpcgateway/ClassService/downloads',
    method: 'get',
    params: {
      repo_name: repo_name,
      cls_names: cls_names,
      is_view: is_view
    }
  })
}

export function class_upload(repo_name, data) {
  return request({
    url: '/rpcgateway/ClassService/upload_classs',
    method: 'post',
    data: {
      repo_name: repo_name,
      datas: data
    }
    // headers: { 'Content-Length': 1000 }
  })
}

export function select_edit(repo_name, cls_name, view_select) {
/**
 * @method column_info
 * @param column_id: 栏目ID
 */
  return request({
    url: '/rpcgateway/ClassService/update_view_select_by_name',
    method: 'post',
    data: {
      repo_name: repo_name,
      cls_name: cls_name,
      view_select: view_select
    },
    headers: { signature: true }
  })
}
