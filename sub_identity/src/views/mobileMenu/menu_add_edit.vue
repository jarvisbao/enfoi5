<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单代码" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <i v-if="form.icon" :class="form.icon" class="menu-icon" />
        <span class="choose-icon" @click="chooseIcon">选择</span>
        <span v-if="form.icon" class="delete-icon" @click="deleteIcon">删除</span>
      </el-form-item>
      <el-form-item label="外部链接">
        <el-switch v-model="form.external" @change="changeUrl" />
      </el-form-item>
      <el-form-item label="路由">
        <el-input v-model="form.url" />
        <div class="tips">
          <p>1. 九宫格菜单展示， 路由为/grid</p>
          <p>2. 数据展示， 请填写以/data或/dataByCode为开头的带参数的完整链接</p>
          <p>3. 数据编辑， 请填写以/data/update为开头的带参数的完整链接</p>
        </div>
      </el-form-item>
      <el-form-item label="父菜单" prop="parent_code">
        <el-input v-if="isSub" v-model="parend_name" />
        <el-select v-else v-model="form.parent_code">
          <el-option v-for="item in menuList" :key="item.menu_id" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="序号">
        <el-input v-model="form.order" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button id="confirm" :loading="loading" type="danger" @click="submitForm('form')">
          {{ menu_id ? '立即修改' : '立即创建'}}
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
            <component :is="currentTab" :icon="form.icon" @show="isShow" @icon="icon($event)" />
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
    menu_id: {
      type: String,
      default: null
    },
    menuInfo: {
      type: Object,
      default: () => {}
    },
    menuList: {
      type: Array,
      default: () => []
    },
    isSub: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      form: {
        name: null,
        code: null,
        icon: null,
        url: null,
        order: null,
        parent_code: null,
        external: false,
        description: null
      },
      rules: {
        name: { required: true, message: '请输入菜单名称', trigger: 'blur' },
        code: { required: true, message: '请输入菜单代码', trigger: 'blur' },
        icon: { required: true, message: '请选择图标', trigger: 'blur' }
      },
      parend_name: null,
      showIcon: false,
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
    if (this.menu_id) {
      this.form = this.menuInfo
    }
    if (this.isSub) {
      this.form.parent_code = this.$route.query.code
      this.parend_name = this.$route.query.name
    }
  },
  methods: {
    chooseIcon() {
      this.dialogVisible = !this.dialogVisible
    },
    deleteIcon() {
      this.form.icon = null
      this.showIcon = false
    },
    toggleTab($event) {
      this.currentTab = $event
    },
    icon($event) {
      this.form.icon = $event
      this.showIcon = true
    },
    isShow() {
      this.dialogVisible = false
    },
    changeUrl(val) {
      this.form.url = null
      this.form.params = null
    },
    submitForm(formName) {
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const name = this.form.name
          const code = this.form.code
          const icon = this.form.icon
          const order = this.form.order
          const description = this.form.description
          const parent_code = this.form.parent_code
          const external = this.form.external
          const menu_id = this.menu_id
          const url = this.form.url
          this.$Apis.mobileMenu.menu_add_edit(name, code, icon, url, order, description, parent_code, external, menu_id).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.resetForm('form')
              this.$emit('refresh')
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
