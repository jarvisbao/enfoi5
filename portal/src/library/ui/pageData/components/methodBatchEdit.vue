<template>
  <div>
    <el-form ref="form" v-if="data.length > 0" :model="classColumn" label-width="120px">
      <el-form-item
        v-for="(item,index) in data"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
        <el-col v-if="['Date','DateTime'].indexOf(item.type) > -1">
          <el-date-picker v-model="item.value" type="date" placeholder="选择日期" style="width: 100%;" value-format="yyyy-MM-dd" :disabled="item.isview" />
        </el-col>
        <el-input v-else v-model="item.value" :disabled="item.isview" />
      </el-form-item>
      <el-form-item v-show="show">
        <el-button :loading="loading" type="danger" @click="submitForm('form')">
          立即修改
        </el-button>
        <el-button plain @click="resetForm('form')">
          取消
        </el-button>
      </el-form-item>
    </el-form>
    <div v-else>
      <fm-generate-form
        ref="generateForm"
        v-if="fmshow"
        :data="design_form"
        :remote="remoteFuncs"
        :value="editData"
        :design-fields="batchData"
        @handle-submit="handleSubmit"
        @handle-back="handleReset"
      />
    </div>
  </div>
</template>
<script>

export default {
  name: 'MethodBatchEdit',
  props: {
    batchData: {
      type: Array,
      default: () => []
    },
    ids: {
      type: Array,
      default: () => []
    },
    isAll: {
      type: Boolean,
      default: false
    },
    object_id: {
      type: String,
      default: ''
    },
    mtd_id: {
      type: String,
      default: ''
    },
    page_id: {
      type: String,
      default: undefined
    },
    reloadUri: {
      type: String,
      default: null
    }
  },
  data() {
    const that = this
    return {
      classColumn: {},
      loading: false,
      show: true,
      design_form: null,
      data: [],
      remoteFuncs: {
        remote_http_get(uri, body) {
          if (uri) {
            return that.$Utils.request({
              url: uri,
              method: 'get',
              params: body
            })
          } else {
            return new Promise((resolve, reject) => {
              resolve()
            })
          }
        },
        remote_http_post(uri, body) {
          if (uri) {
            return that.$Utils.request({
              url: uri,
              method: 'get',
              params: body
            })
          } else {
            return new Promise((resolve, reject) => {
              resolve()
            })
          }
        }
      },
      fmshow: false,
      mtd_code: undefined,
      editData: {}
    }
  },
  created() {
    this.data = this.batchData.filter(item => {
      return item.isview || item.isedit
    })
    if (this.data.length < 1) {
      this.get_method_design()
    }
  },
  methods: {
    get_method_design() {
      this.$Apis.object.method_info(this.mtd_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const method = response.payload
          this.mtd_code = method.operate_code
          if (method.operate_type === 3 || method.operate_type === 2) {
            this.design_form = JSON.parse(method.design_form)
          }
          this.$Apis.object.data_info(this.object_id, this.ids, this.mtd_code, this.page_id).then(data => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.editData = data.payload
              this.fmshow = true
            }
          })
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.batchData.forEach(element => {
            if (element.isedit) {
              this.classColumn[element['prop']] = element['value']
            }
          })
          let ids = null
          if (this.isAll) {
            ids = {}
          } else {
            ids = this.ids.join(',')
          }
          if (this.reloadUri) {
            this.$Utils.request({
              url: this.reloadUri,
              methods: 'post',
              data: {
                object_id: this.object_id,
                ids: ids,
                fields: this.classColumn,
                mtd_code: this.mtd_code,
                page_id: this.page_id
              }
            }).then(response => {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  this.$emit('refresh')
                }
              })
            })
            return
          }
          this.$Apis.object.data_update(this.object_id, ids, this.classColumn, this.mtd_code, this.page_id).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  this.$emit('refresh')
                }
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
          this.loading = false
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$emit('show')
    },
    handleSubmit() {
      this.$refs.generateForm.getData().then(data => {
        this.$refs.generateForm.loading = true
        let ids = null
        if (this.isAll) {
          ids = {}
        } else {
          ids = this.ids.join(',')
        }
        if (this.reloadUri) {
          this.$Utils.request({
            url: this.reloadUri,
            method: 'post',
            data: {
              object_id: this.object_id,
              ids: ids,
              fields: data,
              mtd_code: this.mtd_code,
              page_id: this.page_id
            }
          }).then(response => {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.resetForm('form')
                this.$emit('refresh')
              }
            })
          })
          return
        }
        this.$Apis.object.data_update(this.object_id, ids, data, this.mtd_code, this.page_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.handleReset()
                this.$emit('refresh')
              }
            })
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
        this.$refs.generateForm.loading = false
      }).catch(e => {
        // 数据校验失败
        this.$alert(e, '提示', {
          confirmButtonText: '确定'
        })
      })
    },
    handleReset() {
      this.$emit('show')
    }
  }
}
</script>
