<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_class@lego.repository.class']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="view_deletes">
        删除所选
      </div>
      <div v-permission="['ns://download_class@lego.repository.class']" class="btn export-btn" @click="download">
        导出
      </div>
      <el-upload
        :show-file-list="false"
        :auto-upload="false"
        :on-change="Upload"
        action=""
        class="upload-demo"
      >
        <el-button v-permission="['ns://upload_class@lego.repository.class']" size="small" type="primary" class="btn import-btn">
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
        prop="cls_name"
        label="类名称"
        width="220"
        show-overflow-tooltip
      />
      <el-table-column
        prop="cls_table"
        label="视图名称"
        width="220"
        show-overflow-tooltip
      />
      <el-table-column
        prop="cls_comment"
        label="视图描述"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="150"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="view_update(scope.row.repo_name, scope.row.cls_name)" />
          <i v-if="viewPermission" class="el-icon-view" @click="view_info(scope.row.repo_name, scope.row.cls_name)" />
          <i v-if="removePermission" class="el-icon-delete" @click="view_delete(scope.row.repo_name, scope.row.cls_name)" />
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
      <view-create v-if="dialogShow" :repo_name="repo_name" @show="isShow" @refresh="refresh" />
      <view-update v-else :repo-view="repoView" :old_view_name="old_view_name" :repo_name="repo_name" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import viewCreate from '../view/viewCreate'
import viewUpdate from '../view/viewUpdate'
import { saveAs } from 'file-saver'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    viewCreate,
    viewUpdate
  },
  data() {
    return {
      items: [],
      loading: false,
      showColumn: false,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      showPage: false,
      dialogVisible: false,
      dialogTitle: null,
      dialogShow: false,
      repo_name: null,
      repoView: {},
      old_view_name: null,
      cls_names: [],
      datas: [],
      updatePermission: false,
      removePermission: false,
      viewPermission: false
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
    this.get_page_params()
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_class@lego.repository.class'])
    this.removePermission = checkPermission(['ns://remove_class@lego.repository.class'])
    this.viewPermission = checkPermission(['ns://view_class@lego.repository.class'])
  },
  methods: {
    checkPermission,
    get_name() {
      if ('name' in this.$route.query) {
        this.repo_name = this.$route.query.name
        return this.repo_name
      } else {
        return null
      }
    },
    get_page_params() {
      if (sessionStorage.getItem(this.$route.name)) {
        const pageParams = JSON.parse(sessionStorage.getItem(this.$route.name))
        if (this.$route.path === pageParams.path) {
          this.text = pageParams.text
          this.pagination.page = pageParams.page_index
          this.page_size = pageParams.page_size
        }
      }
    },
    fetchData() {
      const repo_name = this.get_name()
      this.loading = true
      this.$Apis.class.class_list(repo_name, this.text, this.pagination.page, this.page_size, true, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          if (this.pagination.total > 0) {
            this.showPage = true
            this.showColumn = true
          } else {
            this.showPage = false
            this.showColumn = false
          }
          this.loading = false
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    operateData() {
      const repo_name = this.get_name()
      this.$Apis.class.class_list(repo_name, this.text, this.pagination.page, this.page_size, true, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          if (this.pagination.total > 0) {
            this.showPage = true
            this.showColumn = true
          } else {
            this.showPage = false
            this.showColumn = false
          }
          this.loading = false
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
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '新建视图'
      this.dialogShow = true
    },
    view_update(repo_name, cls_name) {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '修改视图'
      this.dialogShow = false
      this.$Apis.class.class_info(repo_name, cls_name).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.repoView = response.payload
          this.old_view_name = this.repoView.cls_name
        }
      })
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    view_info(repo_name, class_name) {
      this.set_session()
      this.$router.push({ name: 'repo_view_info', query: { repo_name: repo_name, name: class_name }})
    },
    view_delete(repo_name, cls_name) {
      this.$confirm('是否删除该视图?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.class.class_delete(repo_name, cls_name).then(response => {
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
    view_deletes() {
      if (JSON.stringify(this.cls_names) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选视图?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.class.class_delete(this.repo_name, this.cls_names).then(response => {
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
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.cls_names = []
      val.forEach(element => {
        this.cls_names.push(element.cls_name)
      })
    },
    download() {
      const repo_name = this.get_name()
      this.$Apis.class.class_download(repo_name, this.cls_names, true).then(response => {
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
                  saveAs(blob, '视图备份.zip')
                } else {
                  fileDownload(blob, '视图备份.zip')
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
            fileDownload(data, 'views.json')
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
      const repo_name = this.get_name()
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
                    that.$Apis.class.class_upload(repo_name, datas).then(response => {
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
        this.datas = []
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
          that.$Apis.class.class_upload(repo_name, that.datas).then(response => {
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
    }
  }
}
</script>
