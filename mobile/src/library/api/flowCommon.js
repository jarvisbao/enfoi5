/**
 * 流程公共相关http接口
 * @module common.js
 */
import request from '@/library/js/request'

export function list_user(text, page, page_index, page_size) {
  /**
   * 用户列表
   * @method user_list
   * @param text 检索的文本
   * @param page 是否开启分页
   * @param page_index 分页索引
   * @param page_size 分页大小
   */
  return request({
    url: '/rpcgateway/CommonService/user_list',
    method: 'get',
    params: {
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function list_role(text, page, page_index, page_size) {
  /**
   * 角色列表
   * @method user_list
   * @param text 检索的文本
   * @param page 是否开启分页
   * @param page_index 分页索引
   * @param page_size 分页大小
   */
  return request({
    url: '/rpcgateway/CommonService/role_list',
    method: 'get',
    params: {
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function list_group(text, page, page_index, page_size) {
  /**
   * 小组列表
   * @method group_list
   * @param text 检索的文本
   * @param page 是否开启分页
   * @param page_index 分页索引
   * @param page_size 分页大小
   */
  return request({
    url: '/rpcgateway/CommonService/group_list',
    method: 'get',
    params: {
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function list_org(text, page, page_index, page_size) {
  /**
   * 小组列表
   * @method group_list
   * @param text 检索的文本
   * @param page 是否开启分页
   * @param page_index 分页索引
   * @param page_size 分页大小
   */
  return request({
    url: '/rpcgateway/CommonService/org_list',
    method: 'get',
    params: {
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function list_route() {
  /**
   * 获取路由列表
   */
  return request({
    url: '/rpcgateway/CommonService/route_list',
    method: 'get',
    params: {}
  })
}
