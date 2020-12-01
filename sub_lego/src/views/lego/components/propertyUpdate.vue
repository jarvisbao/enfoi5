<template>
  <div>
    <el-form ref="form" :model="property" :rules="rules" label-width="130px">
      <el-form-item label="属性名" prop="prop_name">
        <el-input id="propName" v-model="property.prop_name" placeholder="id" />
      </el-form-item>
      <el-form-item label="属性的代码" prop="prop_code" class="is-required">
        <python-codemirror :prop_code="property.prop_code" :placeholder="code_placeholder" :code-mode="mode" param-code="prop_code" @get_code="get_code($event)" />
        <span v-if="validateCode" class="validate-tips">请输入属性的代码</span>
      </el-form-item>
      <el-form-item label="属性装饰器">
        <!-- <el-input v-model="property.prop_decorator" placeholder="@hybrid_property"/> -->
        <el-select id="propDecorator" v-model="property.prop_decorator" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <div v-show="show">
        <el-form-item label="参数" prop="params">
          <el-input id="propParams" v-model="property.params" placeholder="a,b='1',c=[],*args,**kwargs" />
        </el-form-item>
      </div>
      <el-form-item label="属性描述">
        <el-input id="propComment" v-model="property.prop_comment" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click="resetForm('form')">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import pythonCodemirror from '@/components/pythonCodemirror'

export default {
  components: {
    pythonCodemirror
  },
  props: {
    property: {
      type: Object,
      default() {
        return {}
      }
    },
    value: {
      type: String,
      default: ''
    },
    old_prop_name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rules: {
        prop_name: [{ required: true, message: '请输入属性名', trigger: 'blur' }]
      },
      loading: false,
      prop_code: this.value,
      options: [
        {
          value: 'hybrid_property',
          label: 'hybrid_property'
        },
        {
          value: 'property',
          label: 'property'
        },
        {
          value: 'hybrid_method',
          label: 'hybrid_method'
        }
      ],
      validateCode: false,
      code_placeholder: 'return self._id',
      mode: 'python',
      show: false
    }
  },
  computed: {
    new_prop_decorator() {
      return this.property.prop_decorator
    }
  },
  watch: {
    new_prop_decorator: function(val) {
      if (val.endsWith('method')) {
        this.show = true
      } else {
        this.show = false
      }
    }
  },
  methods: {
    get_code($event) {
      this.property.prop_code = $event['prop_code']
      if (this.property.prop_code === '') {
        this.validateCode = true
      } else {
        this.validateCode = false
      }
    },
    submitForm(formName) {
      if (this.property.prop_code === '') {
        this.validateCode = true
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          const repo_name = this.property.repo_name
          const class_name = this.property.class_name
          const old_prop_name = this.old_prop_name
          const prop_name = this.property.prop_name
          const prop_decorator = this.property.prop_decorator
          const prop_code = this.property.prop_code
          const prop_comment = this.property.prop_comment
          const params = this.property.params
          if (prop_code === '') {
            this.loading = false
            this.validateCode = true
            return
          } else {
            this.loading = true
          }
          this.$Apis.class.property_edit(repo_name, class_name, old_prop_name, prop_name, prop_decorator, prop_code, prop_comment, params).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.$alert('更新成功!', '提示', {
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
    }
  }
}
</script>

