
import * as auth from './auth'
import Constlib from './constlib'
import * as cryptor from './cryptor'
import { EventBus } from './event-bus'
import * as hashlib from './hashlib'
import * as image from './image'
import localstore from '@/library/js/localstore'
import checkPermission from './permission'
import request from './request'
import * as validate from './validate'
import * as util from './util'
import router_permission from './permission'

const _exports = {
  auth,
  Constlib,
  cryptor,
  EventBus,
  validate,
  hashlib,
  image,
  localstore,
  checkPermission,
  request,
  util,
  router_permission
}

export default _exports
