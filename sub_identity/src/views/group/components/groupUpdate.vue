<template>
  <div>
    <el-form ref="form" :model="group" label-width="100px">
      <el-form-item
        :rules="{
          required: true, message: '群组名称不能为空', trigger: 'blur'
        }"
        label="群组名称"
        prop="name"
      >
        <el-input id="groupName" v-model="group.name" />
      </el-form-item>
      <!-- <el-form-item label="群组属性">
        <el-input v-model="group.props" type="textarea"/>
      </el-form-item> -->
      <el-form-item>
        <el-button id="submit" type="danger" @click="submitForm('form')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click="resetForm()">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  props: {
    group: {
      type: Object,
      default: function() {
        return {}
      }
    },
    group_id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const group_id = this.group_id
          const name = this.group.name
          const props = this.group.props
          this.listLoading = true
          this.$Apis.group.group_update(group_id, name, props).then(response => {
            this.listLoading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('更新成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  // this.$router.go(0)
                  this.resetForm()
                  this.$emit('refresh')
                }
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        } else {
          this.$alert('error submit!!', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      })
    },
    resetForm() {
      this.$emit('show', false)
    }
  }
}
</script>
