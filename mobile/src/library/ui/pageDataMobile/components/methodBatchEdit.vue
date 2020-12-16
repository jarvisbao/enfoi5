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
    <van-form ref="form" v-if="data.length > 0" :model="classColumn" label-width="120px">
      <template v-for="(item,index) in data">
        <div :key="index">
          <template v-if="['Date','DateTime'].indexOf(item.type) > -1">
            <van-field
              readonly
              :clickable="!item.isview"
              :name="item.prop"
              :value="item.value"
              :label="item.label"
              placeholder="点击选择时间"
              @click="handlePicker(index)"
            />
            <van-popup v-model="showPicker" position="bottom">
              <van-datetime-picker
                type="date"
                @confirm="onConfirm"
                @cancel="showPicker = false"
              />
            </van-popup>
          </template>
          <van-field v-else :name="item.prop" :label="item.label" :value="item.value" :disabled="item.isview" />
        </div>
      </template>
    </van-form>
    <div v-else>
      <generate-form-mobile ref="generateForm" v-if="fmshow" :data="design_form" :remote="remoteFuncs" :design-fields="batchData" />
    </div>
  </div>
</template>
<script>
import fecha from '@/library/js/date'

export default {
  name: 'MethodBatchEdit',
  props: {
    batchData: {
      type: Array,
      default: () => []
    },
    ids: {
      type: Array,
      default: () => []
    },
    isAll: {
      type: Boolean,
      default: false
    },
    object_id: {
      type: String,
      default: ''
    },
    mtd_id: {
      type: String,
      default: ''
    },
    page_id: {
      type: String,
      default: undefined
    }
  },
  data() {
    const that = this
    return {
      classColumn: {},
      loading: false,
      show: true,
      design_form: null,
      data: [],
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
      fmshow: false,
      // styleObject: null,
      showPicker: false,
      newIndex: null,
      mtd_code: undefined
    }
  },
  created() {
    this.data = this.batchData.filter(item => {
      return item.isview || item.isedit
    })
    if (this.data.length < 1) {
      this.get_method_design()
    }
  },
  methods: {
    get_method_design() {
      this.$Apis.object.method_info(this.mtd_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const method = response.payload
          this.mtd_code = method.operate_code
          if (method.operate_type === 3) {
            this.design_form = method.design_form
            if (this.design_form) {
              this.fmshow = true
              // this.styleObject = {
              //   paddingLeft: this.design_form.config.labelWidth + 'px'
              // }
            }
          }
        } else {
          this.$dialot.alert({
            message: response.message
          })
        }
      })
    },
    handleSubmit() {
      if (this.data.length > 0) {
        this.batchData.forEach(element => {
          if (element.isedit) {
            this.classColumn[element['prop']] = element['value']
          }
        })
        let ids = null
        if (this.isAll) {
          ids = {}
        } else {
          ids = this.ids.join(',')
        }
        this.$Apis.object.data_update(this.object_id, ids, this.classColumn, this.mtd_code, this.page_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.$dialog.alert({
              message: response.message
            }).then(() => {
              this.$emit('refresh')
              this.$emit('show')
            })
          } else {
            this.$dialot.alert({
              message: response.message
            })
          }
        })
      } else {
        this.$refs.generateForm.getData().then(data => {
          this.loading = true
          let ids = null
          if (this.isAll) {
            ids = {}
          } else {
            ids = this.ids.join(',')
          }
          this.$Apis.object.data_update(this.object_id, ids, data, this.mtd_code, this.page_id).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$dialog.alert({
                message: response.message
              }).then(() => {
                this.handleReset()
                this.$emit('refresh')
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
          this.loading = false
        }).catch(e => {
          // 数据校验失败
          this.$dialot.alert({
            message: e
          })
        })
      }
    },
    handleReset() {
      this.$emit('show')
    },
    handlePicker(index) {
      this.showPicker = true
      this.newIndex = index
    },
    onConfirm(value) {
      this.showPicker = false
      this.data[this.newIndex].value = fecha.format(new Date(value), 'yyyy-MM-dd')
    }
  }
}
</script>
