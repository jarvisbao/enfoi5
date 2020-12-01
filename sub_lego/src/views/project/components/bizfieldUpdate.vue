<template>
  <div>
    <el-form ref="bizfieldForm" :model="bizfield" :rules="rules" label-width="170px">
      <el-form-item label="字段显示名称" prop="field_name">
        <el-input id="fieldName" v-model="bizfield.field_name" />
      </el-form-item>
      <el-form-item label="字段代码" prop="field_code">
        <el-input id="fieldCode" v-model="bizfield.field_code" />
      </el-form-item>
      <el-form-item placeholder="请选择" label="字段取值格式" prop="field_format">
        <el-cascader
          v-model="bizfield.field_format"
          :options="options"
          :props="{checkStrictly: true, emitPath: false}"
          filterable
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="参与查询">
        <el-switch v-model="bizfield.can_query" />
        <div class="tips">
          启动后，可在列表中用此字段搜索
        </div>
      </el-form-item>
      <el-form-item label="关联对象">
        <el-switch v-model="bizfield.field_is_object" @change="handleChange" />
      </el-form-item>
      <div v-show="show">
        <el-form-item label="关联对象" prop="object_id">
          <el-select id="objectId" v-model="bizfield.object_id" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote clearable placeholder="请选择" @focus="handleFocus">
            <el-option
              v-for="item in object_list"
              :key="item.object_id"
              :label="item.object_name"
              :value="item.object_id"
            >
              <span style="float: left">{{ item.object_name }}</span>
              <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.object_code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('bizfieldForm')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click="resetForm('bizfieldForm')">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  props: {
    bizfield: {
      type: Object,
      default() {
        return {}
      }
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    proj_code: {
      type: String,
      default: ''
    },
    object_name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rules: {
        field_name: [{ required: true, message: '请输入字段显示名称', trigger: 'blur' }],
        field_code: [{ required: true, message: '请输入字段代码', trigger: 'blur' }],
        field_format: [{ required: true, message: '请输入字段取值格式', trigger: 'blur' }]
      },
      loading: false,
      show: false,
      object_list: [],
      disabled: false,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
      searchLoading: false
    }
  },
  created() {
    this.bizfield.field_object_fields = JSON.stringify(this.bizfield.field_object_fields)
    if (this.bizfield.field_is_object) {
      // this.show = true
      this.disabled = true
      this.object_list.push({
        object_id: this.bizfield.object_id,
        object_name: this.object_name
      })
    }
  },
  methods: {
    handleFocus() {
      this.object_list = []
      this.pagination.page = 1
      this.getList()
    },
    handleChange(val) {
      // if (val) {
      //   this.show = true
      //   this.disabled = true
      //   this.rules['object_id'] = [{ required: true, message: '请选择关联对象', trigger: 'blur' }]
      // } else {
      //   this.show = false
      //   this.disabled = false
      //   this.bizfield.object_id = null
      //   delete this.rules['object_id']
      // }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const field_id = this.bizfield.field_id
          const field_code = this.bizfield.field_code
          const field_name = this.bizfield.field_name
          const field_format = this.bizfield.field_format
          const field_is_object = this.bizfield.field_is_object
          const object_id = this.bizfield.object_id || null
          const can_query = this.bizfield.can_query
          this.$Apis.bizclass.bizfield_edit(field_id, field_code, field_name, field_format, field_is_object, object_id, can_query, this.proj_code).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('更新成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('bizfieldForm')
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
    loadMore() {
      this.pagination.page++
      if (this.pagination.page <= this.pageCount) {
        this.getList()
      }
    },
    getList() {
      // 这里是接口请求数据, 带分页条件
      this.$Apis.object.object_list(this.proj_code, this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.object_list = [...this.object_list, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.text = query
        this.pagination.page = 0
        this.object_list = []
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        this.object_list = []
        this.text = null
        this.pagination.page = 1
        this.getList()
      }
    }
  }
}
</script>

