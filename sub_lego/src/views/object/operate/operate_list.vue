<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn">
      <div id="create" class="btn create-btn" @click="create">
        新建
      </div>
      <div id="object" class="btn" @click="goObject">
        对象定义
      </div>
      <div id="page" class="btn" @click="goPage">
        界面定义
      </div>
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" />
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="itemsMange"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        v-if="isMultiple"
        type="selection"
        width="55"/> -->
      <el-table-column
        prop="operate_name"
        label="名称"
        width="220"
        show-overflow-tooltip
      />
      <el-table-column
        prop="operate_type"
        label="类型"
        width="220"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.operate_type===1">
            批量处理
          </template>
          <template v-if="scope.row.operate_type===2">
            批量修改
          </template>
          <template v-if="scope.row.operate_type===3">
            个性修改
          </template>
          <template v-if="scope.row.operate_type===4">
            定制操作POST
          </template>
          <template v-if="scope.row.operate_type===5">
            定制操作GET
          </template>
          <template v-if="scope.row.operate_type===6">
            定制批量操作POST
          </template>
          <template v-if="scope.row.operate_type===7">
            定制批量操作GET
          </template>
          <template v-if="scope.row.operate_type===8">
            类“新建”操作
          </template>
        <template v-if="scope.row.operate_type===9">文件导入操作</template>
        <!-- <template v-if="scope.row.operate_type==='10'">固定过滤策略</template> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="summary"
        label="描述"
        show-overflow-tooltip
      />
      <el-table-column
        fixed="right"
        align="right"
        width="130"
      >
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="update(scope.row.mtd_id)" />
          <i class="el-icon-delete" @click="remove(scope.row.mtd_id)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import CommonTitle from '@/components/CommonTitle'

export default {
  components: {
    CommonTitle
  },
  data() {
    return {
      loading: false,
      items: [],
      text: null,
      mtd_ids: [],
      object_id: null
    }
  },
  computed: {
    itemsMange() {
      const text = this.text
      if (text) {
        return this.items.filter(data => {
          return Object.keys(data).some(key => {
            return String(data[key]).toLowerCase().indexOf(text) > -1
          })
        })
      }
      return this.items
    }
  },
  watch: {
    'pagination.total': function(val) {
      if (this.pagination.total === (this.pagination.page - 1) * this.page_size && this.pagination.total !== 0) {
        this.pagination.page -= 1
        this.fetchData()
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    get_object_id() {
      if ('object_id' in this.$route.query) {
        this.object_id = this.$route.query.object_id
        return this.object_id
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      const object_id = this.get_object_id()
      this.$Apis.object.method_list_by_id(object_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.loading = false
          this.items = response.payload.items
        }
      })
    },
    create() {
      const object_id = this.get_object_id()
      this.$router.push({ name: 'operate_create', query: { object_id: object_id }})
    },
    update(mtd_id) {
      this.$router.push({ name: 'operate_update', query: { mtd_id: mtd_id }})
    },
    remove(mtd_id) {
      this.$confirm('是否删除该操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.object.method_delete(mtd_id).then(response => {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.refresh()
            }
          })
        })
      }).catch(() => {
      })
    },
    refresh() {
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.mtd_ids = []
      val.forEach(element => {
        this.mtd_ids.push(element.mtd_id)
      })
    },
    removes() {
      if (JSON.stringify(this.mtd_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.object.method_delete(this.mtd_ids).then(response => {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.refresh()
            }
          })
        })
      }).catch(() => {
      })
    },
    goObject() {
      this.$Apis.object.object_info_by_id(this.object_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const proj_code = response.payload.proj_code
          const object_code = response.payload.object_code
          const name = response.payload.object_name
          this.$router.push({ name: 'object_update', query: { proj_code: proj_code, object_code: object_code, name: name }})
        }
      })
    },
    goPage() {
      this.$router.push({ name: 'page_list', query: { object_id: this.object_id, name: this.$route.query.name }})
    }
  }
}
</script>

