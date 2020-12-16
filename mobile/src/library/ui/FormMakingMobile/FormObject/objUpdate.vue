<template>
  <div>
    <van-nav-bar
      left-text="返回"
      left-arrow
      @click-left="handleReset"
    >
      <template slot="right">
        <span @click="handleSubmit">确定</span>
      </template>
    </van-nav-bar>
    <div class="generateform-box" v-if="show">
      <generate-form-mobile ref="generateForm" v-if="fmshow" :data="jsonData" :remote="remoteFuncs" :value="editData" :edit="edit" :design-fields="designFields" />
    </div>
    <overlay-loading :show="showOverlay" :text="loadingText" />
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
      showOverlay: false,
      loadingText: null,
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
          this.$dialog.alert({
            message: response.message
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
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    handleSubmit() {
      this.$refs.generateForm.getData().then(data => {
        this.showOverlay = true
        this.loadingText = '提交中...'
        this.$Apis.object.data_update(this.object_id, this.objid, data, this.mtd_code, this.page_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.showOverlay = false
            this.loadingText = null
            this.$dialog.alert({
              message: response.message
            }).then(() => {
              this.$emit('refresh')
              this.handleReset()
            })
          } else {
            this.showOverlay = false
            this.loadingText = null
            this.$dialog.alert({
              message: response.message
            })
          }
        })
      }).catch(e => {
        // 数据校验失败
      })
    },
    handleReset() {
      this.$emit('show')
    }
  }
}
</script>
<style lang="scss" scoped>
.generateform-box {
  max-height: calc(100vh - 46px);
  overflow-y: auto;
}
</style>
