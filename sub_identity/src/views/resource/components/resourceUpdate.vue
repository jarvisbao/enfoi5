<template>
  <div>
    <el-form ref="form" :model="resource" :rules="rules" label-width="150px">
      <el-form-item label="资源代码" prop="res_code">
        <el-input v-model="resource.res_code" :disabled="true" />
      </el-form-item>
      <el-form-item label="父资源" prop="parent_text">
        <el-input v-model="resource.parent_text" :disabled="true" />
      </el-form-item>
      <el-form-item label="资源对应对象的ID" prop="ref_id">
        <el-input v-model="resource.ref_id" :disabled="true" />
      </el-form-item>
      <el-form-item label="资源显示文本" prop="text">
        <el-input id="resText" v-model="resource.text" />
      </el-form-item>
      <el-form-item label="资源类型" prop="category">
        <el-input id="resCate" v-model="resource.category" />
      </el-form-item>
      <!-- <el-form-item label="资源属性" prop="props">
        <el-input v-model="resource.props" type="textarea"/>
      </el-form-item> -->
      <el-form-item label="实例类资源" prop="level">
        <el-switch v-model="resource.level" disabled active-value="instance" inactive-value="branch" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即修改
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
const EventBus = Vue.$Utils.EventBus
export default {
  props: {
    resource: {
      type: Object,
      default() {
        return {}
      }
    },
    showType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rules: {
        res_code: {
          required: true,
          message: '请输入资源代码',
          trigger: 'blur'
        }
      },
      loading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const res_id = this.resource.res_id
          const text = this.resource.text
          const category = this.resource.category
          const props = this.resource.props
          this.loading = true
          this.$Apis.resource.resource_update(res_id, text, category, props).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('修改成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  // this.$router.go(0)
                  if (this.showType === 0) {
                    this.$emit('refresh', true)
                  } else {
                    EventBus.$emit('refreshTree', res_id) // 刷新树形数据
                  }
                }
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        } else {
          this.$alert('error submit', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show', false)
    }
  }
}
</script>
