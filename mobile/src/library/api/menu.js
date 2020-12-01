/**
 * menu相关http接口
 * @module menu.js
 */
import request from '@/library/js/request'

export function menu_create(label, menu_code, uri, icon, number, parent_code, device) {
  /**
   * @method menu_create
   * @param label:菜单显示名称
   * @param menu_code:菜单编码
   * @param uri:菜单指向地址
   * @param icon:菜单图标
   * @param number:菜单同级序号
   * @param parent_code:父菜单编码
   */
  return request({
    url: '/rpcgateway/MenuService/menu_create',
    method: 'post',
    data: {
      label: label,
      menu_code: menu_code,
      uri: uri,
      icon: icon,
      number: number,
      parent_code: parent_code,
      device: device
    },
    headers: { signature: true }
  })
}

export function menu_all_tree(device) {
  /**
   * @method menu_all_tree
   */
  return request({
    url: '/rpcgateway/MenuService/menu_all_tree',
    method: 'get',
    params: {
      device: device
    }
  })
}

// export function menu_all_list() {
//   /**
//    * @method menu_all_list
//    */
//   return request({
//     url: '/rpcgateway/MenuService/api/resource/menu/all/list',
//     method: 'get',
//     params: {}
//   })
// }

export function access_menus(top_menu_code, device) {
  /**
   * @method access_menus
   */
  return request({
    url: '/rpcgateway/MenuService/access_menus',
    method: 'get',
    params: { top_menu_code: top_menu_code, device: device }
  })
}
export function access_menus_list(top_menu_code, device) {
  /**
   * @method access_menus_list
   */
  return request({
    url: '/rpcgateway/MenuService/access_menus_list',
    method: 'get',
    params: { top_menu_code: top_menu_code, device: device }
  })
}
export function access_menu_ids(role_code, top_menu_code, device) {
  /**
   * @method access_menus
   */
  return request({
    url: '/rpcgateway/MenuService/access_menu_ids',
    method: 'get',
    params: { top_menu_code: top_menu_code, role_code: role_code, device: device }
  })
}
export function add_role_by_menu_ids(role_code, menu_ids, device) {
  /**
   */
  return request({
    url: '/rpcgateway/MenuService/role_menu_ids',
    method: 'post',
    data: {
      role_code: role_code,
      menu_ids: menu_ids,
      device: device
    }
  })
}

export function menu_info(menu_code) {
  /**
   * @method menu_info
   */
  return request({
    url: '/rpcgateway/MenuService/get_menu_by_code',
    method: 'get',
    params: { menu_code: menu_code }
  })
}

export function menu_updata(menu_id, label, uri, number, icon) {
  /**
   * @method menu_updata
   * @param res_id: 菜单ID
   * @param text:菜单显示名称
   * @param url:菜单指向地址
   * @param icon:菜单图标
   * @param number:菜单同级序号
   */
  return request({
    url: '/rpcgateway/MenuService/update_menu_by_id',
    method: 'post',
    data: {
      label: label,
      uri: uri,
      icon: icon,
      number: number,
      menu_id: menu_id
    },
    headers: { signature: true }
  })
}

export function menu_remove(menu_id) {
  /**
   * @method menu_remove
   * @param res_id: 菜单ID
   */
  return request({
    url: '/rpcgateway/MenuService/remove_menu_by_id',
    method: 'post',
    data: {
      menu_id: menu_id
    },
    headers: { signature: true }
  })
}

export function menu_list(parent_code, text, page, page_index, page_size, device) {
  /**
   * 获取一组菜单列表
   * @method menu_list
   * @params parent_id: 父菜单ID
   * @params text:搜索文本
   * @params page:分页开关
   * @params page_index:页数
   * @params page_size:每页数量
   */
  return request({
    url: '/rpcgateway/MenuService/menus',
    method: 'get',
    params: {
      parent_code: parent_code,
      text: text,
      page: page,
      page_index: page_index,
      page_size: page_size,
      device: device
    }
  })
}

export function menu_assignments(menu_code, role_code) {
  /**
   * @method menu_assignments
   */
  return request({
    url: '/rpcgateway/MenuService/add_role',
    method: 'post',
    data: {
      menu_code: menu_code,
      role_code: role_code
    },
    headers: { signature: true }
  })
}

export function remove_assignments(menu_code, role_code) {
  /**
   * @method remove_assignments
   */
  return request({
    url: '/rpcgateway/MenuService/remove_role',
    method: 'post',
    data: {
      menu_code: menu_code,
      role_code: role_code
    },
    headers: { signature: true }
  })
}

export function assignments(menu_code) {
  /**
   * @method assignments
   */
  return request({
    url: '/rpcgateway/MenuService/roles',
    method: 'post',
    data: {
      menu_code: menu_code
    },
    headers: { signature: true }
  })
}
