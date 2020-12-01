<template>
  <div>
    <el-form ref="form" :model="menu" :rules="rules" label-width="150px">
      <el-form-item label="菜单显示名称" prop="label">
        <el-input id="menuLabel" v-model="menu.label" />
      </el-form-item>
      <el-form-item label="菜单编码" prop="menu_code">
        <el-input id="menuCode" v-model="menu.menu_code" />
      </el-form-item>
      <el-form-item label="路由" prop="uri">
        <el-input id="menuUri" v-model="menu.uri" />
      </el-form-item>
      <el-form-item label="序号" prop="number">
        <el-input id="menuNum" v-model.number="menu.number" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <!-- <el-input v-model="menu.icon"/> -->
        <i v-if="showIcon" :class="menu.icon" class="menu-icon" />
        <span class="choose-icon" @click="chooseIcon">选择</span>
        <span v-if="showIcon" class="delete-icon" @click="deleteIcon">删除</span>
      </el-form-item>
      <el-form-item label="父菜单" prop="parent">
        <el-cascader
          v-model="parent"
          :show-all-levels="true"
          :props="prop"
          filterable
          clearable
        />
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
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" title="选择图标" width="60%" append-to-body>
      <div class="icon-box">
        <common-tab :text-list="textList" :current-tab="currentTab" @toggle="toggleTab($event)" />
        <transition name="tab">
          <keep-alive>
            <component :is="currentTab" :icon="menu.icon" @show="isShow" @icon="icon($event)" />
          </keep-alive>
        </transition>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTab from '@/components/commonTab'

export default {
  components: {
    CommonTab
  },
  props: {
    menu_list: {
      type: Array,
      default: function() {
        return []
      }
    },
    menu: {
      type: Object,
      default: function() {
        return {
          menu_code: null,
          label: null,
          parent: null,
          uri: null,
          number: '',
          icon: null
        }
      }
    }
  },
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!Number.isInteger(value)) {
        callback(new Error('序号必须为数字值'))
      } else {
        callback()
      }
    }
    const _that = this
    return {
      parent: null,
      // prop: { value: 'namespace', label: 'title', children: 'children' },
      prop: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          if (node.level === 0) {
            _that.$Apis.menu.menu_list().then(response => {
              if (response.code === _that.$Utils.Constlib.ERROR_CODE_OK) {
                setTimeout(() => {
                  const nodes = response.payload.items
                    .map(item => ({
                      value: item.menu_code,
                      label: item.label,
                      menu_code: item.menu_code
                    }))
                  resolve(nodes)
                }, 1000)
              } else {
                resolve([])
              }
            })
          }
          if (node.value) {
            _that.$Apis.menu.menu_list(node.data.menu_code).then(response => {
              if (response.code === _that.$Utils.Constlib.ERROR_CODE_OK) {
                setTimeout(() => {
                  const nodes = response.payload.items
                    .map(item => ({
                      value: item.menu_code,
                      label: item.label,
                      menu_code: item.menu_code
                    }))
                  resolve(nodes)
                }, 1000)
              } else {
                resolve([])
              }
            })
          }
        }
      },
      rules: {
        code: { required: true, message: '请输入菜单代码', trigger: 'blur' },
        text: { required: true, message: '请输入菜单显示名称', trigger: 'blur' },
        number: { validator: checkNumber, trigger: 'blur' }
      },
      showIcon: false,
      loading: false,
      dialogVisible: false,
      currentTab: 'alifontIcon',
      textList: [
        {
          name: 'iconfont',
          label: 'alifontIcon'
        },
        {
          name: 'element',
          label: 'elementIcon'
        }
      ]
    }
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var parent = null
          if ('menu_code' in this.$route.query) {
            parent = this.$route.query.menu_code
          } else {
            if (this.parent != null) {
              parent = this.parent[this.parent.length - 1]
            }
          }
          var menu_code = this.menu.menu_code
          var label = this.menu.label
          var uri = this.menu.uri
          var icon = this.menu.icon
          var number = this.menu.number
          var addon = this.menu.addon
          this.loading = true
          this.$Apis.menu.menu_create(label, menu_code, uri, icon, number, parent, addon).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                }
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        } else {
          // this.$alert('error submit', '提示', {
          //   confirmButtonText: '确定'
          // })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show', false)
    },
    chooseIcon() {
      this.dialogVisible = !this.dialogVisible
    },
    deleteIcon() {
      this.menu.icon = null
      this.showIcon = false
    },
    toggleTab($event) {
      this.currentTab = $event
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    icon($event) {
      this.menu.icon = $event
      this.showIcon = true
    }
  }
}
</script>
<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>

