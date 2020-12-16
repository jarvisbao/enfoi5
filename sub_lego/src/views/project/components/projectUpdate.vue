<template>
  <div>
    <el-form ref="projectForm" :model="project" :rules="rules" label-width="130px">
      <el-form-item label="项目名称" prop="proj_name">
        <el-input id="projName" v-model="project.proj_name" />
      </el-form-item>
      <el-form-item label="项目代码" prop="proj_code">
        <el-input id="projCode" v-model="project.proj_code" :disabled="true" />
      </el-form-item>
      <el-form-item label="项目的属性" prop="props">
        <el-input id="projProps" v-model="project.props" type="textarea" />
        <div class="tips">
          请填写json格式的数据
        </div>
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('projectForm')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click="resetForm('projectForm')">
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
  props: {
    project: {
      type: Object,
      default() {
        return {}
      }
    },
    old_code: {
      type: String,
      default: null
    }
  },
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
      rules: {
        proj_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        proj_code: [{ required: true, message: '请输入项目代码', trigger: 'blur' }],
        props: [{ validator: validateJson, trigger: 'blur' }]
      },
      loading: false
    }
  },
  created() {
    this.project.props = JSON.stringify(this.project.props)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const old_code = this.old_code
          // const new_proj_code = this.project.proj_code
          const proj_name = this.project.proj_name
          // const project_id = this.project.project_id
          let props = this.project.props
          if (props && props !== 'null') {
            props = JSON.parse(this.project.props)
          } else if (props === 'null' || !props) {
            props = {}
          }
          this.$Apis.project.project_edit(old_code, proj_name, props).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.$alert('更新成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('projectForm')
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
