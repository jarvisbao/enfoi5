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
export default {
  props: {
    isModule: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const that = this
    return {
      jsonData: {},
      design_form: null,
      headersAll: [],
      designFields: [],
      object_id: null,
      mtd_id: null,
      mtd_code: undefined,
      show: false,
      inIframe: false,
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
    if (this.isModule) {
      this.object_id = this.params.object_id
      this.mtd_id = this.params.mtd_id
    } else {
      this.object_id = this.$route.query.object_id ? this.$route.query.object_id : null
      this.mtd_id = this.$route.query.mtd_id ? this.$route.query.mtd_id : null
    }
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$Apis.object.get_headers(this.object_id, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headersAll = response.payload
        }
      })
      this.$Apis.object.method_info(this.mtd_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.design_form = response.payload.design_form
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
        this.$Apis.object.data_create(this.object_id, data, this.mtd_code, this.pntfk, this.pntid, this.page_id).then(response => {
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
        })
        .catch(() => {})
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
