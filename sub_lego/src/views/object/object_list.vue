<template>
  <div>
    <!-- <common-title/> -->
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_object@lego.project.'+proj_code]" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="object_removes">
        删除所选
      </div>
      <div v-permission="['ns://download_object@lego.project.'+proj_code]" class="btn export-btn" @click="download">
        导出
      </div>
      <el-upload
        :show-file-list="false"
        :auto-upload="false"
        :on-change="Upload"
        action=""
        class="upload-demo"
      >
        <el-button v-permission="['ns://upload_object@lego.project.'+proj_code]" size="small" type="primary" class="btn import-btn">
          导入
        </el-button>
      </el-upload>
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="items"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="object_name"
        label="对象名称"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="object_code"
        label="对象代码"
        show-overflow-tooltip
      />
      <el-table-column
        prop="biz_name"
        label="关联业务类"
        show-overflow-tooltip
      />
      <el-table-column
        prop="description"
        label="用途描述"
        show-overflow-tooltip
      />
      <el-table-column
        prop="fields"
        label="页面显示字段"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.fields }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="130"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.permission_can_edit" class="el-icon-edit" @click="object_update(scope.row.proj_code, scope.row.object_code, scope.row.biz_name)" />
          <i v-if="scope.row.permission_can_view" class="el-icon-view" @click="object_info(scope.row.proj_code, scope.row.object_code, scope.row.object_name)" />
          <i v-if="removePermission" class="el-icon-delete" @click="object_remove(scope.row.proj_code, scope.row.object_code)" />
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span id="row-operate" @click="operate(scope.row)"><i class="font-icon icon-shezhi1" />操作</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span id="row-menu" @click="page_list(scope.row)"><i class="font-icon icon-leimu" />界面</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.permission_can_copy" divided>
                <span id="row-copy" @click="copy(scope.row)"><i class="font-icon icon-fuzhi" />复制</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span id="row-running" @click="data_view(scope.row)"><i class="font-icon icon-jiedianguanli" />运行</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="createMenuPermission" divided>
                <span id="row-menu" @click="create_menu(scope.row)"><i class="font-icon icon-leimu" />生成菜单</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPage"
      :page-size="page_size"
      :layout="layout"
      :total="pagination.total"
      :current-page="pagination.page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <object-copy v-if="dialogShow" :copy_data="copy_data" @show="isShow" @refresh="refresh" />
      <menu-create v-else :menu="menu_data" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import { saveAs } from 'file-saver'
