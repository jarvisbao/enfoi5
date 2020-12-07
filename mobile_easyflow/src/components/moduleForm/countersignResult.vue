<template>
  <div class="countersign-result">
    <van-form ref="form" :model="form">
      <van-field v-model="form.agree" :disabled="isDisabled" name="agree" label="同意票数" />
      <van-field v-model="form.against" :disabled="isDisabled" name="against" label="反对票数" />
      <van-field v-model="form.waiver" :disabled="isDisabled" name="waiver" label="弃权票数" />
      <van-field :disabled="isDisabled" name="result" label="投票结果">
        <template #input>
          <van-radio-group v-model="form.result" :disabled="isDisabled" direction="horizontal">
            <van-radio :name="true">
              通过
            </van-radio>
            <van-radio :name="false">
              否决
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-model="form.message" :disabled="isDisabled" name="message" label="结果评论" row="3" autosize type="textarea" />
    </van-form>
  </div>
</template>
<script>
export default {
  name: 'countersign_result',
  label: '会签结果表单',
  props: {
    moduleInit: { // 父组件传下来的默认参数供子组件调用
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    formValue: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        agree: null,
        against: null,
        waiver: null,
        result: false,
        message: null
      },
      dataValid: false,
      isDisabled: false
    }
  },
  created() {
    if (this.isEdit) {
      this.moduleInit.deal_or_view = true
      this.isDisabled = false
    } else {
      this.moduleInit.deal_or_view = false
      this.isDisabled = true
      this.form = this.formValue
    }
  },
  methods: {
    valid() {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate().then(() => {
          this.dataValid = true
          resolve(this.dataValid)
        }).catch(() => {
          this.dataValid = false
          resolve(this.dataValid)
        })
      })
    },
    get_data() {
      if (this.dataValid) {
        this.$emit('get_data', this.form)
      }
    }
  }
}
</script>
