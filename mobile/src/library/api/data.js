/**
 * 生成数据
 * @module data.js
 */
import request from '@/library/js/request'

export function data_list(
  repo_name,
  cls_name,
  text,
  page_index,
  page_size,
  page,
  convert
) {
  /**
   * @method data_list
   * @param repo_id: 仓库ID
   * @param class_id: 类ID
   */
  return request({
    url: '/rpcgateway/OrmService/lists',
    method: 'get',
    params: {
      repo_name: repo_name,
      cls_name: cls_name,
      page_index: page_index,
      page_size: page_size,
      page: page,
      text: text,
      convert: convert
    }
  })
}

export function get_headers(repo_name, cls_name) {
  /**
   * @method get_headers
   * @param repo_id: 仓库ID
   * @param class_id: 类ID
   */
  return request({
    url: '/rpcgateway/OrmService/get_headers',
    method: 'get',
    params: {
      repo_name: repo_name,
      cls_name: cls_name
    }
  })
}

export function create_data(data) {
  /**
   * @method get_headers
   * @param repo_id: 仓库ID
   * @param class_id: 类ID
   */
  return request({
    url: '/rpcgateway/OrmService/insert',
    method: 'post',
    data: data
  })
}

export function update_data(data) {
  /**
   * @method update_data
   * @param repo_id: 仓库ID
   * @param class_id: 类ID
   */
  return request({
    url: '/rpcgateway/OrmService/update',
    method: 'post',
    data: data
  })
}

export function delete_data(data) {
  /**
   * @method delete_data
   * @param repo_id: 仓库ID
   * @param class_id: 类ID
   */
  return request({
    url: '/rpcgateway/OrmService/delete',
    method: 'post',
    data: data
  })
}

export function data_info(repo_id, class_id, filters, _id) {
  /**
   * @method data_info
   * @param repo_id: 仓库ID
   * @param class_id: 类ID
   */
  return request({
    url: '/rpcgateway/OrmService/info',
    method: 'get',
    params: {
      repo_id: repo_id,
      class_id: class_id,
      filters: filters,
      _id: _id
    }
  })
}
