<template>
  <div>
    <el-form ref="form" :model="relationship" :rules="rules" label-width="130px">
      <el-form-item label="关系名" prop="name">
        <el-input id="name" v-model="relationship.name" />
      </el-form-item>
      <el-form-item label="被映射的类" prop="argument">
        <el-select id="argument" v-model="relationship.argument" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.cls_id"
            :label="item.cls_name"
            :value="item.cls_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关系的属性" prop="props">
        <el-input id="props" v-model="relationship.props" />
        <div class="tips">
          请填写json格式的数据
        </div>
      </el-form-item>
<!--      <el-form-item label="是否为一对多">-->
<!--        <el-switch v-model="relationship.multiple" active-value="on" inactive-value="off" />-->
<!--      </el-form-item>-->
      <el-form-item label="关系描述">
        <el-input id="comment" v-model="relationship.comment" />
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
const isJSON = Vue.$Utils.validate.isJSON

export default {
  props: {
    class_name: {
      type: String,
      default: ''
    },
    repo_name: {
      type: String,
      default: ''
    },
    is_view: {
      type: Boolean,
      default: true
    }
  },
  data() {
    var validateJson = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!isJSON(value)) {
        callback(new Error('请输入正确的json格式!'))
      } else {
        callback()
      }
    }
    return {
      relationship: {
        name: null,
        argument: null,
        props: null,
        multiple: false,
        comment: null
      },
      rules: {
        name: [{ required: true, message: '请输入关系名', trigger: 'blur' }],
        argument: [{ required: true, message: '请选择被映射的类', trigger: 'change' }],
        props: [{ validator: validateJson, trigger: 'blur' }]
      },
      options: [],
      loading: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
      text: null,
      searchLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const repo_name = this.repo_name
          const class_name = this.class_name
          const name = this.relationship.name
          const argument = this.relationship.argument
          var props = this.relationship.props
          const multiple = this.relationship.multiple
          const comment = this.relationship.comment
          if (props && props !== 'null') {
            props = JSON.parse(this.relationship.props)
          } else if (props === 'null' || !props) {
            props = {}
          }
          this.$Apis.class.relationship_create(repo_name, class_name, name, argument, props, multiple, comment).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  this.$emit('refresh')
                }
              })
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
    },
    loadMore() {
      this.pagination.page++
      if (this.pagination.page <= this.pageCount) {
        this.getList()
      }
    },
    getList() {
      // 这里是接口请求数据, 带分页条件
      this.$Apis.class.class_list(this.repo_name, this.text, this.pagination.page, this.page_size, true, this.is_view).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.options = [...this.options, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.text = query
        this.pagination.page = 0
        this.options = []
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        this.options = []
        this.text = null
        this.pagination.page = 1
        this.getList()
      }
    }
  }
}
</script>

