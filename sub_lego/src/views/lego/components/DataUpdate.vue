<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="scrollbar-container">
      <el-form ref="form" :model="classColumn" label-width="130px">
        <el-form-item
          v-for="(item,index) in headers"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
          <el-col v-if="['Date','DateTime'].indexOf(item.type) > -1">
            <el-date-picker :id="item.label" v-model="item.value" type="date" placeholder="选择日期" style="width: 100%;" value-format="yyyy-MM-dd" />
          </el-col>
          <el-input v-else :id="item.label" v-model="item.value" />
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
  </el-scrollbar>
</template>
<script>

export default {
  props: {
    headers: {
      type: Array,
      default() {
        return []
      }
    },
    class_name: {
      type: String,
      default() {
        return null
      }
    },
    repo_name: {
      type: String,
      default() {
        return null
      }
    },
    filters: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      classColumn: {
      },
      fields: {},
      loading: false,
      filters_str: this.filters
    }
  },
  watch: {
    filters(val) {
      // 新增filters的watch，监听变更并同步到filters_str上
      this.filters_str = val
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.fields = {}
          this.headers.forEach(element => {
            this.fields[element['prop']] = element['value']
          })
          this.classColumn['fields'] = this.fields
          this.classColumn['repo_name'] = this.repo_name
          this.classColumn['cls_name'] = this.class_name
          this.classColumn['filters'] = this.filters
          this.$Apis.data.update_data(this.classColumn).then(response => {
            this.filters_str = []
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.resetForm('form')
                this.$emit('refresh', this.filters_str)
              }
            })
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show', false)
    }
  }
}
</script>
