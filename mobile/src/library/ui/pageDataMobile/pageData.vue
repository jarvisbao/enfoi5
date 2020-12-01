<template>
  <div>
    <van-sticky v-if="title">
      <van-nav-bar
        :title="title"
        @click-right="clickRight"
      >
        <template #left>
          <div v-if="isMultiple" @click="CancelMultiple" class="van-nav-bar__left">
            <div class="van-nav-bar__left" style="width: 80px">
              <span class="van-nav-bar__text">完成</span>
            </div>
          </div>
          <div v-else-if="isBack">
            <div class="van-nav-bar__left" style="width: 80px" @click="goBack">
              <van-icon name="arrow-left" class="van-nav-bar__arrow" />
              <span class="van-nav-bar__text">返回</span>
            </div>
          </div>
        </template>
        <template #right>
          <div style="position: relative; display: flex;">
            <van-icon name="more-o" size="20" />
            <div v-show="topRight" style="position: absolute; top: 27px; background: #eee; right: -50%; border-radius: 10px; width: 100px;" class="">
              <div v-show="!isMultiple" style="padding: 4px 10px;" @click="RightSelect">
                <label>选择</label>
              </div>
              <div v-show="isMultiple" style="padding: 4px 10px;" @click="RightSelectAll">
                <label>选择全部</label>
              </div>
              <div v-show="isMultiple" style="padding: 4px 10px;" @click="RightCancelSelectAll">
                <label>取消全选</label>
              </div>
            </div>
          </div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <van-sticky v-if="(can_create && !is_view) || can_export || newOtherMethods.length > 0" :offset-top="46" :z-index="98">
      <div v-show="showTopBtn" class="check-show" @click="handleShowTopBtn">
        点击展开顶部按钮
        <van-icon name="arrow-down" />
      </div>
      <div ref="topBtnList" class="btn-list top-btn-list">
        <div v-show="can_create&&!is_view" id="create" @click="create">
          <i class="el-icon-circle-plus-outline" style="color: #2a89ea" />
          新建
        </div>
        <div v-show="can_export" :disabled="items.length===0" @click="export_data">
          <i class="el-icon-download" style="color: #02a447" />
          导出
        </div>
        <div
          v-for="(method, methodIndex) in newOtherMethods"
          :key="methodIndex"
        >
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
    </van-sticky>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="operateData"
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
    </van-pull-refresh>
  </div>
</template>
<script>
const Base64 = require('js-base64').Base64

