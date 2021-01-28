<template>
  <div class="generateform-box" v-if="show">
    <fm-generate-form
      ref="generateForm"
      v-if="fmshow"
      :data="jsonData"
      :remote="remoteFuncs"
      :value="editData"
      :edit="edit"
      :design-fields="designFields"
      @handle-submit="handleSubmit"
      @handle-back="handleReset"
    />
  </div>
</template>
<script>
  export default {
    props: {
      edit: {
        type: Boolean,
        default: true
      },
      object_id: {
        type: String,
        default: null
      },
      objid: {
        type: String,
        default: null
      },
      mtd_id: {
        type: String,
        default: null
      },
      page_id: {
        type: String,
        default: undefined
      }
    },
    data() {
      const that = this

      return {
        jsonData: {},
        editData: {},
        design_form: null,
        headersAll: [],
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
        show: false,
        fmshow: false,
        designFields: [],
        mtd_code: undefined
      }
    },
    computed: {
      design() {
        const { design_form, headersAll } = this

        return {
          design_form,
          headersAll
        }
      }
    },
    watch: {
      design: {
        handler(val) {
          if (val.headersAll.length > 0 && val.design_form) {
            const design_form = JSON.parse(val.design_form)
            const designFields = []

            val.headersAll.forEach(item => {
              if (item.is_object && item.object_form) {
                designFields.push(item)
              }
            })
            this.designFields = designFields
            this.jsonData = design_form
            this.show = true
          }
        }
      }
    },
    created() {
      if (this.mtd_id) {
        this.get_method_design()
      } else {
        this.get_object_design()
      }
    },
    methods: {
      fetchDate() {
        this.$Apis.object.data_info(this.object_id, this.objid, this.mtd_code, this.page_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.editData = response.payload
            this.fmshow = true
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
        this.$Apis.object.get_headers(this.object_id, true).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.headersAll = response.payload
          }
        })

      },
      get_method_design() {
        this.$Apis.object.method_info(this.mtd_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            const method = response.payload

            this.mtd_code = method.operate_code
            if (method.operate_type === 3) {
              this.design_form = method.design_form
              this.fetchDate()
            } else {
              this.get_object_design()
            }
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      },
      get_object_design() {
        this.$Apis.object.get_object_design_by_id(this.object_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.design_form = response.payload
            this.fetchDate()
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      },
      handleSubmit() {
        this.$refs.generateForm.getData().then(data => {
          this.$refs.generateForm.loading = true
          this.$Apis.object.data_update(this.object_id, this.objid, data, this.mtd_code, this.page_id)
            .then(response => {
              if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                this.$alert(response.message, '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$emit('refresh')
                    this.handleReset()
                  }
                })
              } else {
                this.$alert(response.message, '提示', {
                  confirmButtonText: '确定'
                })
              }
              this.$refs.generateForm.loading = false
            })
            .catch(() => {
              this.$refs.generateForm.loading = false
            })
        }).catch((e) => {
          this.$message.error(e)
        })
      },
      handleReset() {
        this.$emit('show')
      }
    }
  }
</script>
