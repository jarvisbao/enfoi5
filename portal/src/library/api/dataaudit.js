/**
 * 生成数据
 * @module data
 */
import request from '@/library/js/request'

export function tabel_data(
  task_id
) {
  /**
   * @method data_list
   * @param repo_id: 仓库ID
   * @param class_id: 类ID
   */
  return request({
    url: 'http://192.168.100.243:8000/rpcgateway/DAError/task_list',
    // url: 'http://localhost:3000/rpcgateway/DAError/task_list',
    method: 'get',
    params: {
      task_id
    }
  })
}

export function data_detail(error_id) {
  /**
   * @method get_headers
   * @param repo_id: 仓库ID
   * @param class_id: 类ID
   */
  return request({
    url: 'http://192.168.100.243:8000/rpcgateway/DAError/info',
    // url: 'http://localhost:3000/rpcgateway/DAError/info',
    method: 'get',
    params: {
      error_id
    }
  })
}

