/**
 * 仓库相关http接口
 * @module repository.js
 */
import request from '@/library/js/request'
import { get_server_cryptor } from '@/library/js/cryptor'

export function repository_create(db_uri, name, options, validation) {
  /**
   * @method repository_create
   * @param db_uri: 仓库连接的URI
   * @param name: 仓库名称
   * @param options: 连接参数
   * @param validation 验证参数
   */
  var cryptor = get_server_cryptor()

  db_uri = cryptor.encrypt(db_uri)
  validation = validation ? cryptor.encrypt(validation) : validation
  return request({
    url: '/rpcgateway/RepositoryService/create',
    method: 'post',
    data: {
      name: name,
      dburi: db_uri,
      options: options,
      validation
    },
    headers: { signature: true }
  })
}

export function repository_edit(name, db_uri, new_name, options, validation) {
  /**
   * @method repository_edit
   * @param repo_id 被修改的仓库id
   * @param db_uri: 仓库连接的URI
   * @param name: 仓库名称
   * @param options: 连接参数
   * @param validation 验证参数
   */
  var cryptor = get_server_cryptor()

  db_uri = cryptor.encrypt(db_uri)
  validation = validation ? cryptor.encrypt(validation) : validation
  return request({
    url: '/rpcgateway/RepositoryService/update_by_name',
    method: 'post',
    data: {
      name: name,
      new_name: new_name,
      dburi: db_uri,
      options: options,
      validation
    },
    headers: { signature: true }
  })
}

export function repository_delete(name) {
  /**
   * @method repository_delete
   * @param repo_id 仓库ID
   */

  return request({
    url: '/rpcgateway/RepositoryService/remove_by_name',
    method: 'post',
    data: {
      name: name
    },
    headers: { signature: true }
  })
}

export function repository_list(text, page_index, page_size, page) {
  /**
   * @method repository_list
   */
  return request({
    url: '/rpcgateway/RepositoryService/repos',
    method: 'get',
    params: {
      text: text,
      page_index: page_index,
      page_size: page_size,
      page: page
    }
  })
}

export function repository_info(name) {
  /**
   * @method repository_info
   * @param repo_id: 数据仓库ID
   */
  return request({
    url: '/rpcgateway/RepositoryService/get_repo_by_name',
    method: 'get',
    params: {
      name: name
    }
  })
}

export function repository_test(repo_id) {
  /**
   * @method repository_test
   * @param repo_id: 数据仓库ID
   */
  return request({
    url: '/rpcgateway/RepositoryService/tests',
    method: 'get',
    params: {
      repo_id: repo_id
    }
  })
}

export function repository_reflect(name) {
  /**
   * @method repository_reflect
   * @param repo_id: 数据仓库ID
   */
  return request({
    url: '/rpcgateway/RepositoryService/reflect',
    method: 'post',
    data: {
      name: name
    },
    headers: { signature: true }
  })
}

export function repository_map(name) {
  /**
   * @method repository_map
   * @param repo_id: 数据仓库ID
   */
  return request({
    url: '/rpcgateway/RepositoryService/map',
    method: 'post',
    data: {
      name: name
    },
    headers: { signature: true }
  })
}

export function create_orm(repos) {
  /**
   * @method create_orm
   * @param repos: 生成orm的仓库列表
   */
  return request({
    url: '/rpcgateway/OrmService/create',
    method: 'post',
    data: {
      repos: repos
    },
    headers: { signature: true }
  })
}

export function repository_download(repository_ids) {
  /**
   * @method project_info
   * @param project_id: 项目ID
   */
  return request({
    url: '/rpcgateway/RepositoryService/downloads',
    method: 'get',
    params: {
      repository_ids: repository_ids
    }
  })
}

export function repository_upload(data) {
  return request({
    url: '/rpcgateway/RepositoryService/upload_repos',
    method: 'post',
    data: {
      datas: data
    }
  })
}

export function get_auto_orm() {
  return request({
    url: '/rpcgateway/OrmService/get_orm_auto',
    method: 'get',
    params: {}
  })
}

export function set_auto_orm(auto) {
  return request({
    url: '/rpcgateway/OrmService/set_orm_auto',
    method: 'post',
    data: {
      auto: auto
    }
  })
}
