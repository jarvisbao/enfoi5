<template>
  <div>
    <van-sticky>
      <van-nav-bar
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      >
        <template #right>
          <div v-if="edit && !showRecord" :class="{'disable': !flag}" @click="handleSubmit">
            提交
          </div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="generateform-box" v-if="show">
      <generate-form-mobile ref="generateForm" v-if="fmshow" :data="jsonData" :remote="remoteFuncs" :value="editData" :edit="edit" :design-fields="designFields" />
      <div class="handle-btn el-form submit-btn" v-if="edit && showRecord">
        <van-button id="submit" :disabled="!flag" color="#158bf1" round @click="handleSubmit">
          立即修改
        </van-button>
      </div>
    </div>
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
      show: false,
      fmshow: false,
      designFields: [],
      objid: null,
      showRecord: false,
      flag: true
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
    this.object_id = this.$route.query.object_id ? this.$route.query.object_id : null
    this.showRecord = this.$route.query.record ? JSON.parse(this.$route.query.record) : false
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
    fetchDate() {
      this.objid = this.$route.query.objid ? this.$route.query.objid : null
      this.$Apis.object.data_info(this.object_id, this.objid, this.mtd_id).then(response => {
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
      if (this.mtd_id) {
        this.get_method_design()
      } else {
        this.get_object_design()
      }
    },
    get_method_design() {
      this.$Apis.object.get_method_design_by_id(this.mtd_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          if (response.payload) {
            this.design_form = response.payload
          } else {
            this.get_object_design()
          }
        } else {
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    get_object_design() {
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
      if (this.flag) {
        this.$refs.generateForm.getData().then(data => {
          this.$Apis.object.data_update(this.object_id, this.objid, data, this.mtd_id).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$dialog.alert({
                message: response.message
              }).then(() => {
                this.onClickLeft()
              })
            } else {
              this.$dialog.alert({
                message: response.message
              }).then(() => {
                this.flag = true
              })
            }
          })
        }).catch(e => {
          // 数据校验失败
          this.$dialog.alert({
            message: e
          }).then(() => {
            this.flag = true
          })
        })
      }
      this.$nextTick(() => {
        this.flag = false
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
