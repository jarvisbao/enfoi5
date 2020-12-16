<template>
  <div>
    <van-sticky>
      <van-nav-bar
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      >
        <template #right>
          <div v-if="edit && !showRecord" @click="handleSubmit">
            提交
          </div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="generateform-box" v-if="show">
      <generate-form-mobile ref="generateForm" v-if="fmshow" :data="jsonData" :remote="remoteFuncs" :value="editData" :edit="edit" :design-fields="designFields" />
      <div class="handle-btn el-form submit-btn" v-if="edit && showRecord">
        <van-button id="submit" color="#158bf1" round @click="handleSubmit">
          立即修改
        </van-button>
      </div>
    </div>
    <overlay-loading :show="showOverlay" :text="loadingText" />
  </div>
</template>
<script>
import Vue from 'vue'
const request = Vue.prototype.$Utils.request
export default {
  props: {
    edit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      jsonData: {},
      editData: {},
      design_form: null,
      headersAll: [],
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
      showRecord: false,
      showOverlay: false,
      loadingText: null
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
    this.mtd_id = this.$route.query.mtd_id ? this.$route.query.mtd_id : null
    this.page_id = this.$route.query.page_id ? this.$route.query.page_id : undefined
    this.object_id = this.$route.query.object_id ? this.$route.query.object_id : null
    this.showRecord = this.$route.query.record ? JSON.parse(this.$route.query.record) : false
    if (this.mtd_id) {
      this.get_method_design()
    } else {
      this.get_object_design()
    }
  },
  mounted() {
    // 设置底部标签栏状态为 false
    this.$store.commit('SET_TABBAR', false)
  },
  destroyed() {
    this.$store.commit('SET_TABBAR', true)
  },
  methods: {
    fetchDate() {
      this.objid = this.$route.query.objid ? this.$route.query.objid : null
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
              this.onClickLeft()
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
        this.$toast(e)
      })
    },
    onClickLeft() {
      // this.$refs.generateForm.reset()
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.submit-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 20px 0 10px;
  padding: 0 16px;
  .van-button {
    width: 100%;
  }
}
</style>
