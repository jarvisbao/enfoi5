/**
 * 主页管理相关http接口
 * @module widget.js
 */
import request from '@/library/js/request'

export function widget_create(openid, wdgt_title, wdgt_color, wdgt_icon, wdgt_type, app_code, content_url, content_prop, content_config, more_url, wdgt_summary, mob_content_url) {
  /**
   * 新建widget
   * @method widget_create
   * @param openid 用户ID
   * @param wdgt_title 标题
   * @param wdgt_color 标题栏颜色
   * @param wdgt_icon 标题栏图标
   * @param wdgt_type 类型
   * @param app_code 针对模块 前台暂时不显示
   * @param content_url 内容url地址
   * @param content_prop 使用JSON域
   * @param content_config 类型具体参数
   * @param more_url 更多url
   * @param wdgt_summary 描述，摘要
   * @param mob_content_url 适配APP内容url
   */
  return request({
    url: '/rpcgateway/WidgetService/create_widget',
    method: 'post',
    data: {
      'openid': openid,
      'wdgt_title': wdgt_title,
      'wdgt_color': wdgt_color,
      'wdgt_icon': wdgt_icon,
      'wdgt_type': wdgt_type,
      'app_code': app_code,
      'content_url': content_url,
      'content_prop': content_prop,
      'content_config': content_config,
      'more_url': more_url,
      'wdgt_summary': wdgt_summary,
      'mob_content_url': mob_content_url
    }
  })
}

export function widget_edit(wdgt_id, openid, wdgt_title, wdgt_color, wdgt_icon, wdgt_type, app_code, content_url, content_prop, content_config, more_url, wdgt_summary, mob_content_url) {
  /**
   * 修改widget
   * @method widget_edit
   * @param wdgt_id widget ID
   */
  return request({
    url: '/rpcgateway/WidgetService/edit_widget',
    method: 'post',
    data: {
      'wdgt_id': wdgt_id,
      'openid': openid,
      'wdgt_title': wdgt_title,
      'wdgt_color': wdgt_color,
      'wdgt_icon': wdgt_icon,
      'wdgt_type': wdgt_type,
      'app_code': app_code,
      'content_url': content_url,
      'content_prop': content_prop,
      'content_config': content_config,
      'more_url': more_url,
      'wdgt_summary': wdgt_summary,
      'mob_content_url': mob_content_url
    }
  })
}

export function widget_remove(wdgt_id) {
  /**
   * 删除widget
   * @method widget_remove
   * @param wdgt_id widget ID
   */
  return request({
    url: '/rpcgateway/WidgetService/remove_widget',
    method: 'post',
    data: {
      'wdgt_id': wdgt_id
    }
  })
}

export function widget_list(text, page, page_index, page_size) {
  /**
   * 获取widget列表
   * @method widget_list
   */
  return request({
    url: '/rpcgateway/WidgetService/lists',
    method: 'get',
    params: {
      'text': text,
      'page': page,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function widget_info(wdgt_id) {
  /**
   * 获取widget信息
   * @method widget_info
   * @param wdgt_id widget ID
   */
  return request({
    url: '/rpcgateway/WidgetService/get_widget',
    method: 'get',
    params: { 'wdgt_id': wdgt_id }
  })
}

export function set_menuaccess(menuid) {
  /**
   * 获取widget信息
   * @method widget_info
   * @param wdgt_id widget ID
   */
  return request({
    url: '/rpcgateway/WidgetService/set_user_menuaccess',
    method: 'post',
    data: { 'menuid': menuid }
  })
}

export function get_menuaccess(openid) {
  /**
   * 获取widget信息
   * @method widget_info
   * @param wdgt_id widget ID
   */
  return request({
    url: '/rpcgateway/WidgetService/get_user_menuaccess',
    method: 'get',
    params: { 'openid': openid }
  })
}
