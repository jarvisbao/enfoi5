<template>
  <div>
    <el-form ref="form" :model="role" :rules="rules" label-width="120px">
      <el-form-item label="角色代码" prop="role_code">
        <el-input id="roleCode" v-model="role.role_code" />
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input id="roleName" v-model="role.name" />
      </el-form-item>
      <el-form-item label="角色分类" prop="category">
        <el-input id="roleCate" v-model="role.category" />
      </el-form-item>
      <el-form-item label="角色描述" prop="comment">
        <el-input id="roleComment" v-model="role.comment" />
      </el-form-item>
      <!-- <el-form-item label="角色的拥有者" prop="owner">
        <el-input v-model="role.owner"/>
      </el-form-item> -->
      <!-- <el-form-item label="角色属性">
        <el-input v-model="role.props" type="textarea"/>
      </el-form-item> -->
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click.stop="resetForm">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  props: {
    role: {
      type: Object,
      default: function() {
        return {}
      }
    },
    old_role_code: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      rules: {
        role_code: {
          required: true,
          message: '请输入角色代码',
          trigger: 'blur'
        },
        name: { required: true, message: '请输入角色名称', trigger: 'blur' }
      },
      loading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const old_role_code = this.old_role_code
          const role_code = this.role.role_code
          const name = this.role.name
          const category = this.role.category
          const owner = this.role.owner
          const props = this.role.props
          const comment = this.role.comment
          this.loading = true
          this.$Apis.role.role_update(old_role_code, role_code, name, category, comment, owner, props).then(response => {
            this.loading = false
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
