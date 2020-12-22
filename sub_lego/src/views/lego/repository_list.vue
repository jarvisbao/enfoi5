<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_repository@lego.repository']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="repository_deletes">
        删除所选
      </div>
      <!--      <div v-permission="['ns://create_orm@lego.repository']" class="btn" @click="create_orm">生成orm</div>-->
      <div v-permission="['ns://upload_repository@lego.repository']" class="btn export-btn" @click="download">
        导出
      </div>
      <el-upload
        :show-file-list="false"
        :auto-upload="false"
        :on-change="Upload"
        action=""
        class="upload-demo"
      >
        <el-button v-permission="['ns://download_repository@lego.repository']" size="small" type="primary" class="btn import-btn">
          导入
        </el-button>
      </el-upload>
      <el-tooltip class="item" effect="dark" :content="autoOrm ? 'ORM 自动生成' : '不自动生成ORM'" placement="top-start">
        <el-switch v-model="autoOrm" :width="55" class="switch-orm" @change="changeAutoOrm" />
      </el-tooltip>
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
        prop="name"
        label="仓库名称"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="dburi"
        label="仓库连接的URI"
        show-overflow-tooltip
      />
      <el-table-column
        prop="options"
        label="连接参数"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.options }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="130"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="repository_update(scope.row.name)" />
          <i v-if="viewPermission" class="el-icon-view" @click="repository_info(scope.row.name)" />
          <i v-if="removePermission" class="el-icon-delete" @click="repository_delete(scope.row.name)" />
          <el-dropdown trigger="click">
            <span class="el-dropdown-link"><i class="el-icon-circle-plus-outline" /></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div id="test" @click="repository_test(scope.row.repo_id)">
                  测试
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div v-if="reflectPermission" id="reflect" @click="repository_reflect(scope.row.name)">
                  反射
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div v-if="mapPermission" id="map" @click="repository_map(scope.row.name)">
                  映射
                </div>
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
      <repository-create v-if="dialogShow" @show="isShow" @refresh="refresh" />
      <repository-update v-else :repository="repository" :old_name="old_name" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import CommonTitle from '@/components/CommonTitle'
import repositoryCreate from './components/repositoryCreate'
import repositoryUpdate from './components/repositoryUpdate'
import { saveAs } from 'file-saver'
import { instance as Vue } from '@/life-cycle'
import { mapGetters } from 'vuex'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    CommonTitle,
    repositoryCreate,
    repositoryUpdate
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
      repository: {},
      repos: [],
      datas: [],
      updatePermission: false,
      viewPermission: false,
      removePermission: false,
      reflectPermission: false,
      old_name: null,
      mapPermission: false,
      autoOrm: true
    }
  },
  computed: {
    ...mapGetters([
      'auto_orm'
    ])
  },
  watch: {
    'pagination.total': function(val) {
      if (this.pagination.total === (this.pagination.page - 1) * this.page_size && this.pagination.total !== 0) {
        this.pagination.page -= 1
        this.fetchData()
      }
    },
    auto_orm: {
      handler(val) {
        this.autoOrm = val
      }
    }
  },
  created() {
    this.autoOrm = this.auto_orm
    this.get_page_params()
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_repository@lego.repository'])
    this.viewPermission = checkPermission(['ns://view_repository@lego.repository'])
    this.removePermission = checkPermission(['ns://remove_repository@lego.repository'])
    this.reflectPermission = checkPermission(['ns://reflect_repository@lego.repository'])
    this.mapPermission = checkPermission(['ns://map_repository@lego.repository'])
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
      this.$Apis.repository.repository_list(this.text, this.pagination.page, this.page_size, true).then(response => {
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
      this.$Apis.repository.get_auto_orm().then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          let result = response.payload
          this.$store.commit('SET_AUTO_ORM', result)
        }
      })
    },
    operateData() {
      this.loading = true
      this.$Apis.repository.repository_list(this.text, this.pagination.page, this.page_size, true).then(response => {
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
      this.dialogTitle = '新键数据仓库'
      this.dialogShow = true
    },
    handleSelectionChange(val) {
      this.repos = []
      val.forEach(element => {
        this.repos.push(element.name)
      })
    },
    create_orm() {
      this.$Apis.repository.create_orm(this.repos).then(response => {
        this.$alert(response.message, '提示', {
          confirmButtonText: '确定'
        })
      })
    },
    repository_update(name) {
      this.$Apis.repository.repository_info(name).then(response => {
        this.repository = response.payload
        this.old_name = name
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '更新数据仓库'
        this.dialogShow = false
      })
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    repository_info(name) {
      this.set_session()
      sessionStorage.removeItem('repoLabel')
      this.$router.push({ name: 'repository_info', query: { name: name }})
    },
    repository_delete(name) {
      this.$confirm('是否删除该数据仓库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.repository.repository_delete(name).then(response => {
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
    repository_deletes() {
      if (JSON.stringify(this.repos) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选数据仓库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.repository.repository_delete(this.repos).then(response => {
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
    repository_test(repo_id) {
      this.$Apis.repository.repository_test(repo_id).then(response => {
        if (response.payload === 'True') {
          this.$alert('连接成功', '提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.$alert('连接失败', '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    repository_reflect(name) {
      this.$Apis.repository.repository_reflect(name).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    repository_map(name) {
      this.$Apis.repository.repository_map(name).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    download() {
      this.$Apis.repository.repository_download(this.repos).then(response => {
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
                  saveAs(blob, '仓库备份.zip')
                } else {
                  fileDownload(blob, '仓库备份.zip')
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
            fileDownload(data, 'repository.json')
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
                    that.$Apis.repository.repository_upload(datas).then(response => {
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
          that.$Apis.repository.repository_upload(that.datas).then(response => {
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
    changeAutoOrm(val) {
      this.$store.dispatch('SetAutoOrm', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  & /deep/ .line {
    text-align: center;
    font-size: 16px;
  }
  & /deep/ .dispaly-flex {
    position: relative;
    display: flex;
    margin-bottom: 8px;
    .flex-item {
      flex: 1;
    }
    .action {
      position: absolute;
      right: -80px;
      width: 70px;
      font-size: 24px;
      i {
        margin: 0 3px;
        cursor: pointer;
        color: #b6b6b6;
        &:hover {
          color: #ea2323;
        }
      }
    }
  }
}
.switch-orm {
  & /deep/ .el-switch__core {
    height: 28px;
    border-radius: 20px;
    &::after {
      width: 24px;
      height: 24px;
    }
  }
}
/deep/ .el-switch.is-checked .el-switch__core::after {
  margin-left: -25px;
}
</style>
