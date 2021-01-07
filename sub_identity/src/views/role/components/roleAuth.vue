<template>
  <div>
    <div class="panel-heading">
      <el-button :disabled="!select_value" type="primary" @click="role_menus">
        确定
      </el-button>
      <el-button @click="reset">
        取消
      </el-button>
    </div>
    <div class="tab-content">
      <div style="display: flex;">
        <el-select v-model="select_value" class="form-control" @change="get_data">
          <el-option v-permission="['ns://create_assign@identity.menus']" label="菜单" value="menu" />
          <el-option v-permission="['ns://create_assign@identity.menus']" label="手机菜单" value="mobileMenu" />
        </el-select>
        <el-input v-model="filterText" :disabled="!select_value" placeholder="输入关键字进行过滤" />
      </div>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="scrollbar-content">
          <div v-show="select_value === 'menu'" class="ztree">
            <el-tree
              ref="menu"
              :data="data"
              :default-checked-keys="checked_keys"
              :props="{ label: 'label', children: 'children' }"
              :check-strictly="true"
              :filter-node-method="filterNode"
              node-key="menu_id"
              show-checkbox
              default-expand-all
              @check-change="change"
            />
          </div>
          <div v-show="select_value === 'mobileMenu'" class="ztree">
            <el-tree
              ref="mobileMenu"
              :data="data"
              :default-checked-keys="checked_keys"
              :props="{ label: 'label', children: 'children' }"
              :check-strictly="true"
              :filter-node-method="filterNode"
              node-key="menu_id"
              show-checkbox
              default-expand-all
              @check-change="change"
            />
          </div>
          <div v-show="select_value === 'resource'" class="ztree">
            <el-tree
              ref="resource"
              :data="data"
              :props="{ label: 'text', children: 'children' }"
              :check-strictly="true"
              :filter-node-method="filterNode"
              node-key="res_id"
              show-checkbox
              default-expand-all
              @check-change="change"
            />
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    role_code: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      datas: {},
      checked: {},
      remotes: {
        'menu': { http: this.$Apis.menu.menu_all_tree, auth: this.$Apis.menu.access_menu_ids },
        'mobileMenu': { http: this.$Apis.menu.menu_all_tree, auth: this.$Apis.menu.access_menu_ids },
        'resource': { http: this.$Apis.resource.resource_list, auth: this.$Apis.resource.resource_list }
      },
      checked_keys: [],
      select_value: null,
      data: [],
      filterText: null
    }
  },
  watch: {
    filterText(val) {
      this.$refs[this.select_value].filter(val)
    }
  },
  created() {
  },
  methods: {
    get_data(val) {
      let device
      if (val === 'mobileMenu') {
        device = 'mobile'
      }
      if (val in this.remotes) {
        if (val in this.datas) {
          this.data = this.datas[val]
        } else {
          this.remotes[val]['http'](device).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              const data = response.payload.items ? response.payload.items : response.payload
              this.data = data
              this.datas[val] = data
            } else {
              this.data = []
              this.datas[val] = []
            }
          })
        }
        if (val in this.checked) {
          this.checked_keys = this.checked[val]
        } else {
          this.remotes[val]['auth'](this.role_code, null, device).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              const data = response.payload.items ? response.payload.items : response.payload
              this.checked_keys = data
              this.checked[val] = data
            } else {
              this.checked_keys = []
              this.checked[val] = []
            }
          })
        }
      } else {
        this.datas[val] = []
        this.data = []
        this.checked_keys = []
        this.checked[val] = {}
      }
    },
    change() {
    },
    role_menus() {
      const val = this.select_value
      let device
      if (val === 'mobileMenu') {
        device = 'mobile'
      }
      const menu_ids = this.$refs[val].getCheckedKeys()
      this.$Apis.menu.add_role_by_menu_ids(this.role_code, menu_ids, device).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.checked[val] = menu_ids
        }
        this.$alert(response.message, '提示', {
          confirmButtonText: '确定'
        })
      })
    },
    reset() {
      const val = this.select_value
      if (val) {
        if (val in this.checked) {
          this.checked_keys = this.checked[val]
        } else {
          this.remotes[val]['auth'](this.role_code).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              const data = response.payload.items ? response.payload.items : response.payload
              this.checked_keys = data
              this.checked[val] = data
            } else {
              this.checked_keys = []
              this.checked[val] = []
            }
          })
        }
        this.$refs[val].setCheckedKeys(this.checked_keys)
      } else {
        this.checked_keys = []
      }
      this.$emit('show', false)
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

<style>
.scrollbar-content {
  max-height: 400px;
}
button {
  text-align: center;
}
div {
  display: block;
}
.panel-heading {
  border-bottom: 1px none;
  padding: 0px 5% 20px;
  line-height: 1;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  text-align: center;
}
.form-control {
  padding: 0px 5% 10px;
  max-width: 100%;
  text-align: center;
}
.ztree {
  margin-top: 10px;
  /*overflow-y: scroll;*/
  /*overflow-x: auto;*/
}
</style>
