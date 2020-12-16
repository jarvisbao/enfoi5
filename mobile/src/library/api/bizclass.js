/**
 * 业务类相关http接口
 * @module bizclass.js
 */
import request from '@/library/js/request'

export function bizclass_create(proj_code, biz_code, biz_name, legoclass_id) {
  /**
   * @method bizclass_create
   * @param proj_id: 项目ID
   * @param biz_code: 业务对象代码，项目内必须唯一
   * @param biz_name: 业务对象名称
   * @param legoclass_id: 指向数据表的ID
   */
  return request({
    url: '/rpcgateway/LegoBizClassService/create',
    method: 'post',
    data: {
      proj_code: proj_code,
      biz_code: biz_code,
      biz_name: biz_name,
      legoclass_id: legoclass_id
    },
    headers: { signature: true }
  })
}

export function bizclass_edit(
  // biz_code,
  biz_name,
  legoclass_id,
  biz_id,
  proj_code
) {
  /**
   * @method bizclass_edit
   * @param proj_id: 项目ID
   * @param biz_code: 业务对象代码，项目内必须唯一
   * @param biz_name: 业务对象名称
   * @param legoclass_id: 指向数据表的ID
   * @param biz_id: 业务类ID
   */
  return request({
    url: '/rpcgateway/LegoBizClassService/update_by_id',
    method: 'post',
    data: {
      biz_id: biz_id,
      // biz_code: biz_code,
      biz_name: biz_name,
      legoclass_id: legoclass_id,
      proj_code: proj_code
    },
    headers: { signature: true }
  })
}

export function bizclass_delete(biz_id, proj_code) {
  /**
   * @method bizclass_delete
   * @param biz_id: 业务类ID
   */
  return request({
    url: '/rpcgateway/LegoBizClassService/delete_bizclass',
    method: 'post',
    data: {
      biz_ids: biz_id,
      proj_code: proj_code
    },
    headers: { signature: true }
  })
}

export function bizclass_list(proj_code, text, page_index, page_size, page) {
  /**
   * @method bizclass_list
   */
  return request({
    url: '/rpcgateway/LegoBizClassService/list_bizclass',
    method: 'get',
    params: {
      proj_code: proj_code,
      text: text,
      page_index: page_index,
      page_size: page_size,
      page: page
    }
  })
}

export function bizclass_info(biz_id) {
  /**
   * @method bizclass_info
   * @param biz_id: 业务类ID
   */
  return request({
    url: '/rpcgateway/LegoBizClassService/find_bizclass_by_id',
    method: 'get',
    params: {
      biz_id: biz_id
    }
  })
}

export function find_bizclass_by_code(proj_code, biz_code) {
  /**
   * @method bizclass_info
   * @param biz_id: 业务类ID
   */
  return request({
    url: '/rpcgateway/LegoBizClassService/find_bizclass_by_code',
    method: 'get',
    params: {
      proj_code: proj_code,
      biz_code: biz_code
    }
  })
}

export function bizfield_create(
  proj_code,
  biz_code,
  field_code,
  field_name,
  field_format,
  field_is_object,
  object_id,
  can_query
) {
  /**
   * @method bizfield_create
   * @param biz_id: 业务对象ID
   * @param field_code: 字段代码
   * @param field_name: 字段显示名称
   * @param field_format: 字段取值格式
   * @param field_is_object: 字段是否为关联对象
   * @param enable_record: 是否启用对象变动记录
   * @param can_query: 是否参与查询
   */
  return request({
    url: '/rpcgateway/LegoBizFieldService/create_by_code',
    method: 'post',
    data: {
      proj_code: proj_code,
      biz_code: biz_code,
      field_code: field_code,
      field_name: field_name,
      field_format: field_format,
      field_is_object: field_is_object,
      object_id: object_id,
      can_query: can_query
    },
    headers: { signature: true }
  })
}

export function bizfield_edit(
  field_id,
  field_code,
  field_name,
  field_format,
  field_is_object,
  object_id,
  can_query,
  proj_code
) {
  /**
   * @method bizfield_edit
   * @param field_id: 业务字段ID
   * @param field_code: 字段代码
   * @param field_name: 字段显示名称
   * @param field_format: 字段取值格式
   * @param field_is_object: 字段是否为关联对象
   * @param enable_record: 是否启用对象变动记录
   * @param can_query: 是否参与查询
   */
  return request({
    url: '/rpcgateway/LegoBizFieldService/update_by_id',
    method: 'post',
    data: {
      field_id: field_id,
      field_code: field_code,
      field_name: field_name,
      field_format: field_format,
      field_is_object: field_is_object,
      object_id: object_id,
      can_query: can_query,
      proj_code: proj_code
    },
    headers: { signature: true }
  })
}

export function bizfield_delete(field_id, proj_code) {
  /**
   * @method bizfield_delete
   * @param field_id: 业务字段ID
   */
  return request({
    url: '/rpcgateway/LegoBizFieldService/delete_bizfield',
    method: 'post',
    data: {
      field_ids: field_id,
      proj_code: proj_code
    },
    headers: { signature: true }
  })
}

export function bizfield_list(proj_code, biz_code, text, page_index, page_size, page) {
  /**
   * @method bizfield_list
   */
  return request({
    url: '/rpcgateway/LegoBizFieldService/list_bizfield',
    method: 'get',
    params: {
      proj_code: proj_code,
      biz_code: biz_code,
      text: text,
      page_index: page_index,
      page_size: page_size,
      page: page
    }
  })
}

export function bizfield_info(field_id, proj_code) {
  /**
   * @method bizfield_list
   */
  return request({
    url: '/rpcgateway/LegoBizFieldService/info_bizfield',
    method: 'get',
    params: {
      field_id: field_id,
      proj_code: proj_code
    }
  })
}

export function biz_field_format(proj_code, biz_code) {
  /**
   * @method bizfield_list
   */
  return request({
    url: '/rpcgateway/LegoBizFieldService/field_format_list',
    method: 'get',
    params: {
      proj_code: proj_code,
      biz_code: biz_code
    }
  })
}

export function bizclass_download(proj_code, biz_ids) {
  /**
   * @method project_info
   * @param project_id: 项目ID
   */
  return request({
    url: '/rpcgateway/LegoBizClassService/downloads',
    method: 'get',
    params: {
      proj_code: proj_code,
      biz_ids: biz_ids
    }
  })
}

export function bizclass_upload(proj_code, data) {
  return request({
    url: '/rpcgateway/LegoBizClassService/upload',
    method: 'post',
    data: {
      proj_code: proj_code,
      datas: data
    }
  })
}
