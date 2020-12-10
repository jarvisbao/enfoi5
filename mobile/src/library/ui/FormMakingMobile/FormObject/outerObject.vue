<template>
  <div class="outer-object">
    <!-- <template v-if="!pntid">
      <van-field
        :id="id"
        :ref="widget.model"
        :name="widget.model"
        disabled
      />
    </template>
    <van-field
      v-else
      :id="id"
      :ref="widget.model"
      :name="widget.model"
      readonly
    >
    </van-field> -->
    <div v-if="!pntid" style="margin: 20px">
      新建数据时不支持外链子对象
    </div>
    <div v-if="pntid" class="obj-data">
      <div class="methods-btn">
        <div v-if="can_create && !disabled" @click="create">
          <i class="el-icon-circle-plus-outline" style="color: #2a89ea" />
          新建
        </div>
        <div @click="refresh">
          <i class="el-icon-download" style="color: #02a447" />
          刷新
        </div>
        <div v-for="(method, index) in newOtherMethods" :key="index">
          <span v-if="method.operate_type===1" id="plcl" @click="clickType1(method)">
            <i :class="[method.icon ? method.icon : 'icon-vehicles', 'color_' + parseInt(Math.random(0, 1) * 2)]" />
            {{ method.operate_name }}
          </span>
          <span v-if="method.operate_type===2" id="plxg" @click="clickType2(method)">
            <i :class="[method.icon ? method.icon : 'icon-vehicles', 'color_' + parseInt(Math.random(0, 1) * 2)]" />
            {{ method.operate_name }}
          </span>
          <span v-if="method.operate_type===6" id="plPost" @click="clickType6(method)">
            <i :class="[method.icon ? method.icon : 'icon-vehicles', 'color_' + parseInt(Math.random(0, 1) * 2)]" />
            {{ method.operate_name }}
          </span>
          <span v-if="method.operate_type===7" id="plGet" @click="clickType7(method)">
            <i :class="[method.icon ? method.icon : 'icon-vehicles', 'color_' + parseInt(Math.random(0, 1) * 2)]" />
            {{ method.operate_name }}
          </span>
          <span v-if="method.operate_type===8" id="clsCreate" @click="clickType8(method)">
            <i :class="[method.icon ? method.icon : 'icon-vehicles', 'color_' + parseInt(Math.random(0, 1) * 2)]" />
            {{ method.operate_name }}
          </span>
        </div>
      </div>
      <div class="list-box">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-checkbox-group ref="checkboxGroup" v-model="selectionData" class="list-box" @change="handleSelectionChange">
            <div v-for="(item, index) in items" :key="index" class="list-item">
              <div class="list padding" @click="handleCheck(item, index)">
                <div ref="listFlex" class="list_flex">
                  <div v-show="isMultiple" class="mutil-btn">
                    <van-checkbox ref="selectMutil" :name="item" />
                  </div>
                  <div>
                    <div v-for="(header, headerIndex) in headers" :key="headerIndex" class="item">
                      <label>{{ header.label }}:</label>
                      <div>
                        <div v-if="header.data_format && ['image','file', 'html'].indexOf(header.data_format) != -1">
                          <span class="dlink" v-html="item[header.prop]" />
                        </div>
                        <div v-else-if="convert && header.prop in design_select">
                          {{ item[header.prop] | formatterFun(design_select[header.prop].values, design_select[header.prop].labels) }}
                        </div>
                        <div v-else>
                          {{ item[header.prop] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="btn-list">
                <div v-show="can_view&&!is_view" class="button" @click="info(item)">查看</div>
                <div v-show="can_update&&!is_view" class="button" @click="update(item)">修改</div>
                <div v-display="[delete_applycondition, item]" v-show="can_delete&&!is_view" class="button" @click="remove(item, index)">删除</div>
                <div
                  v-for="(method, methodIndex) in newSingleMethods"
                  :key="methodIndex">
                  <span class="button" v-display="[method.apply_condition, item]" v-if="method.operate_type===3" id="rowEdit" @click="clickType3(method, item)">{{ method.operate_name }}</span>
                  <span class="button" v-display="[method.apply_condition, item]" v-if="method.operate_type===4" id="rowPost" @click="clickType4(method, item, index)">{{ method.operate_name }}</span>
                  <span class="button" v-display="[method.apply_condition, item]" v-if="method.operate_type===5" id="rowGet" @click="clickType5(method, item)">{{ method.operate_name }}</span>
                </div>
              </div>
            </div>
          </van-checkbox-group>
        </van-list>
      </div>
    </div>
    <div v-show="pntid && isMultiple" style="height: 50px;">
      <div class="check-all-box">
        <div :class="{'check-all': isCheckAll}" class="check-btn" @click="selectAll" />
        <div class="right-btn">
          <van-button type="primary" size="small" round @click="refresh">刷新</van-button>
        </div>
      </div>
    </div>
    <van-popup v-model="dialogVisible" :overlay="false" position="right" :style="{ height: '100%', width: '100%' }">
      <method-batch-edit
        v-if="batchVisible"
        :batch-data="batchData"
        :ids="ids"
        :is-all="isAll"
        :object_id="object_id"
        :mtd_id="mtd_id"
        @show="isShow"
        @refresh="refresh"
      />
    </van-popup>
    <van-popup v-model="dialogCreate" :overlay="false" position="right" :style="{ height: '100%', width: '100%' }">
      <template v-if="showForm">
        <object-create
          v-if="isCreate"
          :object_id="object_id"
          :pntfk="pntfk"
          :pntid="pntid"
          @show="isCreateShow"
          @refresh="refresh"
        />
        <object-update
          v-else
          :object_id="object_id"
          :objid="objid"
          :mtd_id="mtd_id"
          :edit="isEdit"
          @show="isCreateShow"
          @refresh="refresh"
        />
      </template>
    </van-popup>
    <van-popup v-model="dialogMtd" :overlay="false" position="right" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar
        left-text="返回"
        left-arrow
        @click-left="dialogMtd = false"
      />
      <iframe :src="mtd_get_url" width="100%" height="500px" frameborder="0" />
    </van-popup>
    <overlay-loading :show="showOverlay" :text="loadingText" />
  </div>
</template>
<script>
import objectUpdate from './objUpdate'
const Base64 = require('js-base64').Base64

export default {
  components: {
    objectCreate: () => import('./objCreate'),
    objectUpdate
  },
  filters: {
    formatterFun: function(value, values, labels) {
      // if (!value) return value
      let result = value
      const isArray = Array.isArray(value)
      if (value) {
        if (isArray) {
          result = []
          value.forEach(element => {
            const index = values.indexOf(element)
            if (index !== -1) {
              result.push(labels[index])
            }
          })
          result = result.join(',')
        } else {
          const index = values.indexOf(value)
          if (index !== -1) {
            result = labels[index]
          }
        }
      }
      return result
    }
  },
  props: ['value', 'models', 'remote', 'blanks', 'disabled', 'widget', 'helpers', 'designFields', 'formValue', 'id'],
  data() {
    return {
      loading: true,
      finished: false,
      items: [],
      headers: [],
      headers_all: [],
      update_headers: [],
      selectionData: [],
      object_id: null,
      page_id: null,
      proj_code: this.widget.options.proj_code,
      object_code: this.widget.options.object_code,
      page_code: this.widget.options.page_code,
      pntfk: this.widget.name_model.format,
      pnt_clsname: this.widget.name_model.cls_name,
      pntid: null,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      filters: [],
      convert: true,
      design_select: {},
      methodsItems: [],
      single_methods: [],
      other_methods: [],
      newOtherMethods: [],
      newSingleMethods: [],
      is_view: false,
      can_create: false,
      can_view: false,
      can_update: false,
      can_delete: false,
      design_form: null,
      cellBtn: [],
      delete_applycondition: '',
      isMultiple: false,
      dialogVisible: false,
      dialogTitle: '',
      batchVisible: false,
      batchData: [],
      isAll: false,
      ids: [],
      mtdFilters: [],
      enable_record: false,
      dialogCreate: false,
      objTitle: '',
      isCreate: false,
      mtd_id: null,
      objid: null,
      isEdit: false,
      params: {},
      dialogMtd: false,
      mtdTitle: '',
      mtd_get_url: null,
      showForm: false,
      showTopBtn: false,
      showOverlay: false,
      loadingText: null,
      isCheckAll: false
    }
  },
  watch: {
    dialogCreate(val) {
      if (!val) {
        setTimeout(() => {
          this.showForm = false
        }, 300)
      } else {
        this.showForm = true
      }
    }
  },
  created() {
    this.designFields.some(item => {
      if (item.is_primary) {
        const prop = item.prop
        if (prop in this.formValue && !!(this.formValue[prop])) {
          this.pntid = this.formValue[prop]
          return true
        }
      }
    })
    this.get_object_info()
    if (this.convert) {
      this.get_design_select()
    }
  },
  methods: {
    resetItems(items, indexes) {
      const ids = []
      let primary_key = null
      items.forEach((item, index) => {
        this.headers_all.some(element => {
          element['value'] = item[element['prop']]
          if (element['is_primary']) {
            if (element['value']) {
              if (!primary_key) {
                primary_key = element['prop']
              }
              ids.push(element['value'])
              return true
            }
          }
        })
      })
      const filter = primary_key + '.in_([' + ids.join() + '])'
      if (ids.length > 0 && primary_key) {
        this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, filter, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            const new_items = response.payload.items
            const new_ids = []
            new_items.forEach(new_item => {
              new_ids.push(new_item[primary_key])
            })
            ids.forEach((id, index) => {
              const new_index = new_ids.indexOf(id)
              if (new_index !== -1) {
                Object.keys(new_items[new_index]).forEach(key => {
                  this.items[indexes[index]][key] = new_items[new_index][key]
                  // items[index][key] = new_items[new_index][key]
                })
              } else {
                this.items.splice(indexes[index], 1)
              }
            })
          }
        })
      }
    },
    selectAll() {
      if (this.selectionData.length === this.items.length) {
        this.$refs.checkboxGroup.toggleAll(false)
        this.isCheckAll = false
      } else {
        this.$refs.checkboxGroup.toggleAll(true)
        this.isCheckAll = true
      }
    },
    handleCheck(item, index) {
      if (this.isMultiple) {
        this.$refs.selectMutil[index].toggle()
      }
    },

    get_design_select() {
      this.$Apis.object.get_design_select_by_code(this.proj_code, this.object_code, this.page_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.design_select = response.payload
        }
      })
    },
    get_object_info() {
      this.$Apis.object.object_info(this.proj_code, this.object_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.object_id = response.payload.object_id
          this.is_view = response.payload.is_view
          // this.innerObjData = JSON.parse(response.payload.design_form)
          this.delete_applycondition = response.payload.delete_applycondition
          this.single_methods = response.payload.single_methods
          this.other_methods = response.payload.other_methods
          this.enable_record = response.payload.enable_record
          this.get_all_headers()
          if (!this.page_code) {
            this.can_create = response.payload.can_create
            this.can_view = response.payload.can_view
            this.can_update = response.payload.can_update
            this.can_delete = response.payload.can_delete
            this.can_export = response.payload.can_export

            this.get_method()
            this.fetchData()
          } else {
            this.get_page_info()
          }
        } else {
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    get_page_info() {
      this.$Apis.object.page_info_by_code(this.proj_code, this.object_code, this.page_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.page_id = response.payload.page_id
          this.can_create = response.payload.can_create
          this.can_view = response.payload.can_view
          this.can_update = response.payload.can_update
          this.can_delete = response.payload.can_delete
          this.can_export = response.payload.can_export
          this.single_methods = response.payload.single_methods
          this.other_methods = response.payload.other_methods
          this.get_method()
          this.fetchData()
        } else {
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    get_all_headers() {
      this.$Apis.object.get_headers(this.object_id, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers_all = response.payload
        }
      })
    },
    getData() {
      this.loading = true
      this.$Apis.object.data_list_by_code(this.proj_code, this.object_code, this.page_code, this.text, this.pagination.page, this.page_size, true, this.filters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = [...this.items, ...response.payload.items]
          this.pagination = response.payload.pagination
          if (this.pagination.page === this.pagination.pages) {
            this.finished = true
          } else {
            this.pagination.page += 1
          }
          this.loading = false
        } else {
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    fetchData() {
      if (this.pntid) {
        this.$Apis.object.get_headers_by_code(this.proj_code, this.object_code, this.page_code, false).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.headers = response.payload
            this.getData()
          }
        })
      }
    },
    get_method() {
      this.$Apis.object.method_list_by_id(this.object_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.methodsItems = response.payload.items
          this.get_new_other()
          this.get_new_single()
          if (JSON.stringify(this.newOtherMethods) !== '[]') {
            this.isMultiple = true
          } else {
            this.isMultiple = false
          }
        }
      })
    },
    onLoad() {
      setTimeout(() => {
        this.getData()
      }, 1000)
    },
    get_new_other() {
      if (this.other_methods !== null) {
        this.other_methods.forEach(element => {
          this.methodsItems.forEach(item => {
            if (element === item.mtd_id) {
              this.newOtherMethods.push(item)
            }
          })
        })
      }
    },
    get_new_single() {
      if (this.single_methods !== null) {
        this.single_methods.forEach(element => {
          this.methodsItems.forEach(item => {
            if (element === item.mtd_id) {
              this.$set(item, 'name', item.operate_name)
              this.$set(item, 'fun', 'clickType' + item.operate_type)
              this.$set(item, 'isMtd', true)
              this.newSingleMethods.push(item)
            }
          })
        })
      }
    },
    create() {
      this.dialogCreate = !this.dialogCreate
      this.isCreate = true
      this.objTitle = '新建'
    },
    isCreateShow() {
      this.dialogCreate = !this.dialogCreate
    },
    handleSelectionChange(val) {
      this.selectionData = val
      this.mtdFilters = []
      this.ids = []
      const selectionLength = val.length
      // 判断是否选中当前页所有行
      if (selectionLength === this.page_size || selectionLength === this.pagination.total) {
        this.isAll = true
      } else {
        this.isAll = false
        val.forEach((item, index) => {
          var filter = []
          this.headers_all.some(element => {
            element['value'] = item[element['prop']]
            if (element['is_primary']) {
              if (element['value']) {
                filter.push(element['prop'] + '=="' + element['value'] + '"')
                this.mtdFilters.push(element['prop'] + '=="' + element['value'] + '"')
                this.ids.push(element['value'])
                return true
              }
            }
          })
        })
      }
    },
    refresh() {
      this.finished = false
      this.loading = true
      this.items = []
      this.pagination.page = 1
      this.fetchData()
      this.selectionData = []
    },
    update(row) {
      let ids = []
      this.update_headers = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      this.objid = ids
      this.dialogCreate = !this.dialogCreate
      this.isCreate = false
      this.objTitle = '更新'
      this.isEdit = true
    },
    info(row) {
      this.update_headers = []
      let ids = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      this.objid = ids
      this.dialogCreate = !this.dialogCreate
      this.isCreate = false
      this.objTitle = '查看'
      this.isEdit = false
    },
    remove(row, index) {
      let ids = []
      this.headers_all.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      this.$dialog.confirm({
        message: '是否删除该信息?'
      }).then(() => {
        if (!ids) {
          this.$dialog.alert({
            message: '该业务类下字段没有设置主键，不允许删除'
          })
          return false
        }
        this.$Apis.object.data_delete(this.object_id, ids).then(response => {
          this.$dialog.alert({
            message: response.message
          }).then(() => {
            this.resetItems([row], [index])
          })
        })
      }).catch(() => {
      })
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    clickType1(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$dialog.alert({
          message: '请选择要操作的条目！'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$dialog.alert({
            message: '选择的条目中有不能执行的，请去掉再操作！'
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
        this.$dialog.confirm({
          message: item.confirm_msg
        }).then(() => {
          this.showOverlay = true
          this.loadingText = '处理中...'
          this.$Apis.object.data_update(this.object_id, ids, classColumn, item.mtd_id).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.showOverlay = false
              this.loadingText = null
              this.refresh()
            } else {
              this.showOverlay = false
              this.loadingText = null
            }
          })
        }).catch(() => {
          this.showOverlay = false
          this.loadingText = null
        })
      } else {
        this.showOverlay = true
        this.loadingText = '处理中...'
        this.$Apis.object.data_update(this.object_id, ids, classColumn, item.mtd_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.showOverlay = false
            this.loadingText = null
            this.refresh()
          } else {
            this.showOverlay = false
            this.loadingText = null
          }
        })
      }
    },
    clickType2(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$dialog.alert({
          message: '请选择要操作的条目！'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$dialog.alert({
            message: '选择的条目中有不能执行的，请去掉再操作！'
          })
          return false
        }
      }
      this.mtd_id = item.mtd_id
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
        this.$dialog.confirm({
          message: item.confirm_msg
        }).then(() => {
          this.dialogVisible = !this.dialogVisible
          this.batchVisible = true
          this.dialogTitle = '批量修改'
        }).catch(() => {})
      } else {
        this.dialogVisible = !this.dialogVisible
        this.batchVisible = true
        this.dialogTitle = '批量修改'
      }
    },
    clickType3(item, row) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      this.update_headers = []
      let ids = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      this.objid = ids
      this.mtd_id = item.mtd_id
      if (item.confirm_msg) {
        this.$dialog.confirm({
          message: item.confirm_msg
        }).then(() => {
          this.dialogCreate = !this.dialogCreate
          this.isCreate = false
          this.objTitle = '更新'
          this.isEdit = true
        }).catch(() => {})
      } else {
        this.dialogCreate = !this.dialogCreate
        this.isCreate = false
        this.objTitle = '更新'
        this.isEdit = true
      }
    },
    clickType4(item, row, index) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (!url) {
        this.$dialog.alert({
          message: '没有URL地址'
        })
        return false
      }
      const update_headers = []
      let ids = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          update_headers.push(element)
        }
      })
      update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      this.params = { object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, id: ids }

      if (item.confirm_msg) {
        this.$dialog.confirm({
          message: item.confirm_msg
        }).then(() => {
          this.showOverlay = true
          this.loadingText = null
          this.$Utils.request({
            url: url,
            method: 'post',
            data: {
              param: Base64.encode(JSON.stringify(this.params))
            }
          }).then((response) => {
            this.showOverlay = false
            this.loadingText = null
            this.$dialog.alert({
              message: response.payload
            }).then(() => {
              this.resetItems([row], [index])
            })
          })
        }).catch(() => {})
      } else {
        this.showOverlay = true
        this.loadingText = '处理中...'
        this.$Utils.request({
          url: url,
          method: 'post',
          data: {
            param: Base64.encode(JSON.stringify(this.params))
          }
        }).then((response) => {
          this.showOverlay = false
          this.loadingText = null
          this.$dialog.alert({
            message: response.payload
          }).then(() => {
            this.resetItems([row], [index])
          })
        })
      }
    },
    clickType5(item, row) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (!url) {
        this.$dialog.alert({
          message: '没有URL地址'
        })
        return false
      }
      let newUrl = null
      if (this.$Utils.validate.isExternal(url)) {
        newUrl = url
      } else {
        const update_headers = []
        let ids = []
        this.headers_all.forEach(element => {
          if (!element['is_property'] && !element['is_object']) {
            update_headers.push(element)
          }
        })
        update_headers.some(element => {
          element['value'] = row[element['prop']]
          if (element['is_primary']) {
            if (element['value']) {
              ids.push(element['value'])
              return true
            }
          }
        })
        ids = ids.join(',')
        this.params = { object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, id: ids }
        var _result = []
        for (var key in this.params) {
          var value = this.params[key]
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

        const params = url.split('?')[1] || ''
        if (params) {
          newUrl = url + '&param=' + Base64.encode(JSON.stringify(this.params))
        } else {
          newUrl = url + '?param=' + Base64.encode(JSON.stringify(this.params))
        }
      }

      if (item.confirm_msg) {
        this.$dialog.confirm({
          message: item.confirm_msg
        }).then(() => {
          if (item.uriopentype === '0') {
            window.open(newUrl, '_blank')
          } else {
            this.$Utils.util.routerGo(newUrl)
          }
        }).catch(() => {})
      } else {
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else {
          this.dialogMtd = !this.dialogMtd
          this.mtdTitle = item.operate_name
          this.mtd_get_url = newUrl
        }
      }
    },
    clickType6(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$dialog.alert({
          message: '请选择要操作的条目！'
        })
        return false
      }
      if (!url) {
        this.$dialog.alert({
          message: '没有URL地址'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$dialog.alert({
            message: '选择的条目中有不能执行的，请去掉再操作！'
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
      this.params = { object_id: this.object_id, page_id: this.page_id, ids: ids, mtd_id: item.mtd_id }

      if (item.confirm_msg) {
        this.$dialog.confirm({
          message: item.confirm_msg
        }).then(() => {
          this.showOverlay = true
          this.loadingText = '处理中...'
          this.$Utils.request({
            url: url,
            method: 'post',
            data: {
              param: Base64.encode(JSON.stringify(this.params))
            }
          }).then((response) => {
            this.showOverlay = false
            this.loadingText = null
            this.$dialog.alert({
              message: response.payload
            }).then(() => {
              this.refresh()
            })
          })
        }).catch(() => {
          this.showOverlay = false
          this.loadingText = null
        })
      } else {
        this.showOverlay = true
        this.loadingText = '处理中...'
        this.$Utils.request({
          url: url,
          method: 'post',
          data: {
            param: Base64.encode(JSON.stringify(this.params))
          }
        }).then((response) => {
          this.showOverlay = false
          this.loadingText = null
          this.$dialog.alert({
            message: response.payload
          }).then(() => {
            this.refresh()
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
        this.$dialog.alert({
          message: '请选择要操作的条目！'
        })
        return false
      }
      if (!url) {
        this.$dialog.alert({
          message: '没有URL地址'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$dialog.alert({
            message: '选择的条目中有不能执行的，请去掉再操作！'
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
        this.params = { object_id: this.object_id, page_id: this.page_id, ids: ids, mtd_id: item.mtd_id }

        var _result = []
        for (var key in this.params) {
          var value = this.params[key]
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

        const params = url.split('?')[1] || ''
        if (params) {
          newUrl = url + '&param=' + Base64.encode(JSON.stringify(this.params))
        } else {
          newUrl = url + '?param=' + Base64.encode(JSON.stringify(this.params))
        }
      }

      if (item.confirm_msg) {
        this.$dialog.confirm({
          message: item.confirm_msg
        }).then(() => {
          if (item.uriopentype === '0') {
            window.open(newUrl, '_blank')
          } else {
            this.$Utils.util.routerGo(newUrl)
          }
        }).catch(() => {})
      } else {
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else {
          // this.$Utils.util.routerGo(newUrl)
          this.dialogMtd = !this.dialogMtd
          this.mtdTitle = item.operate_name
          this.mtd_get_url = newUrl
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
        this.$dialog.alert({
          message: '没有URL地址'
        })
        return false
      }
      let newUrl = null
      this.params = { r_objectid: this.object_id, r_pntfk: this.pntfk, r_pntid: this.pntid, r_pnt_clsname: this.pnt_clsname }

      if (this.$Utils.validate.isExternal(url)) {
        newUrl = url
      } else {
        var _result = []
        for (var key in this.params) {
          var value = this.params[key]
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

        const params = url.split('?')[1] || ''
        if (params) {
          newUrl = url + '&' + _result.join('&')
        } else {
          newUrl = url + '?' + _result.join('&')
        }
      }

      if (item.confirm_msg) {
        this.$dialog.confirm({
          message: item.confirm_msg
        }).then(() => {
          if (item.uriopentype === '0') {
            this.$Utils.request({
              url: url,
              method: 'post',
              data: {
                param: Base64.encode(JSON.stringify(this.params))
              }
            }).then((response) => {
              this.$dialog.alert({
                message: response.payload
              }).then(() => {
                this.refresh()
              })
            })
          } else if (item.uriopentype === '1') {
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
            data: {
              param: Base64.encode(JSON.stringify(this.params))
            }
          }).then((response) => {
            this.$dialog.alert({
              message: response.payload
            }).then(() => {
              this.refresh()
            })
          })
        } else if (item.uriopentype === '1') {
          window.open(newUrl, '_blank')
        } else {
          this.$Utils.util.routerGo(newUrl)
        }
      }
    },
    add_script(code) {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.text = code
      document.head.appendChild(script)
    }
  }
}
</script>
<style lang="scss" scoped>
.outer-object {
  &.is-disabled::after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    cursor: no-drop;
    background: rgba(255,255,255,.5);
    z-index: 100;
  }
  & ::v-deep .el-form-item {
    margin-bottom: 22px;
  }
  .action-btn {
    .el-button.is-plain:hover,
    .el-button.is-plain:focus {
      border-color: #409eff;
      color: #fff;
    }
  }
  & ::v-deep .el-table thead tr th {
    background: #f5f7fa;
    color: #909399;
  }
}
</style>
