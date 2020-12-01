import request from '@/library/js/request'

export function getAppConfigApi(device) {
  /**
   * @method getAppConfigApi
   */
  return request({
    url: '/rpcgateway/sysControlService/app_configs',
    method: 'get',
    params: {
      device: device
    }
  })
}

export function switches(page, page_index, page_size) {
  return request({
    url: '/rpcgateway/sysControlService/switches',
    method: 'get',
    params: {
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function vlans(page, page_index, page_size) {
  return request({
    url: '/rpcgateway/sysControlService/vlans',
    method: 'get',
    params: {
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function switch_vlans(switch_id, page, page_index, page_size) {
  return request({
    url: '/rpcgateway/sysControlService/switch_vlans',
    method: 'get',
    params: {
      switch_id: switch_id,
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function vlan_switches(vlan_name, page, page_index, page_size) {
  return request({
    url: '/rpcgateway/sysControlService/vlan_switches',
    method: 'get',
    params: {
      vlan_name: vlan_name,
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function SysParams(text, page, page_index, page_size) {
  /**
   * @method SysParams
   */
  return request({
    url: '/rpcgateway/sysControlService/SysParams',
    method: 'get',
    params: {
      text: text,
      page: page,
      page_index: page_index,
      page_size: page_size
    }
  })
}

export function ParamInfo(param_id) {
  /**
   * 获取用户信息
   * @method ParamInfo
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/sysControlService/ParamInfo',
    method: 'get',
    params: { param_id: param_id }
  })
}

export function ParamInfoByKey(sys_key) {
  /**
   * 获取用户信息
   * @method ParamInfo
   * @return {axios} axios请求实例
   */
  return request({
    url: '/rpcgateway/sysControlService/ParamInfoByKey',
    method: 'get',
    params: { sys_key: sys_key }
  })
}

export function ParamUpdate(param_id, sys_value) {
  /**
   * 更新用户资料
   * @method ParamUpdate
   */
  var params = {
    param_id: param_id,
    sys_value: sys_value
  }
  return request({
    url: '/rpcgateway/sysControlService/ParamUpdate',
    method: 'post',
    data: params
  })
}
