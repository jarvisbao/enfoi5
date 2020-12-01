/**
 * 业务数据相关http接口
 * @module bizdata.js
 */
import request from '@/library/js/request'

export function bizdata_create(proj_code, biz_code, fields) {
  /**
   * @method bizdata_create
   * @param biz_id: 业务对象ID
   */
  return request({
    url: '/rpcgateway/BizdataService/insert',
    method: 'post',
    data: {
      proj_code: proj_code,
      biz_code: biz_code,
      fields: fields
    }
  })
}

export function bizdata_update(
  proj_code,
  biz_code,
  filters,
  fields
) {
  /**
   * @method bizdata_update
   * @param filters: 数据过滤条件
   * @param biz_id: 业务对象ID
   */
  return request({
    url: '/rpcgateway/BizdataService/update',
    method: 'post',
    data: {
      proj_code: proj_code,
      biz_code: biz_code,
      filters: filters,
      fields: fields
    }
  })
}

export function bizdata_delete(proj_code, biz_code, filters) {
  /**
   * @method bizdata_delete
   * @param filters: 数据过滤条件
   * @param biz_id: 业务对象ID
   */
  return request({
    url: '/rpcgateway/BizdataService/delete',
    method: 'post',
    data: {
      proj_code: proj_code,
      biz_code: biz_code,
      filters: filters
    }
  })
}

export function bizdata_list(proj_code, biz_code, text, page_index, page_size, page, convert) {
  /**
   * @method bizdata_list
   * @param biz_id: 业务对象ID
   */
  return request({
    url: '/rpcgateway/BizdataService/lists',
    method: 'get',
    params: {
      proj_code: proj_code,
      biz_code: biz_code,
      page_index: page_index,
      page_size: page_size,
      page: page,
      text: text,
      convert: convert
    }
  })
}

export function bizdata_get_headers(proj_code, biz_code) {
  /**
   * @method bizdata_get_headers
   * @param biz_id: 业务对象ID
   */
  return request({
    url: '/rpcgateway/BizdataService/get_headers',
    method: 'get',
    params: {
      proj_code: proj_code,
      biz_code: biz_code
    }
  })
}

export function bizdata_info(proj_code, biz_code, filters) {
  /**
   * @method bizdata_info
   * @param biz_id: 业务对象ID
   */
  return request({
    url: '/rpcgateway/BizdataService/info',
    method: 'get',
    params: {
      proj_code: proj_code,
      biz_code: biz_code,
      filters: filters
    }
  })
}
