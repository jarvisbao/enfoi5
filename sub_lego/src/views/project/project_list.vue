<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_project@lego.project']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="project_deletes">
        删除所选
      </div>
      <div v-permission="['ns://download_project@lego.project']" class="btn export-btn" @click="download">
        导出
      </div>
      <el-upload
        :show-file-list="false"
        :auto-upload="false"
        :on-change="Upload"
        action=""
        class="upload-demo"
      >
        <el-button v-permission="['ns://upload_project@lego.project']" size="small" type="primary" class="btn import-btn">
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
        prop="proj_name"
        label="项目名称"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="proj_code"
        label="项目代码"
        show-overflow-tooltip
      />
      <el-table-column
        prop="props"
        label="项目的属性"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.props }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="130"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="project_update(scope.row.proj_code)" />
          <i v-if="viewPermission" class="el-icon-view" @click="project_info(scope.row.proj_code, scope.row.proj_name)" />
          <i v-if="removePermission" class="el-icon-delete" @click="project_delete(scope.row.proj_code)" />
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
      <project-create v-if="dialogShow" @show="isShow" @refresh="refresh" />
      <project-update v-else :project="project" :old_code="old_code" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import CommonTitle from '@/components/CommonTitle'
import projectCreate from './components/projectCreate'
import projectUpdate from './components/projectUpdate'
import { saveAs } from 'file-saver'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    CommonTitle,
    projectCreate,
    projectUpdate
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
      project: {},
      project_ids: [],
      datas: [],
      old_code: null,
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
    this.updatePermission = checkPermission(['ns://update_project@lego.project'])
    this.removePermission = checkPermission(['ns://remove_project@lego.project'])
    this.viewPermission = checkPermission(['ns://view_project@lego.project'])
  },
  methods: {
    checkPermission,
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
      this.loading = true
      this.$Apis.project.project_list(this.text, this.pagination.page, this.page_size, true).then(response => {
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
      this.$Apis.project.project_list(this.text, this.pagination.page, this.page_size, true).then(response => {
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
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = true
      this.dialogTitle = '新建业务'
    },
    project_update(proj_code) {
      this.$Apis.project.project_info(proj_code).then(response => {
        this.project = response.payload
        this.old_code = this.project.proj_code
        this.dialogVisible = !this.dialogVisible
        this.dialogShow = false
        this.dialogTitle = '更新业务'
      })
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    project_info(proj_code, proj_name) {
      this.set_session()
      sessionStorage.removeItem('bizLabel')
      this.$router.push({ name: 'project_bizclass', query: { name: proj_name, proj_code: proj_code }})
    },
    project_delete(proj_code) {
      this.$confirm('是否删除该项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.project.project_delete(proj_code).then(response => {
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
    project_deletes() {
      if (JSON.stringify(this.project_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.project.project_delete(this.project_ids).then(response => {
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
      this.project_ids = []
      val.forEach(element => {
        this.project_ids.push(element.proj_code)
      })
    },
    download() {
      this.$Apis.project.project_download(this.project_ids).then(response => {
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
                  saveAs(blob, '项目备份.zip')
                } else {
                  fileDownload(blob, '项目备份.zip')
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
            fileDownload(data, 'project.json')
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
                    that.$Apis.project.project_upload(datas).then(response => {
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
          that.$Apis.project.project_upload(that.datas).then(response => {
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
