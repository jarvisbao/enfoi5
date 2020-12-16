<template>
  <div class="generateform-box">
    <van-sticky>
      <van-nav-bar
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      >
        <template #right>
          <div @click="handleSubmit">
            提交
          </div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <generate-form-mobile ref="generateForm" v-if="show" :data="jsonData" :remote="remoteFuncs" :design-fields="designFields" />
    <overlay-loading :show="showOverlay" :text="loadingText" />
  </div>
</template>
<script>
import Vue from 'vue'
const request = Vue.prototype.$Utils.request
export default {
  data() {
    return {
      jsonData: {},
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
      },
      object_id: null,
      page_id: null,
      design_form: null,
      headersAll: [],
      show: false,
      designFields: [],
      pntfk: null,
      pntid: null,
      mtd_id: null,
      page_id: undefined,
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
          this.designFields = val.headersAll
          this.jsonData = design_form
          this.show = true
        }
      }
    }
  },
  created() {
    this.get_object_id()
    this.fetchDate()
  },
  mounted() {
    // 设置底部标签栏状态为 false
    this.$store.commit('SET_TABBAR', false)
  },
  destroyed() {
    this.$store.commit('SET_TABBAR', true)
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
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    handleSubmit() {
      this.pntfk = this.$route.query.pntfk ? this.$route.query.pntfk : null
      this.pntid = this.$route.query.pntid ? this.$route.query.pntid : null
      this.mtd_code = this.$route.query.mtd_code ? this.$route.query.mtd_code : undefined
      this.page_id = this.$route.query.page_id ? this.$route.query.page_id : undefined
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
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.submit-btn {
  margin: 20px 16px 40px;
  .van-button {
    width: 100%;
  }
}
.disable {
  color: #969696;
}
</style>
