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
            <el-date-picker :id="item.prop" v-model="item.value" type="date" placeholder="选择日期" style="width: 100%;" value-format="yyyy-MM-dd" @change="dateChangebirthday($event)" />
          </el-col>
          <el-input v-else :id="item.prop" v-model="item.value" />
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
    proj_code: {
      type: String,
      default() {
        return null
      }
    },
    biz_code: {
      type: String,
      default() {
        return null
      }
    },
    repo_id: {
      type: String,
      default() {
        return null
      }
    },
    class_id: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      classColumn: {},
      loading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.headers.forEach(element => {
            this.classColumn[element['prop']] = element['value']
          })
          this.$Apis.bizdata.bizdata_create(this.proj_code, this.biz_code, this.classColumn).then(response => {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.resetForm('form')
                this.$emit('refresh')
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
    },
    dateChangebirthday(event) {
      console.info('123', event)
    }
  }
}
</script>
