<template>
  <div>
    <el-form ref="bizclassForm" :model="bizclass" :rules="rules" label-width="130px">
      <el-form-item label="业务对象名称" prop="biz_name">
        <el-input id="bizName" v-model="bizclass.biz_name" />
      </el-form-item>
      <el-form-item label="业务对象代码" prop="biz_code">
        <el-input id="bizCode" v-model="bizclass.biz_code" />
      </el-form-item>
      <el-form-item placeholder="请选择" label="数据表" prop="legoclass_id">
        <div class="ganged-select">
          <el-select
            id="legoClass"
            v-model="bizclass.repo_name"
            v-loadmore="loadMore"
            :remote-method="remoteMethod"
            :loading="searchLoading"
            :class="{selectW: isShow }"
            filterable
            remote
            placeholder="请选择"
            class="select"
            @change="handleChange"
            @focus="handleFoucus"
          >
            <el-option
              v-for="item in repoItem"
              :key="item.repo_id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <el-select id="classes" v-model="classes" :class="{selectW: isShow }" class="select" @change="changeClasses">
            <el-option value="repositoryClass" label="对象类" />
            <el-option value="repositoryView" label="视图" />
          </el-select>
          <el-select
            v-if="isShow"
            id="bizClass"
            v-model="bizclass.legoclass_id"
            v-loadmore="loadMore"
            :remote-method="remoteMethod"
            :loading="searchLoading"
            :class="{selectW: isShow }"
            filterable
            remote
            placeholder="请选择"
            class="select"
            @focus="handleChildFoucus"
          >
            <el-option
              v-for="item in classItem"
              :key="item.class_id"
              :label="item.cls_name"
              :value="item.class_id"
            />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('bizclassForm')">
          立即添加
        </el-button>
        <el-button id="cancel" plain @click="resetForm('bizclassForm')">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  props: {
    proj_code: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      bizclass: {
        biz_name: null,
        biz_code: null,
        legoclass_id: null,
        repo_name: null
      },
      props: {
        label: 'label',
        value: 'id',
        children: 'legoclass'
      },
      rules: {
        biz_name: [{ required: true, message: '请输入业务对象名称', trigger: 'blur' }],
        biz_code: [{ required: true, message: '请输入业务对象代码', trigger: 'blur' }],
        legoclass_id: [{ required: true, message: '请选择指向的数据表', trigger: 'change' }]
      },
      loading: false,
      isShow: false,
      repoItem: [],
      classItem: [],
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
      searchLoading: false,
      repo_name: null,
      childText: null,
      childPagination: 1,
      childPageCount: 1,
      isFocus: false,
      classes: '',
      is_view: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const proj_code = this.proj_code
          const biz_code = this.bizclass.biz_code
          const biz_name = this.bizclass.biz_name
          const legoclass_id = this.bizclass.legoclass_id
          this.$Apis.bizclass.bizclass_create(proj_code, biz_code, biz_name, legoclass_id).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('bizclassForm')
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show')
    },
    handleFoucus() {
      this.isFocus = true
    },
    handleChildFoucus() {
      this.isFocus = false
      this.classItem = []
      this.childPagination = 1
      this.getChildList()
    },
    handleChange(val) {
      this.repo_name = val
      this.bizclass.legoclass_id = null
      this.childPagination = 1
      this.classItem = []
      if (this.classes) {
        this.isShow = true
      }
    },
    changeClasses(val) {
      if (val === 'repositoryClass') {
        this.is_view = false
      } else {
        this.is_view = true
      }
      this.classItem = []
      this.bizclass.legoclass_id = null
      this.childPagination = 1
      if (this.repo_name) {
        this.isShow = true
      }
    },
    loadMore() {
      if (this.isFocus) {
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
      this.$Apis.repository.repository_list(this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.repoItem = [...this.repoItem, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    getChildList() {
      this.$Apis.class.class_list(this.repo_name, this.childText, this.childPagination, this.page_size, true, this.is_view).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.classItem = [...this.classItem, ..._res]
          this.childPageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        if (this.isFocus) {
          this.text = query
          this.pagination.page = 0
          this.repoItem = []
        } else {
          this.childText = query
          this.childPagination = 0
          this.classItem = []
        }
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        if (this.isFocus) {
          this.repoItem = []
          this.text = null
          this.pagination.page = 1
          this.getList()
        } else {
          this.classItem = []
          this.childText = null
          this.childPagination = 1
          this.getChildList()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ganged-select {
  .select {
    width: 48%;
  }
  .selectW {
    width: 31% !important;
  }
}
</style>
