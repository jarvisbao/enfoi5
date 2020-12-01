import Constlib from '@/library/js/constlib'

export default function checkPermission(value) {
  const action_uri = value
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/rpcgateway/ResourceService/check_action', false)
  xhr.setRequestHeader('Content-Type', 'application/json')
  var sendData = { 'action_uri': action_uri }
  // 将用户输入值序列化成字符串
  xhr.send(JSON.stringify(sendData))
  var response = JSON.parse(xhr.response)
  if (response.code === Constlib.ERROR_CODE_OK) {
    if (['True', 'true', true].includes(response.payload)) {
      return true
    } else {
      return false
    }
  }
}
