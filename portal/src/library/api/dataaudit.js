/**
 * 数据审核
 * @module dataaudit
 */
import request from '@/library/js/request'

export function tabel_data(task_id) {
  /**
   * @method tabel_data
   * @param task_id: 审核错误信息表id
   */
  return request({
    url: '/rpcgateway/DAError/task_list',
    method: 'get',
    params: {
      task_id
    }
  })
}

export function data_detail(error_id) {
  /**
   * @method data_detail
   * @param error_id: 错误id
   */
  return request({
    url: '/rpcgateway/DAError/info',
    method: 'get',
    params: {
      error_id
    }
  })
}

