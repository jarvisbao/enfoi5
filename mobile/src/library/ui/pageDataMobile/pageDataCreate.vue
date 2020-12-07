<template>
  <div class="generateform-box">
    <van-sticky>
      <van-nav-bar
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      >
        <template #right>
          <div :class="{'disable': !flag}" @click="handleSubmit">
            提交
          </div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <generate-form-mobile ref="generateForm" v-if="show" :data="jsonData" :remote="remoteFuncs" :design-fields="designFields" />
    <!-- <div class="submit-btn">
      <van-button id="submit" :loading="$store.state.app.loading" color="#158bf1" round @click="handleSubmit">
        立即添加
      </van-button>
    </div> -->
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
        return null
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
      if (this.flag) {
        this.pntfk = this.$route.query.pntfk ? this.$route.query.pntfk : null
        this.pntid = this.$route.query.pntid ? this.$route.query.pntid : null
        this.mtd_id = this.$route.query.mtd_id ? this.$route.query.mtd_id : null
        this.$refs.generateForm.getData().then(data => {
          this.$Apis.object.data_create(this.object_id, data, this.mtd_id, this.pntfk, this.pntid).then(response => {
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
