<template>
  <div class="inner-object">
    <van-field
      :id="id"
      :ref="widget.model"
      :label="widget.name"
      :name="widget.model"
      readonly
    >
      <template slot="input">
        <span v-if="can_create && !is_view" class="btns" @click="create">
          请添加
        </span>
      </template>
    </van-field>

    <div v-if="objectData && objectData.length > 0" class="obj-data">
      <div class="list-box">
        <div v-for="(item, index) in objectData" :key="index" class="list-item">
          <div class="list" style="display: flex; align-items: center;">
            <div style="flex: 1">
              <div v-for="(sub, i) in headers" :key="i" class="item">
                <label>{{ sub.label }}:</label>
                <div>
                  <div v-if="sub.data_format && ['image','file', 'html'].indexOf(sub.data_format) != -1">
                    <span class="dlink" v-html="item[sub.prop]" />
                  </div>
                  <div v-else-if="sub.prop in design_select">
                    {{ item[sub.prop] | formatterFun(design_select[sub.prop].values, design_select[sub.prop].labels) }}
                  </div>
                  <div v-else>
                    {{ item[sub.prop] }}
                  </div>
                </div>
              </div>
            </div>
            <div class="handle">
              <div @click="handleUpdate(item, index)">
                修改
              </div>
              <div @click="handleRemove(index)">
                删除
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="dialogVisible" :overlay="false" position="right" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar
        left-text="返回"
        left-arrow
        @click-left="dialogVisible = false"
      >
        <template slot="right">
          <span @click="handleAddInnerObj">确定</span>
        </template>
      </van-nav-bar>
      <div class="obj-box">
        <generate-form-mobile v-if="showForm" ref="innerObjForm" :data="innerObjData" :remote="remoteFuncs" :value="editData" />
      </div>
    </van-popup>
  </div>
</template>
<script>

export default {
  filters: {
    formatterFun: function(value, values, labels) {
      if (!value) return value
      const index = values.indexOf(value)
      if (index !== -1) {
        return labels[index]
      }
    }
  },
  props: ['value', 'models', 'remote', 'blanks', 'disabled', 'widget', 'helpers', 'id'],
  data() {
    const that = this
    return {
      dataModel: this.value,
      objectData: this.value,
      dataModels: this.models,
      headers: [],
      proj_code: this.widget.options.proj_code,
      object_code: this.widget.options.object_code,
      page_code: this.widget.options.page_code,
      can_create: false,
      is_view: false,
      dialogVisible: false,
      innerObjData: {},
      editData: {},
      remoteFuncs: {
        remote_http_get(uri, body) {
          if (uri) {
            return that.$Utils.request({
              url: uri,
              method: 'get',
              params: body
            })
          } else {
            return new Promise((resolve, reject) => {
              resolve()
            })
          }
        },
        remote_http_post(uri, body) {
          if (uri) {
            return that.$Utils.request({
              url: uri,
              method: 'post',
              data: body
            })
          } else {
            return new Promise((resolve, reject) => {
              resolve()
            })
          }
        }
      },
      isUpdate: false,
      updateIndex: 0,
      design_select: {},
      showForm: false
    }
  },
  watch: {
    value(val) {
      this.objectData = val
    },
    objectData(val) {
      this.$emit('input', val)
    },
    dataModels: {
      deep: true,
      handler(val) {
        this.$emit('update:models', val)
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModels = val
      }
    },
    dialogVisible(val) {
      if (!val) {
        setTimeout(() => {
          this.showForm = false
        }, 300)
      } else {
        this.showForm = true
      }
    }
  },
  created() {
    this.get_object_info()
    this.get_design_select()
  },
  methods: {
    fetchData() {
      this.$Apis.object.get_headers_by_code(this.proj_code, this.object_code, this.page_code, false).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers = response.payload
          this.headers.forEach(element => {
            this.$set(element, 'columns', {})
            this.innerObjData.list.forEach(item => {
              if (element.prop === item.model) {
                element.columns = item
              }
            })
          })
        }
      })
    },
    get_object_info() {
      this.$Apis.object.object_info(this.proj_code, this.object_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.is_view = response.payload.is_view
          this.innerObjData = JSON.parse(response.payload.design_form)
          this.fetchData()
          if (!this.page_code) {
            this.can_create = response.payload.can_create
          } else {
            this.get_page_info()
          }
        } else {
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    get_page_info() {
      this.$Apis.object.page_info_by_code(this.proj_code, this.object_code, this.page_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.can_create = response.payload.can_create
        } else {
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    get_design_select() {
      this.$Apis.object.get_design_select_by_code(this.proj_code, this.object_code, this.page_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.design_select = response.payload
        }
      })
    },
    create() {
      this.editData = {}
      this.isUpdate = false
      this.dialogVisible = !this.dialogVisible
    },
    handleAddInnerObj() {
      this.$refs.innerObjForm.getData().then(data => {
        if (this.isUpdate) {
          this.objectData[this.updateIndex] = data
        } else {
          this.objectData.push(data)
        }
        this.dialogVisible = !this.dialogVisible
      }).catch(e => {
        // 数据校验失败
      })
    },
    handleUpdate(item, index) {
      this.isUpdate = true
      this.updateIndex = index
      this.editData = item
      this.dialogVisible = !this.dialogVisible
    },
    handleRemove(index) {
      this.objectData.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.obj-box {
  max-height: calc(100vh - 46px);
  overflow-y: auto;
}

</style>
