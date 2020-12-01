/**
 * 项目业务相关http接口
 * @module project.js
 */
import request from '@/library/js/request'

export function project_create(proj_code, proj_name, props) {
  /**
   * @method project_create
   * @param proj_code: 项目代码
   * @param proj_name: 项目名称
   * @param props: 项目的属性
   */
  return request({
    url: '/rpcgateway/ProjectService/create',
    method: 'post',
    data: {
      'proj_code': proj_code,
      'proj_name': proj_name,
      'props': props
    },
    headers: { signature: true }
  })
}

export function project_edit(proj_code, new_proj_code, proj_name, props) {
  /**
   * @method project_edit
   * @param proj_code: 项目代码
   * @param proj_name: 项目名称
   * @param project_id: 项目ID
   * @param props: 项目的属性
   */
  return request({
    url: '/rpcgateway/ProjectService/update_by_code',
    method: 'post',
    data: {
      'proj_code': proj_code,
      'new_proj_code': new_proj_code,
      'proj_name': proj_name,
      'props': props
    },
    headers: { signature: true }
  })
}

export function project_delete(proj_code) {
  /**
   * @method project_delete
   * @param project_id: 项目ID
   */
  return request({
    url: '/rpcgateway/ProjectService/delete_by_code',
    method: 'post',
    data: {
      'proj_code': proj_code
    },
    headers: { signature: true }
  })
}

export function project_list(text, page_index, page_size, page) {
  /**
   * @method project_list
   */
  return request({
    url: '/rpcgateway/ProjectService/list_project',
    method: 'get',
    params: {
      'text': text,
      'page_index': page_index,
      'page_size': page_size,
      'page': page
    }
  })
}

export function project_info(proj_code) {
  /**
   * @method project_info
   * @param project_id: 项目ID
   */
  return request({
    url: '/rpcgateway/ProjectService/get_project_by_code',
    method: 'get',
    params: {
      'proj_code': proj_code
    }
  })
}

export function project_download(project_ids) {
  /**
   * @method project_info
   * @param project_id: 项目ID
   */
  return request({
    url: '/rpcgateway/ProjectService/downloads',
    method: 'get',
    params: {
      'proj_ids': project_ids
    }
  })
}

export function project_upload(data) {
  return request({
    url: '/rpcgateway/ProjectService/upload',
    method: 'post',
    data: {
      datas: data
    }
  })
}
