<template>
  <div class="other-methods">
    <template v-for="(item, index) in newOtherMethods">
      <el-button :key="index" round size="small">
        <span v-if="item.operate_type===1" id="plcl" @click="clickType1(item)">{{ item.operate_name }}</span>
        <span v-if="item.operate_type===2" id="plxg" @click="clickType2(item)">{{ item.operate_name }}</span>
        <span v-if="item.operate_type===6" id="plPost" @click="clickType6(item)">{{ item.operate_name }}</span>
        <span v-if="item.operate_type===7" id="plGet" @click="clickType7(item)">{{ item.operate_name }}</span>
        <span v-if="item.operate_type===8" id="clsCreate" @click="clickType8(item)">{{ item.operate_name }}</span>
      </el-button>
    </template>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <method-batch-edit
        :batch-data="batchData"
        :ids="ids"
        :is-all="isAll"
        :object_id="object_id"
        @show="isShow"
        @refresh="refresh"
      />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'otherMethods',
  props: {
    add_script: {
      type: Function,
      default: null
    },
    set_session: {
      type: Function,
      default: null
    },
    object_id: {
      type: String,
      default: null
    },
    page_id: {
      type: String,
      default: null
    },
    pntfk: {
      type: String,
      default: null
    },
    pntid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      headers_all: [],
      newOtherMethods: [],
      batchData: [],
      selectionData: [],
      ids: [],
      isAll: true,
      dialogVisible: false,
      dialogTitle: ''
    }
  },
  mounted() {
    this.newOtherMethods = []
    this.selectionData = []
    this.$nextTick(() => {
      this.$Utils.EventBus.$on('get_other_methods', (val) => {
        this.newOtherMethods = val
      })
      this.$Utils.EventBus.$on('get_headers_all', (val) => {
        this.headers_all = val
      })
      this.$Utils.EventBus.$on('get_select_data', (val) => {
        this.selectionData = val
      })
      this.$Utils.EventBus.$on('get_is_all', (val) => {
        this.isAll = val
      })
      this.$Utils.EventBus.$on('get_ids', (val) => {
        this.ids = val
      })
    })
  },
  beforeDestroy() {
    this.$Utils.EventBus.$off('get_other_methods')
    this.$Utils.EventBus.$off('get_headers_all')
    this.$Utils.EventBus.$off('get_select_data')
    this.$Utils.EventBus.$off('get_is_all')
    this.$Utils.EventBus.$off('get_ids')
  },
  methods: {
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      // this.$emit('refresh')
      this.$Utils.EventBus.$emit('refresh')
    },
    clickType1(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }

      const classColumn = {}
      let ids = null
      this.headers_all.forEach(element => {
        if (item.edit_prop.includes(element.prop)) {
          classColumn[element['prop']] = item.editval
        }
      })
      if (this.isAll) {
        ids = {}
      } else {
        ids = this.ids.join(',')
      }
      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          // 修改批量设置的值
          this.$Apis.object.data_update(this.object_id, ids, classColumn, item.mtd_id)
          this.refresh()
        }).catch(() => {})
      } else {
        this.$Apis.object.data_update(this.object_id, ids, classColumn, item.mtd_id)
        this.refresh()
      }
    },
    clickType2(item){
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }

      this.batchData = JSON.parse(JSON.stringify(this.headers_all))
      this.batchData.forEach(element => {
        if (item.view_prop.includes(element.prop)) {
          element['isview'] = true
        }
        if (item.edit_prop.includes(element.prop)) {
          element['isedit'] = true
        }
      })
      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.dialogVisible = !this.dialogVisible
          // this.batchVisible = true
          this.dialogTitle = '批量修改'
        }).catch(() => {})
      } else {
        this.dialogVisible = !this.dialogVisible
        // this.batchVisible = true
        this.dialogTitle = '批量修改'
      }
    },
    clickType6(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }

      let ids = []
      this.selectionData.forEach((item, index) => {
        this.headers_all.some(element => {
          element['value'] = item[element['prop']]
          if (element['is_primary']) {
            if (element['value']) {
              ids.push(element['value'])
              return true
            }
          }
        })
      })
      ids = ids.join(',')
      const params = { object_id: this.object_id, page_id: this.page_id, ids: ids, mtd_id: item.mtd_id }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.set_session()
          this.$Utils.request({
            url: url,
            method: 'post',
            data: params
          }).then((response) => {
            this.$alert(response.payload, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.refresh()
              }
            })
          })
        }).catch(() => {})
      } else {
        this.set_session()
        this.$Utils.request({
          url: url,
          method: 'post',
          data: params
        }).then((response) => {
          this.$alert(response.payload, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.refresh()
            }
          })
        })
      }
    },
    clickType7(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }
      let newUrl = null
      if (this.$Utils.validate.isExternal(url)) {
        newUrl = url
      } else {
        const ids = []
        this.selectionData.forEach((item, index) => {
          this.headers_all.some(element => {
            element['value'] = item[element['prop']]
            if (element['is_primary']) {
              if (element['value']) {
                ids.push(element['value'])
                return true
              }
            }
          })
        })
        const params = { object_id: this.object_id, page_id: this.page_id, ids: ids, mtd_id: item.mtd_id }
        var _result = []
        for (var key in params) {
          var value = params[key]
          if (Array.isArray(value)) {
            value.forEach(function(_value) {
              _result.push(key + '=' + _value)
            })
          } else if (value === null) {
            _result.push(key + '=')
          } else {
            _result.push(key + '=' + value)
          }
        }
        newUrl = url + '?' + _result.join('&')
      }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          if (item.uriopentype === '0') {
            window.open(newUrl, '_blank')
          } else {
            this.set_session()
            this.$Utils.util.routerGo(newUrl)
          }
        }).catch(() => {})
      } else {
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else {
          this.set_session()
          this.$Utils.util.routerGo(newUrl)
        }
      }
    },
    clickType8(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      let newUrl = null
      const params = { r_pntfk: this.pntfk, r_pntid: this.pntid }
      if (this.$Utils.validate.isExternal(url)) {
        newUrl = url
      } else {
        var _result = []
        for (var key in params) {
          var value = params[key]
          if (Array.isArray(value)) {
            value.forEach(function(_value) {
              _result.push(key + '=' + _value)
            })
          } else if (value === null) {
            _result.push(key + '=')
          } else {
            _result.push(key + '=' + value)
          }
        }
        newUrl = url + '?' + _result.join('&')
      }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          if (item.uriopentype === '0') {
            this.$Utils.request({
              url: url,
              method: 'post',
              data: params
            }).then((response) => {
              this.$alert(response.payload, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.refresh()
                }
              })
            })
          } else if(item.uriopentype === '1') {
            window.open(newUrl, '_blank')
          } else {
            this.$Utils.util.routerGo(newUrl)
          }
        }).catch(() => {})
      } else {
        if (item.uriopentype === '0') {
          this.$Utils.request({
            url: url,
            method: 'post',
            data: params
          }).then((response) => {
            this.$alert(response.payload, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.refresh()
              }
            })
          })
        } else if(item.uriopentype === '1') {
          window.open(newUrl, '_blank')
        } else {
          this.$Utils.util.routerGo(newUrl)
        }
      }
    }
  }
}
</script>
