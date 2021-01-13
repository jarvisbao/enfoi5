<template>
  <div>
    <el-form ref="form" :model="repository" :rules="rules" label-width="130px">
      <el-form-item label="仓库连接的URI" prop="db_uri">
        <el-input id="dbUri" v-model="repository.db_uri" />
      </el-form-item>
      <el-form-item label="仓库名称" prop="name">
        <el-input id="repoName" v-model="repository.name" />
      </el-form-item>
      <el-form-item label="连接参数" prop="options">
        <el-input id="repOptions" v-model="repository.options" type="textarea" />
        <div class="tips">
          请填写json格式的数据
        </div>
      </el-form-item>
      <el-form-item label="验证参数" prop="validation">
        <el-input id="repValidation" v-model="repository.validation" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即添加
        </el-button>
        <el-button id="cancel" plain @click="resetForm('form')">
          取消
        </el-button>
        <div class="red-error" v-if="submitFailed">
          <i class="el-icon-error" />&nbsp;{{ submitErrMsg }}，添加失败，请重试
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { instance as Vue } from '@/life-cycle'
const isJSON = Vue.$Utils.validate.isJSON

export default {
  data() {
    var validateJson = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!isJSON(value)) {
        callback(new Error('请输入正确的json格式!'))
      } else {
        callback()
      }
    }

    return {
      repository: {
        db_uri: null,
        name: null,
        options: null,
        validation: null //表单中双向绑定的参数：额外参数
      },
      rules: {
        db_uri: [{
          required: true,
          message: '请输入仓库连接的URI',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入仓库名称',
          trigger: 'blur'
        }],
        options: [{
          validator: validateJson,
          trigger: 'blur'
        }]
      },
      loading: false, // 提交请求的状态（按钮动画效果），加载状态为true，加载结束为false
      submitFailed: false, // 提交状态，判断是否提交失败，失败为true，成功为false，默认:false
      submitErrMsg: '' // 提交的错误信息，默认：'',类型：String
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const db_uri = this.repository.db_uri
          const name = this.repository.name
          var options = this.repository.options,
            validation = this.repository.validation

          if (options && options !== 'null') {
            options = JSON.parse(this.repository.options)
          } else if (options === 'null' || !options) {
            options = {}
          }
          this.$Apis.repository.repository_create(db_uri, name, options, validation)
            .then(response => {
              if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) { //响应正常
                // 初始化提交请求的状态和提交状态
                this.loading = false
                this.submitFailed = false
                this.$alert('新建成功!', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.resetForm('form')
                    this.$emit('refresh')
                  }
                })
              } else {
                this.$alert(response.message, '提示', {
                  confirmButtonText: '提示',
                  callback: action => {
                    // 初始化提交请求的状态和提交状态
                    this.loading = false
                    this.submitFailed = false
                  }
                })
              }
            })
            .catch(err => { // 若响应发生错误,提交按钮下显示提示信息
              const Constlib = this.$Utils.Constlib, // 常量库
                code = err.response.data.code ? err.response.data.code :
                0, // 获取响应状态码，若没有状态码属性或影响格式不正确，设置为0，类型：Number

                /**
                 * @description 判断网络错误类型
                 * @param networkCode 服务器响应数据中的code属性，默认：0，类型：Number
                 * @returns 返回对应错误代码的提示信息，类型：String
                 */
                // 判断网络错误类型，返回对应类型提示信息
                networkErrorType = (networkCode = 0) => {
                  for (var k in Constlib) {
                    if (Constlib[k] == networkCode) {
                      return Constlib.ErrorMessage[k]
                    }
                  }
                  return '未知错误'
                }

              if (code) { //判断code属性是否存在
                this.submitErrMsg = networkErrorType(code)
              } else {
                this.submitErrMsg = '服务器错误';
              }
              // 初始化提交请求的状态
              this.loading = false
              // 设置提交为失败状态
              this.submitFailed = true
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show')
    }
  }
}

</script>

<style lang="scss" scoped>
.red-error {
  color: #F56C6C
}

</style>