export default {
  name: 'PageData',
  components: {
  },
  props: {
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
    },
    pnt_clsname: {
      type: String,
      default: null
    },
    filters: {
      type: Array,
      default: () => { return [] }
    },
    isBack: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
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
  data() {
    return {
      items: [],
      headers: [],
      loading: true,
      // showColumn: false,
      // mtd_id: null,
      // dialogVisible: false,
      // dialogTitle: '',
      // dialogShow: false,
      // create_headers: [],
      update_headers: [],
      // delete_headers: [],
      headers_all: [],
      // cls_name: null,
      // currentPage: 1,
      text: null,
      pagination: {
        total: 10,
        page: 1,
        pages: 1
      },
      page_size: 10,
      // layout: 'sizes, prev, pager, next',
      // showPage: false,
      can_create: false,
      can_update: false,
      can_delete: false,
      can_view: false,
      design_form: null,
      // edit_data: {},
      // currentName: null,
      delete_applycondition: '',
      // batchVisible: false,
      batchData: [],
      single_methods: [],
      other_methods: [],
      methodsItems: [],
      newSingleMethods: [],
      newOtherMethods: [],
      selectionData: [],
      isMultiple: false,
      // append_javascript: '',
      // can_apply_condition: true,
      repo_id: null,
      class_id: null,
      can_export: false,
      exportFilters: {},
      is_view: false,
      // uselist: false,
      // dialogSearch: false,
      mtdFilters: [],
      // cellBtn: [],
      convert: true,
      design_select: {},
      ids: [],
      isAll: false,
      enable_record: false,
      params: {},
      refreshing: false,
      finished: false,
      topRight: false,
      showTopBtn: false
    }
  },
  computed: {
    // allBtns() {
    //   const { items, cellBtn, newSingleMethods, delete_applycondition } = this
    //   items.forEach(item => {
    //     this.$set(item, 'buttons', [])
    //     item.buttons.push(...cellBtn, ...newSingleMethods)
    //     item.buttons.forEach((i, index) => {
    //       if (i.isMtd && eval(i.apply_condition) === false) {
    //         item.buttons.splice(index, 1)
    //       }
    //     })
    //     if (delete_applycondition && !eval(delete_applycondition)) {
    //       item.buttons = item.buttons.filter(i => {
    //         return i.action !== 'remove'
    //       })
    //     }
    //   })
    //   return items
    // }
    title() {
      return this.name ? this.name : ''
    }
  },
  watch: {
    // 'pagination.total': function(val) {
    //   if (this.pagination.total === (this.pagination.page - 1) * this.page_size && this.pagination.total !== 0) {
    //     this.pagination.page -= 1
    //     this.getData()
    //   }
    // },
    // allBtns: {
    //   handler(val) {}
    // }
  },
  created() {
    // this.get_page_params()
    // this.get_object_id()
    // this.get_page_id()
    // this.get_filters()
    this.get_object_info()
    if (this.convert) {
      this.get_design_select()
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, false)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, false)
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
    handleShowTopBtn() {
      this.showTopBtn = false
      this.$refs.topBtnList.style.opacity = '1'
      this.$refs.topBtnList.style.height = 'auto'
      this.$refs.topBtnList.style.padding = '14px 16px'
      // window.removeEventListener('scroll', this.handleScroll, false)
      // this.$nextTick(() => {
      //   window.addEventListener('scroll', this.getScollTop, false)
      // })
    },
    // getScollTop() {
    //   const scorllTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
    //   if (scorllTop === 0) {
    //     window.addEventListener('scroll', this.handleScroll, false)
    //   }
    // },
    handleScroll() {
      if ((this.can_create && !this.is_view) || this.can_export || this.newOtherMethods.length > 0) {
        const scorllTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (scorllTop > 46) {
          this.showTopBtn = true
          this.$refs.topBtnList.style.height = '0px'
          this.$refs.topBtnList.style.padding = '0px'
        } else {
          this.$refs.topBtnList.style.height = 'auto'
          this.$refs.topBtnList.style.padding = '14px 16px'
          this.showTopBtn = false
        }
      }
    },
    handleCheck(item, index) {
      if (this.isMultiple) {
        this.$refs.selectMutil[index].toggle()
      }
    },
    CancelMultiple() {
      this.topRight = false
      this.isMultiple = false
      this.RightCancelSelectAll()
    },
    clickRight() {
      this.topRight = !this.topRight
    },
    RightSelect() {
      this.isMultiple = true
      this.topRight = false
    },
    RightSelectAll() {
      this.$refs.checkboxGroup.toggleAll(true)
    },
    RightCancelSelectAll() {
      this.$refs.checkboxGroup.toggleAll(false)
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      // this.pagination.page = 1
      this.loading = true
      // this.getData()
      this.operateData()
    },
    get_design_select() {
      this.$Apis.object.get_design_select(this.object_id, this.page_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.design_select = response.payload
        }
      })
    },
    get_object_info() {
      this.$Apis.object.object_info_by_id(this.object_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          // this.is_view = response.payload.is_view
          this.design_form = response.payload.design_form
          this.delete_applycondition = response.payload.delete_applycondition
          this.single_methods = response.payload.single_methods
          this.other_methods = response.payload.other_methods
          this.repo_id = response.payload.repo_id
          this.class_id = response.payload.class_id
          this.enable_record = response.payload.enable_record
          this.get_all_headers()
          if (!this.page_id) {
            this.can_create = response.payload.can_create
            this.can_view = response.payload.can_view
            this.can_update = response.payload.can_update
            this.can_delete = response.payload.can_delete
            this.can_export = response.payload.can_export
            // if (this.can_view && !this.is_view) {
            //   this.cellBtn.push({
            //     name: '查看',
            //     action: 'view',
            //     icon: 'el-icon-view',
            //     fun: 'info'
            //   })
            // }
            // if (this.can_update && !this.is_view) {
            //   this.cellBtn.push({
            //     name: '更新',
            //     action: 'update',
            //     icon: 'el-icon-edit',
            //     fun: 'update'
            //   })
            // }
            // if (this.can_delete && !this.is_view) {
            //   this.cellBtn.push({
            //     name: '删除',
            //     action: 'remove',
            //     icon: 'el-icon-delete',
            //     fun: 'remove'
            //   })
            // }
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
      this.$Apis.object.page_info(this.page_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
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
      this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, this.filters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          if (response.payload.items.length === 0) {
            this.finished = true
          }
          this.items = [...this.items, ...response.payload.items]
          this.pagination = response.payload.pagination
          if (this.pagination.page === this.pagination.pages) {
            this.finished = true
          } else {
            this.pagination.page += 1
          }
        } else {
          this.finished = true
          this.$dialog.alert({
            message: response.message
          })
        }
        this.loading = false
      })
    },
    fetchData() {
      // this.pntfk = this.$route.query.pntfk ? this.$route.query.pntfk : null
      // this.pntid = this.$route.query.pntid ? this.$route.query.pntid : null
      // this.pnt_clsname = this.$route.query.pnt_clsname ? this.$route.query.pnt_clsname : null
      this.$Apis.object.get_headers(this.object_id, false, this.page_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers = response.payload
          this.getData()
        } else {
          this.$dialog.alert({
            message: response.message
          })
        }
      })
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
    operateData() {
      setTimeout(() => {
        if (this.refreshing) {
          this.items = []
          this.pagination.page = 1
          this.refreshing = false
        }
        this.getData()
      }, 1000)
    },
    // schfilter() {
    //   this.pagination.page = 1
    //   this.operateData()
    // },
    create() {
      this.$router.push({ name: 'data_create', query: { object_id: this.object_id, pntfk: this.pntfk, pntid: this.pntid }})
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
      // this.set_session()
      ids = ids.join(',')
      this.$router.push({ name: 'data_update', query: { object_id: this.object_id, objid: ids, record: this.enable_record }})
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
      // this.set_session()
      ids = ids.join(',')
      this.$router.push({ name: 'data_info', query: { object_id: this.object_id, page_id: this.page_id, objid: ids, record: this.enable_record }})
    },
    remove(row, index) {
      let ids = []
      // this.delete_headers = JSON.parse(JSON.stringify(this.headers))
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
      this.$dialog.confirm({ message: '是否删除该信息?' }).then(() => {
        if (!ids) {
          this.$dialog.alert({ message: '该业务类下字段没有设置主键，不允许删除' })
          return false
        }
        this.$Apis.object.data_delete(this.object_id, ids).then(response => {
          this.$dialog.alert({ message: response.message }).then(() => { this.resetItems([row], [index]) })
        })
      }).catch(() => {
      })
    },
    // handleSizeChange(val) {
    //   this.page_size = val
    //   this.operateData()
    // },
    // handleCurrentChange(val) {
    //   this.pagination.page = val
    //   this.operateData()
    // },
    // isShow() {
    //   this.dialogVisible = !this.dialogVisible
    // },
    refresh(val) {
      // this.filters = val
      // this.operateData()
    },
    goBack() {
      this.$router.go(-1)
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
    handleSelectionChange(val) {
      this.selectionData = val

      this.exportFilters = {}
      this.mtdFilters = []
      this.ids = []
      const selectionLength = val.length
      // 判断是否选中当前页所有行
      if (selectionLength === this.page_size || selectionLength === this.pagination.total) {
        this.exportFilters = {}
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
          this.exportFilters[index] = filter
        })
      }
    },
    clickType1(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$dialog.alert({ message: '请选择要操作的条目!' })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$dialog.alert({ message: '选择的条目中有不能执行的，请去掉再操作!' })
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
        this.$dialog.confirm({ message: item.confirm_msg }).then(() => {
          // 修改批量设置的值
          this.$Apis.object.data_update(this.object_id, ids, classColumn, item.mtd_id)
          this.refresh()
        }).catch(() => {})
      } else {
        this.$Apis.object.data_update(this.object_id, ids, classColumn, item.mtd_id)
        this.refresh()
      }
    },
    clickType2(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$dialog.alert({ message: '请选择要操作的条目!' })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$dialog.alert({ message: '选择的条目中有不能执行的，请去掉再操作!' })
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
        this.$dialog.confirm({ message: item.confirm_msg }).then(() => {
          // this.dialogVisible = !this.dialogVisible
          // this.batchVisible = true
          // this.dialogTitle = '批量修改'
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
      // this.set_session()
      ids = ids.join(',')
      if (item.confirm_msg) {
        this.$dialog.confirm({ message: item.confirm_msg }).then(() => {
          this.$router.push({ name: 'data_update', query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record }})
        }).catch(() => {})
      } else {
        this.$router.push({ name: 'data_update', query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record }})
      }
    },
    clickType4(item, row, index) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (!url) {
        this.$dialog.alert({ message: '没有URL地址!' })
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
      // this.set_session()
      this.params = { object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, id: ids }

      if (item.confirm_msg) {
        this.$dialog.confirm({ message: item.confirm_msg }).then(() => {
          this.$Utils.request({
            url: url,
            method: 'post',
            data: {
              param: Base64.encode(JSON.stringify(this.params))
            }
          }).then((response) => {
            this.$dialog.alert({ message: response.payload }).then(() => { this.resetItems([row], [index]) })
          })
        }).catch(() => {})
      } else {
        this.$Utils.request({
          url: url,
          method: 'post',
          data: {
            param: Base64.encode(JSON.stringify(this.params))
          }
        }).then((response) => {
          this.$dialog.alert({ message: response.payload }).then(() => { this.resetItems([row], [index]) })
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
        this.$dialog.alert({ message: '没有URL地址!' })
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
        this.$dialog.confirm({ message: item.confirm_msg }).then(() => {
          // this.set_session()
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
          this.$Utils.util.routerGo(newUrl)
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
        this.$dialog.alert({ message: '请选择要操作的条目!' })
        return false
      }
      if (!url) {
        this.$dialog.alert({ message: '没有URL地址!' })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$dialog.alert({ message: '选择的条目中有不能执行的，请去掉再操作!' })
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
        this.$dialog.confirm({ message: item.confirm_msg }).then(() => {
          // this.set_session()
          this.$Utils.request({
            url: url,
            method: 'post',
            data: {
              param: Base64.encode(JSON.stringify(this.params))
            }
          }).then((response) => {
            this.$dialog.alert({ message: response.payload }).then(() => { this.refresh() })
          })
        }).catch(() => {})
      } else {
        // this.set_session()
        this.$Utils.request({
          url: url,
          method: 'post',
          data: {
            param: Base64.encode(JSON.stringify(this.params))
          }
        }).then((response) => {
          this.$dialog.alert({ message: response.payload }).then(() => { this.refresh() })
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
        this.$dialog.alert({ message: '请选择要操作的条目!' })
        return false
      }
      if (!url) {
        this.$dialog.alert({ message: '没有URL地址!' })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$dialog.alert({ message: '选择的条目中有不能执行的，请去掉再操作!' })
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
        this.$dialog.confirm({ message: item.confirm_msg }).then(() => {
          // this.set_session()
          if (item.uriopentype === '0') {
            window.open(newUrl, '_blank')
          } else {
            this.$Utils.util.routerGo(newUrl)
          }
        }).catch(() => {})
      } else {
        // this.set_session()
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else {
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
        this.$dialog.alert({ message: '没有URL地址!' })
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
        this.$dialog.confirm({ message: item.confirm_msg }).then(() => {
          if (item.uriopentype === '0') {
            this.$Utils.request({
              url: url,
              method: 'post',
              data: this.params
            }).then((response) => {
              this.$dialog.alert({ message: response.payload }).then(() => { this.refresh() })
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
            data: this.params
          }).then((response) => {
            this.$dialog.alert({ message: response.payload }).then(() => { this.refresh() })
          })
        } else if(item.uriopentype === '1') {
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
    },
    export_data() {
      // this.dialogVisible = !this.dialogVisible
      // this.batchVisible = false
      // this.dialogTitle = '数据导出'
    },
    // query() {
    //   this.dialogSearch = !this.dialogSearch
    // },
    // isQueryShow() {
    //   this.dialogSearch = !this.dialogSearch
    // },
    // getQueryData(params) {
    //   const queryparam = []
    //   params.forEach(item => {
    //     queryparam.push(Object.values(item).join(''))
    //   })
    //   this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, queryparam, this.convert).then(response => {
    //     this.loading = true
    //     if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
    //       this.items = response.payload.items
    //       this.pagination = response.payload.pagination
    //       this.loading = false
    //       this.isQueryShow()
    //     } else {
    //       this.$alert(response.message, '提示', {
    //         confirmButtonText: '确定'
    //       })
    //     }
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
  .check-show {
    padding: 5px 0;
    text-align: center;
    font-size: 12px;
    color: #969696;
    background: #fff;
  }
  .btn-list {
    // margin-bottom: 20px;
    padding: 14px 16px;
    // display: flex;
    // flex-wrap: wrap;
    display: -webkit-box;
    overflow-x: scroll;
    -webkit-overflow-scrolling:touch;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
    .button {
      padding: 6px 12px;
      color: #409EFF;
      background: #ecf5ff;
      border: 1px solid #b3d8ff;
      border-radius: 4px;
      & + .button {
        margin-left: 12px;
      }
    }
    &.top-btn-list {
      div {
        padding: 0 10px;
        text-align: center;
      }
      i {
        display: block;
        height: 25px;
        margin-bottom: 3px;
        font-size: 22px;
      }
      .color_0 {
        color: #f52f15;
      }
      .color_1 {
        color: #f59c15;
      }
      .color_2 {
        color: #f55315;
      }
    }
  }
</style>
