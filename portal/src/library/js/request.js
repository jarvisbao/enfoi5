import axios from 'axios'
// import { get_client_cryptor, JSON_stringify } from '@/library/js/cryptor'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'
import { connect } from '@/library/api/security'
import Constlib from '@/library/js/constlib'
// 创建axios实例
const service = axios.create({
  // timeout: 5000, // 请求的超时时间
  withCredentials: true // 允许携带cookie
})

// request拦截器
service.interceptors.request.use(
  config => {
    const qs = require('qs')

    if (config.method === 'get') {
      // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    // if (config.headers['signature']) {
    //   var data = Object.keys(config.data).sort().reduce((acc, key) => {
    //     acc[key] = config.data[key]
    //     return acc
    //   }, {})
    //   config.headers['signature'] = get_client_cryptor().sign(JSON_stringify(data))
    // }
    return config
  },
  error => {
    // Do something with request error
    // console.log(error) // for debug
    Message.error(error.message || 'Server error, please contact administrator')
    // Promise.reject(error)
    return Promise.reject(error)
  }
)

// 拦截响应response，并做一些错误处理
service.interceptors.response.use(
  response => {
    if (
      response.data.code === Constlib.ERROR_CODE_CRYPTOR_NOI_FOUND ||
      response.data.code === Constlib.ERROR_CODE_CRYPTOR_EXIST
    ) {
      store.dispatch('FedLogOut').then(() => {
        // location.reload() // 为了重新实例化vue-router对象 避免bug
        // 需要初始化生成客户端的公私钥匙。
        connect()
        MessageBox.alert('验证失败，请刷新验证码重新登录', '提示', {
          confirmButtonText: '确定'
        })
      })
      Message.error(
        response.data.message || '验证失败，请重新登录'
      )
      return Promise.reject('error')
    } else {
      if (response.data.code !== Constlib.ERROR_CODE_OK && response.data.code !== undefined) {
        Message.error(response.data.message || '500 error')
      }
      return response.data
    }
  },
  error => {
    // Do something with request error
    // console.log(error.response)
    let message = 'Server error, please contact administrator'

    if (error.response && error.response.data && Object.prototype.toString.call(error.response.data) && 'message' in error.response.data) {
      message = error.response.data.message
    } else {
      message = error.message
    }
    Message.error(message)
    // store.commit('SET_LOADING', false) // 取消按钮loading 状态  删除
    // Promise.reject(error)
    return Promise.reject(error)
  }
)

export default service
