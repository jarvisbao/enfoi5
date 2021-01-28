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
        object_id: null,
        mtd_id: null,
        mtd_code: undefined,
        page_id: undefined,
        show: false,
        fmshow: false,
        designFields: [],
        objid: null,
        inIframe: false,
        reloadUri: null
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

            this.designFields = val.headersAll
            if (design_form) {
              this.jsonData = design_form
              this.show = true
            }
          }
        }
      }
    },
    created() {
      if (self.frameElement && self.frameElement.tagName === 'IFRAME') {
        this.inIframe = true
      }
      this.mtd_id = this.$route.query.mtd_id ? this.$route.query.mtd_id : null
      this.get_object_id()
      if (this.mtd_id) {
        this.get_method_design()
      } else {
        this.get_object_design()
      }
    },
    methods: {
      get_object_id() {
        if ('object_id' in this.$route.query) {
          this.object_id = this.$route.query.object_id
          return this.object_id
        } else {
          return null
        }
      },
      fetchDate() {
        this.objid = this.$route.query.objid ? this.$route.query.objid : null
        this.page_id = this.$route.query.page_id ? this.$route.query.page_id : undefined
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
              this.reloadUri = method.uri
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
          if (this.reloadUri) {
            this.$Utils.request({
              url: this.reloadUri,
              method: 'post',
              data: {
                object_id: this.object_id,
                ids: this.objid,
                fields: data,
                mtd_code: this.mtd_code,
                page_id: this.page_id
              }
            }).then(response => {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.handleReset()
                }
              })
              this.$refs.generateForm = false
            })
            return
          }
          this.$Apis.object.data_update(this.object_id, this.objid, data, this.mtd_code, this.page_id)
            .then(response => {
              if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                this.$alert(response.message, '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.handleReset()
                  }
                })
              } else {
                this.$alert(response.message, '提示', {
                  confirmButtonText: '确定'
                })
              }
              this.$refs.generateForm = false
            })
            .catch(() => {
              this.$refs.generateForm.loading = false
            })
        })
      },
      handleReset() {
        // this.$refs.generateForm.reset()
        if (this.inIframe) {
          parent.postMessage({ msg: 'closeDialog' }, '*')
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

