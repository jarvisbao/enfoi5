/**
 * 适配手机端菜单相关接口
 * @module mobile.js
 */
import request from '@/library/js/request'

export function menu_add_edit(name, code, icon, url, order, description, parent_code, external, menu_id) {
  /**
   * 菜单新建/修改
   * @param name 菜单名称
   * @param code 菜单代码
   * @param icon 菜单图标
   * @param url 菜单的URL
   * @param order 菜单在同级的排序
   * @param description 描述
   * @param parent_code 父ID
   * @param external 是否为外部链接
   * @param menu_id 菜单ID，为空表示新建
   */
  return request({
    url: '/rpcgateway/MobileService/edit_menu',
    method: 'post',
    data: {
      name: name,
      code: code,
      icon: icon,
      url: url,
      order: order,
      description: description,
      parent_code: parent_code,
      external: external,
      menu_id: menu_id
    }
  })
}

export function menu_delete(menu_id) {
  /**
   * 菜单删除
   * @param menu_id 菜单ID
   */
  return request({
    url: '/rpcgateway/MobileService/del_menu',
    method: 'post',
    data: {
      menu_id: menu_id
    }
  })
}

export function menu_list(code) {
  /**
   * 菜单列表
   * @param code
   */
  return request({
    url: '/rpcgateway/MobileService/list_menu',
    method: 'get',
    params: {
      code: code
    }
  })
}

export function menu_view(menu_id) {
  /**
   * 菜单信息
   * @param menu_id 菜单ID
   */
  return request({
    url: '/rpcgateway/MobileService/view_menu',
    method: 'get',
    params: {
      menu_id: menu_id
    }
  })
}
