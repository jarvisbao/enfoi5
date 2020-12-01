<template>
  <div class="actions-box">
    <el-form ref="form" :model="actions" :rules="rules" label-width="170px">
      <el-form-item label="动作名称" prop="action_name">
        <el-input id="actName" v-model="actions.action_name" />
      </el-form-item>
      <el-form-item label="动作显示文本" prop="action_label">
        <el-input id="actLabel" v-model="actions.action_label" />
      </el-form-item>
      <el-form-item label="动作包含的资源的字段" prop="attributes">
        <!-- <el-input v-model="actions.attributes"/> -->
        <el-select
          id="actAttribute"
          v-model="actions.attributes"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请填写动作包含的资源字段"
          popper-class="attributes-select"
        >
          <el-option
            v-for="item in attributesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="tips">
          输入完请按回车键确定
        </div>
      </el-form-item>
      <div class="item-list">
        <el-form-item label="是否有执行权限" prop="can_execute">
          <el-switch v-model="actions.can_execute" />
        </el-form-item>
        <el-form-item label="是否有创建权限" prop="can_create">
          <el-switch v-model="actions.can_create" />
        </el-form-item>
        <el-form-item label="是否有更新权限" prop="can_update">
          <el-switch v-model="actions.can_update" />
        </el-form-item>
        <el-form-item label="是否有删除权限" prop="can_delete">
          <el-switch v-model="actions.can_delete" />
        </el-form-item>
        <el-form-item label="是否有查看权限" prop="can_view">
          <el-switch v-model="actions.can_view" />
        </el-form-item>
        <el-form-item label="是否为子资源的属性" prop="is_children">
          <el-switch v-model="actions.is_children" />
        </el-form-item>
        <el-form-item label="是否为本资源的属性" prop="is_self">
          <el-switch v-model="actions.is_self" />
        </el-form-item>
      </div>
      <el-form-item label="属性的保留字段" prop="props">
        <el-input id="actProps" v-model="actions.props" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click="resetForm">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  props: {
    actions: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        action_name: { required: true, message: '请输入动作名称', trigger: 'blur' },
        action_label: { required: true, message: '请输入动作显示文本', trigger: 'blur' }
      },
      loading: false,
      attributesOptions: []
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const action_name = this.actions.action_name
          const action_label = this.actions.action_label
          const can_execute = this.actions.can_execute
          const can_create = this.actions.can_create
          const can_update = this.actions.can_update
          const can_delete = this.actions.can_delete
          const can_view = this.actions.can_view
          const attributes = this.actions.attributes
          const is_children = this.actions.is_children
          const is_self = this.actions.is_self
          const props = this.actions.props
          const action_id = this.actions.action_id
          this.loading = true
          this.$Apis.resource.actions_update(action_id, action_name, action_label, can_execute, can_create, can_update, can_delete, can_view, attributes, is_children, is_self, props).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('更新成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  // this.$router.go(0)
                  this.$emit('refresh', true)
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
<style lang="scss" scoped>
.item-list {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 50%;
  }
}
.actions-box /deep/ .el-input__suffix {
  display: none;
}
</style>
