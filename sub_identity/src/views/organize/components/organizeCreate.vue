<template>
  <div>
    <el-form ref="form" :model="organize" :rules="rules" label-width="150px">
      <el-form-item label="组织机构代码" prop="org_code">
        <el-input id="orgCode" v-model="organize.org_code" />
      </el-form-item>
      <el-form-item label="组织机构名称" prop="org_name">
        <el-input id="orgName" v-model="organize.org_name" />
      </el-form-item>
      <el-form-item v-if="isDisabled" label="父级组织机构" prop="parent">
        <div class="ganged-select">
          <el-select
            v-for="(arrItem, key) in selectList"
            :id="'orgParent' + key"
            :key="key"
            v-model="organize.parent[key]"
            v-loadmore="loadMore"
            :remote-method="remoteMethod"
            :loading="searchLoading"
            :class="{selectW: selectList.length>1 }"
            filterable
            remote
            clearable
            placeholder="请选择"
            class="select"
            @change="handleChange"
            @focus="position=key"
          >
            <el-option
              v-for="item in arrItem"
              :key="item.org_code"
              :label="item.name"
              :value="item.org_code"
            />
          </el-select>
        </div>
        <!-- <el-cascader
          v-model="parent"
          :options="tree_items"
          :show-all-levels="true"
          :props="prop"
          change-on-select
          filterable
          clearable/> -->
      </el-form-item>
      <el-form-item v-else label="父级组织机构" prop="parent">
        <el-input v-model="parent" :disabled="true" />
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

export default {
  props: {
    get_parent: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      required: true
    },
    tree_items: {
      type: Array,
      default: function() {
        return []
      }
    },
    showType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      organize: {
        org_code: '',
        org_name: '',
        props: null,
        parent: []
      },
      parent: this.get_parent,
      prop: { value: 'id', label: 'label', children: 'children' },
      rules: {
        org_code: {
          required: true,
          message: '请输入组织机构代码',
          trigger: 'blur'
        },
        org_name: { required: true, message: '请输入组织机构名称', trigger: 'blur' }
      },
      loading: false,
      text: null,
      recursive: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
      searchLoading: false,
      parentId: null,
      position: null,
      selectList: [[]],
      childPagination: 1,
      childPageCount: 1
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleChange(val) {
      const index = this.position + 1
      if (!this.position) {
        this.organize.parent.splice(1, this.organize.parent.length - 1)
        this.selectList.splice(1, this.selectList.length - 1)
      } else {
        this.organize.parent.splice(index, this.organize.parent.length - 1)
        this.selectList.splice(index, this.selectList.length - 1)
      }
      this.parentId = val
      this.childPagination = 1
      this.$Apis.organize.organize_list(this.parentId, null, this.text, true, this.childPagination, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          if (_res.length > 0) {
            this.selectList.push([])
            this.selectList[index].push(..._res)
            this.childPageCount = response.payload.pagination.pages // 总页数
          } else {
            if (this.selectList.length > 1) {
              this.selectList.splice(index, this.selectList.length - 1)
            }
          }
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const org_code = this.organize.org_code
          const org_name = this.organize.org_name
          const props = this.organize.props
          // const parent = this.parent
          var parent = null
          if ('org_code' in this.$route.query) {
            parent = this.$route.query.org_code
          } else {
            if (this.parent != null) {
              parent = this.organize.parent[this.organize.parent.length - 1]
            }
            parent = this.organize.parent[this.organize.parent.length - 1]
          }
          this.loading = true
          this.$Apis.organize.organize_create(org_code, org_name, parent, props).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  if (this.showType === 0) {
                    this.$emit('refresh')
                  } else {
                    this.$Utils.EventBus.$emit('add-refresh', {
                      name: org_name,
                      org_code: org_code,
                      parent_code: parent,
                      _status: 'available'
                    }) // 刷新树形数据
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
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show', false)
    },
    loadMore() {
      if (!this.position) {
        this.pagination.page++
        if (this.pagination.page <= this.pageCount) {
          this.getList()
        }
      } else {
        this.childPagination++
        if (this.childPagination <= this.childPageCount) {
          this.getChildList()
        }
      }
    },
    getList() {
      // 这里是接口请求数据, 带分页条件
      this.$Apis.organize.organize_list(null, null, this.text, true, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.selectList[0].push(..._res)
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    getChildList() {
      this.$Apis.organize.organize_list(this.parentId, null, this.text, true, this.childPagination, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.selectList[this.position].push(..._res)
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.text = query
        if (!this.position) {
          this.pagination.page = 0
          this.selectList[0] = []
        } else {
          this.childPagination = 0
          this.selectList[this.position] = []
        }

        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        this.text = null
        if (!this.position) {
          this.pagination.page = 1
          // this.selectList[0] = []
          this.selectList[0].splice(0, this.selectList[0].length)
          this.getList()
        } else {
          this.childPagination = 1
          this.selectList[this.position].splice(0, this.selectList[this.position].length)
          // this.selectList[this.position] = []
          this.getChildList()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