import menuCreate from './components/menuCreate'
import objectCopy from './objectCopy'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    objectCopy,
    menuCreate
  },
  data() {
    return {
      items: [],
      text: null,
      loading: false,
      showColumn: false,
      showPage: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      dialogVisible: false,
      dialogTitle: '',
      dialogShow: false,
      page: {},
      options: [],
      biz_id: [],
      fields: [],
      proj_code: null,
      object_codes: [],
      datas: [],
      copy_data: {
        new_page_code: null,
        new_page_name: null,
        object_code: null,
        proj_code: null
      },
      menu_list: [],
      menu_data: {
        code: null,
        text: null,
        parent: null,
        url: null,
        number: '',
        icon: null
      },
      removePermission: false,
      createMenuPermission: false,
      dialogSearch: false
    }
  },
  watch: {
    'pagination.total': function(val) {
      if (this.pagination.total === (this.pagination.page - 1) * this.page_size && this.pagination.total !== 0) {
        this.pagination.page -= 1
        this.fetchData()
      }
    }
  },
  created() {
    this.get_object_params()
    this.fetchData()
    this.get_proj_code()
    this.createMenuPermission = checkPermission(['ns://create_menu@identity.menus'])
    this.removePermission = checkPermission(['ns://remove_object@lego.project.' + this.proj_code])
  },
  methods: {
    get_object_params() {
      if (sessionStorage.getItem(this.$route.name)) {
        const pageParams = JSON.parse(sessionStorage.getItem(this.$route.name))
        if (this.$route.path === pageParams.path) {
          this.text = pageParams.text
          this.pagination.page = pageParams.page_index
          this.page_size = pageParams.page_size
        }
      }
    },
    get_proj_code() {
      if ('proj_code' in this.$route.query) {
        this.proj_code = this.$route.query.proj_code
        return this.proj_code
      } else {
        return null
      }
    },
    fetchData() {
      this.get_proj_code()
      this.loading = true
      this.$Apis.object.object_list(this.proj_code, this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showColumn = true
            this.showPage = true
          } else {
            this.showColumn = false
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    operateData() {
      this.loading = true
      this.$Apis.object.object_list(this.proj_code, this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showColumn = true
            this.showPage = true
          } else {
            this.showColumn = false
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    schfilter() {
      this.pagination.page = 1
      this.operateData()
    },
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    create() {
      this.$router.push({ name: 'object_create', query: { proj_code: this.proj_code }})
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    object_update(proj_code, object_code, biz_name) {
      this.set_session()
      this.$router.push({ name: 'object_update', query: { proj_code: proj_code, object_code: object_code, name: biz_name }})
    },
    object_info(proj_code, object_code, object_name) {
      this.set_session()
      this.$router.push({ name: 'object_info', query: { proj_code: proj_code, object_code: object_code, name: object_name }})
    },
    object_remove(proj_code, object_code) {
      this.$confirm('是否删除该对象?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.object.object_delete(proj_code, object_code).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.refresh()
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
      })
    },
    object_removes() {
      if (JSON.stringify(this.object_codes) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选对象?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.object.object_delete(this.proj_code, this.object_codes).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.refresh()
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
      })
    },
    data_view(row) {
      this.set_session()
      const route = this.$router.resolve({
        name: 'data',
        query: { object_id: row.object_id, name: row.object_name }
      })
      window.open(route.href, '_blank')
      // this.$router.push({ name: 'data', query: { object_id: row.object_id, name: row.object_name }})
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    operate(row) {
      this.set_session()
      this.$router.push({ name: 'operate', query: { object_id: row.object_id, name: row.object_name }})
    },
    page_list(row) {
      this.set_session()
      this.$router.push({ name: 'page', query: { object_id: row.object_id, name: row.object_name }})
    },
    handleSelectionChange(val) {
      this.object_codes = []
      val.forEach(element => {
        this.object_codes.push(element.object_code)
      })
    },
    create_menu(row) {
      this.menu_data.menu_code = row.object_code
      this.menu_data.label = row.object_name
      this.menu_data.uri = '/data?object_id=' + row.object_id + '&name=' + row.object_name
      this.menu_data = JSON.parse(JSON.stringify(this.menu_data))
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '创建菜单'
      this.dialogShow = false
    },
    download() {
      this.$Apis.object.object_download(this.proj_code, this.object_codes).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          var data = response.payload
          var count = Object.keys(data).length
          var fileDownload = require('js-file-download')
          try {
            var isFileSaverSupported = !!new Blob()
          } catch (e) {}
          if (count > 1) {
            var JSZip = require('jszip')
            var zip = JSZip()
            for (var key in data) {
              zip.file(key + '.json', JSON.stringify(data[key]))
            }
            zip.generateAsync({ type: 'blob' })
              .then(function(blob) {
                if (isFileSaverSupported) {
                  saveAs(blob, '界面备份.zip')
                } else {
                  fileDownload(blob, '界面备份.zip')
                }
              })
          } else if (count === 1) {
            for (var key in data) {
              if (isFileSaverSupported) {
                var blob = new Blob([JSON.stringify(data[key])], { type: 'text/plain;charset=utf-8' })
                saveAs(blob, key + '.json')
              } else {
                fileDownload(JSON.stringify(data[key]), key + '.json')
              }
            }
          } else {
            fileDownload(data, 'page.json')
          }
        } else {
          this.$alert(response.data.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    Upload(f, fileList) {
      var file = f.raw
      this.datas = []
      if (file.name.endsWith('.zip')) {
        var JSZip = require('jszip')
        var zip = JSZip()
        const that = this
        zip.loadAsync(file) // 1) read the Blob
          .then(function(zip) {
            var datas = []
            var count = 0
            var json_num = Object.getOwnPropertyNames(zip.files).length
            zip.forEach(function(relativePath, zipEntry) { // 2) print entries
              if (zipEntry.name.endsWith('.json')) {
                zip.file(zipEntry.name).async('string').then(function(data) {
                  try {
                    JSON.parse(data)
                  } catch (error) {
                    that.$alert('文件内容需要是json格式', '提示', {
                      confirmButtonText: '确定',
                      callback: action => {
                        return false
                      }
                    })
                  }
                  datas.push(JSON.parse(data))
                  count += 1
                  if (json_num === count) {
                    that.$Apis.object.object_upload(that.proj_code, datas).then(response => {
                      if (response.code !== that.$Utils.Constlib.ERROR_CODE_OK) {
                        that.$alert(response.message, '提示', {
                          confirmButtonText: '确定'
                        })
                      } else {
                        that.$alert('导入成功!', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {
                            that.refresh()
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          })
      } else if (file.name.endsWith('.json')) {
        var reader = new FileReader()
        const that = this
        reader.readAsText(file, 'UTF-8')
        reader.onload = function(evt) {
          var data = evt.target.result
          try {
            JSON.parse(data)
          } catch (error) {
            that.$alert('文件内容需要是json格式', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                return false
              }
            })
          }
          that.datas.push(JSON.parse(data))
          that.$Apis.object.object_upload(that.proj_code, that.datas).then(response => {
            if (response.code !== that.$Utils.Constlib.ERROR_CODE_OK) {
              that.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            } else {
              that.$alert('导入成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  that.refresh()
                }
              })
            }
          })
        }
      } else {
        this.$alert('请导入.zip格式或.json格式的文件', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            return false
          }
        })
      }
      fileList = []
    },
    copy(row) {
      this.copy_data = {
        proj_code: this.proj_code,
        object_code: row.object_code,
        new_object_name: '_' + row.object_name + '_',
        new_object_code: '_' + row.object_code + '_'
      }
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '对象复制'
      this.dialogShow = true
    }
  }
}
</script>
