<template>
  <div class="app-container">
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
      <generate-form-mobile ref="generateForm" :data="jsonData" :remote="remoteFuncs" :design-fields="designFields" />
    </div>
    <overlay-loading :show="showOverlay" :text="loadingText" />
  </div>
</template>
<script>
export default {
  props: {
    object_id: {
      type: String,
      default: null
    },
    pntfk: {
      type: String,
      default: null
    },
    pntid: {
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
      },
      page_id: undefined,
      design_form: null,
      headersAll: [],
      show: false,
      designFields: [],
      mtd_id: null,
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
    this.fetchDate()
  },
  methods: {
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
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    handleSubmit() {
      this.mtd_code = this.$route.query.mtd_code ? this.$route.query.mtd_code : undefined
      this.$refs.generateForm.getData().then(data => {
        this.showOverlay = true
        this.loadingText = '提交中...'
        this.$Apis.object.data_create(this.object_id, data, this.mtd_code, this.pntfk, this.pntid, this.page_id).then(response => {
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
