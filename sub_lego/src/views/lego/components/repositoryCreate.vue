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
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即添加
        </el-button>
        <el-button id="cancel" plain @click="resetForm('form')">
          取消
        </el-button>
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
        options: null
      },
      rules: {
        db_uri: [{ required: true, message: '请输入仓库连接的URI', trigger: 'blur' }],
        name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
        options: [{ validator: validateJson, trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const db_uri = this.repository.db_uri
          const name = this.repository.name
          var options = this.repository.options
          if (options && options !== 'null') {
            options = JSON.parse(this.repository.options)
          } else if (options === 'null' || !options) {
            options = {}
          }
          this.$Apis.repository.repository_create(db_uri, name, options).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  this.$emit('refresh')
                }
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.loading = false
                }
              })
            }
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
