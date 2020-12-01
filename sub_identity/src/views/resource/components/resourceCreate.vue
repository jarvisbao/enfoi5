<template>
  <div>
    <el-form ref="form" :model="resource" :rules="rules" label-width="150px">
      <el-form-item label="资源代码" prop="res_code">
        <el-input id="resCode" v-model="resource.res_code" />
      </el-form-item>
      <el-form-item label="资源显示文本" prop="text">
        <el-input id="resText" v-model="resource.text" />
      </el-form-item>
      <el-form-item label="资源类型" prop="category">
        <el-input id="resCate" v-model="resource.category" />
      </el-form-item>
      <el-form-item v-if="isDisabled" label="父资源" prop="parent_namespace">
        <div class="ganged-select">
          <el-select
            v-for="(arrItem, key) in selectList"
            :id="'resParent' + key"
            :key="key"
            v-model="resource.parent_namespace[key]"
            v-loadmore="loadMore"
            :remote-method="remoteMethod"
            :loading="searchLoading"
            :class="{selectW: selectList.length>1 }"
            filterable
            remote
            clearable
            value-key="namespace"
            placeholder="请选择"
            class="select"
            @change="handleChange"
            @focus="position=key"
          >
            <el-option
              v-for="item in arrItem"
              :key="item.namespace"
              :label="item.text"
              :value="{namespace: item.namespace, res_id: item.res_id}"
            />
          </el-select>
        </div>
        <!-- <el-cascader
          v-model="parent_id"
          :show-all-levels="true"
          :props="prop"
          filterable
          clearable/> -->
      </el-form-item>
      <el-form-item v-else label="父资源" prop="parent_id">
        <el-input v-model="get_parent_namespace" :disabled="true" />
      </el-form-item>
      <!-- <el-form-item label="资源对应对象的ID" prop="ref_id">
        <el-input v-model="resource.ref_id"/>
      </el-form-item>
      <el-form-item label="资源属性" prop="props">
        <el-input v-model="resource.props" type="textarea"/>
      </el-form-item> -->
      <el-form-item label="实例类资源" prop="instance">
        <el-switch v-model="resource.instance" />
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
const EventBus = Vue.$Utils.EventBus
export default {
  props: {
    get_parent_namespace: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      required: true
    },
    tree_items: {
      type: Array,
      default() {
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
      resource: {
        res_code: '',
        text: null,
        parent_namespace: [],
        category: null,
        props: null,
        ref_id: null,
        instance: false
      },
      parent_namespace: this.get_parent_namespace,
      // prop: { value: 'id', label: 'label', children: 'children' },
      rules: {
        res_code: {
          required: true,
          message: '请输入资源代码',
          trigger: 'blur'
        },
        text: { required: true, message: '请输入资源显示文本', trigger: 'blur' }
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
        this.resource.parent_namespace.splice(1, this.resource.parent_namespace.length - 1)
        this.selectList.splice(1, this.selectList.length - 1)
      } else {
        this.resource.parent_namespace.splice(index, this.resource.parent_namespace.length - 1)
        this.selectList.splice(index, this.selectList.length - 1)
      }
      this.parentId = val.namespace
      this.childPagination = 1
      this.$Apis.resource.resource_list(this.parentId, this.text, true, this.childPagination, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          if (_res.length > 0) {
            this.selectList.push([])
            this.selectList[index].push(..._res)
            this.childPageCount = response.payload.pagination.pages // 总页数
          }
        } else {
          if (this.selectList.length > 1) {
            this.selectList.splice(index, this.selectList.length - 1)
          }
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const res_code = this.resource.res_code
          const text = this.resource.text
          // const parent_id = this.parent_id
          const category = this.resource.category
          const props = this.resource.props
          const ref_id = this.resource.ref_id
          const instance = this.resource.instance
          var parent_namespace = null
          if ('namespace' in this.$route.query) {
            parent_namespace = this.$route.query.namespace
          } else {
            if (this.parent_namespace != null) {
              parent_namespace = this.parent_namespace
            }
            parent_namespace = this.resource.parent_namespace.length > 0 ? this.resource.parent_namespace[this.resource.parent_namespace.length - 1].namespace : null
          }
          this.loading = true
          const selected_parent_id = this.resource.parent_namespace.length > 0 ? this.resource.parent_namespace[this.resource.parent_namespace.length - 1].res_id : null

          this.$Apis.resource.resource_create(res_code, text, parent_namespace, category, props, ref_id, instance).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  if (this.showType === 0) {
                    this.$emit('refresh', true)
                  } else {
                    EventBus.$emit('add-refresh', {
                      text: text,
                      res_code: res_code,
                      ref_id: ref_id,
                      res_id: response.payload,
                      parent_namespace: parent_namespace,
                      parent_id: selected_parent_id
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
      this.$Apis.resource.resource_list(null, this.text, true, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.selectList[0].push(..._res)
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    getChildList() {
      this.$Apis.resource.resource_list(this.parentId, this.text, true, this.childPagination, this.page_size).then(response => {
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
          // this.selectList[this.position].splice(0, this.selectList[this.position].length)
          this.selectList[this.position] = []
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
