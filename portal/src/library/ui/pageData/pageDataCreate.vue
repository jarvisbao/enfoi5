<template>
  <div class="app-container">
    <div class="generateform-box" v-if="show">
      <fm-generate-form
        ref="generateForm"
        :data="jsonData"
        :remote="remoteFuncs"
        :design-fields="designFields"
        @handle-submit="handleSubmit"
        @handle-back="handleReset"
      />
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  const request = Vue.prototype.$Utils.request

  export default {
    data() {
      return {
        jsonData: {},
        object_id: null,
        page_id: undefined,
        design_form: null,
        headersAll: [],
        show: false,
        designFields: [],
        pntfk: null,
        pntid: null,
        mtd_id: null,
        inIframe: false,
        mtd_code: undefined,
        remoteFuncs: {
          remote_http_get(uri, body) {
            if (uri) {
              return request({
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
              return request({
                url: uri,
                method: 'post',
                data: body
              })
            } else {
              return new Promise((resolve, reject) => {
                resolve()
              })
            }
          }
        }
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
            this.jsonData = design_form
            this.show = true
          }
        }
      }
    },
    created() {
      if (self.frameElement && self.frameElement.tagName === 'IFRAME') {
        this.inIframe = true
      }
      this.get_object_id()
      this.fetchDate()
    },
    methods: {
      get_object_id() {
        if ('object_id' in this.$route.query) {
          this.object_id = this.$route.query.object_id
          return this.object_id
        } else {
          return undefined
        }
      },
      fetchDate() {
        this.$Apis.object.get_headers(this.object_id, true).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.headersAll = response.payload
          }
        })
        this.$Apis.object.get_object_design_by_id(this.object_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.design_form = response.payload
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      },
      handleSubmit() {
        this.pntfk = this.$route.query.pntfk ? this.$route.query.pntfk : null
        this.pntid = this.$route.query.pntid ? this.$route.query.pntid : null
        this.mtd_code = this.$route.query.mtd_code ? this.$route.query.mtd_code : undefined
        this.$refs.generateForm.getData().then(data => {
          this.$refs.generateForm.loading = true // 设置按钮loading状态
          this.$Apis.object.data_create(this.object_id, data, this.mtd_code, this.pntfk, this.pntid, this.page_id)
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
        if (this.inIframe) {
          parent.postMessage({ msg: 'closeDialog' }, '*')
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

