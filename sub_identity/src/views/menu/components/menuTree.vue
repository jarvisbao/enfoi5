<template>
  <div class="list-to-tree">
    <el-tree ref="tree" :data="tree_items" :props="defaultProps" :filter-node-method="filterNode" :load="loadNode" :expand-on-click-node="false" lazy node-key="menu_id" @node-click="handleNodeClick">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label.title }}</span>
        <span class="tree-list">
          <i v-if="updatePermission" class="el-icon-edit" @click="menu_update(data.menu_code)" />
          <i class="el-icon-view" @click="menu_info(data.menu_code, data.label)" />
          <i v-if="removePermission" class="el-icon-delete" @click="menu_delete(data.menu_id)" />
          <span v-if="assignPermission" class="assignments-btn" @click="menu_assignments(data.menu_code, data.label)">授权</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import { instance as Vue } from '@/life-cycle'
const EventBus = Vue.$Utils.EventBus
export default {
  components: {
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    updatePermission: {
      type: Boolean,
      default: false
    },
    removePermission: {
      type: Boolean,
      default: false
    },
    assignPermission: {
      type: Boolean,
      default: false
    },
    device: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      tree_items: [],
      defaultProps: {
        children: 'children',
        label: 'meta',
        isLeaf: 'leaf'
      },
      treeNode: [],
      treeResolve: [],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10
    }
  },
  watch: {
    text(val) {
      this.$refs.tree.filter(val)
    }
  },
  beforeDestroy() {
    EventBus.$off('refreshTree')
    EventBus.$off('delete-refresh')
    EventBus.$off('add-refresh')
  },
  mounted() {
    // 修改局部刷新
    EventBus.$on('refreshTree', (menu_id) => {
      const node = this.$refs.tree.getNode(menu_id)
      node.parent.loaded = false
      node.parent.expand()
    })
    // 删除数据回显
    EventBus.$on('delete-refresh', menu_id => {
      this.$refs.tree.getNode(menu_id).remove()
    })
    // 添加数据回显
    EventBus.$on('add-refresh', (events) => {
      if (events.parent_id) {
        const parendNode = this.$refs.tree.getNode(events.parent_id)
        this.$refs.tree.append(events, parendNode)
      } else {
        this.$refs.tree.append(events)
      }
    })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.meta.title.toLowerCase().indexOf(value) !== -1
    },
    menu_update(res_id) {
      this.$emit('menu_update', res_id)
    },
    menu_info(menu_code, title) {
      this.$router.push({ name: 'menu_info', query: { menu_code: menu_code, title: title }})
    },
    menu_delete(res_id) {
      this.$emit('menu_delete', res_id)
    },
    menu_assignments(menu_code, title) {
      this.$emit('tree_menu_assignments', { menu_code, title })
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.treeNode = node
        this.treeResolve = resolve
        var treeItems = []
        this.$Apis.menu.menu_list(null, null, true, this.pagination.page, this.page_size, this.device).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            treeItems = response.payload.items
            const page = response.payload.pagination.page
            const count = response.payload.pagination.pages
            // 如果返回的节点数据大于一页，则添加 “加载更多” 节点，用于分页加载子节点数据
            if (page !== count && count !== 0) {
              treeItems.push({
                meta: { title: '加载更多' },
                id: new Date().getTime() + '',
                isLoadMoreNode: true,
                index: response.payload.pagination.page,
                pNode: node.data,
                isParent: false,
                isTree: true,
                leaf: true
              })
            }
            resolve(treeItems)
          } else {
            resolve([])
          }
        })
      }
      if (node.level >= 1) {
        setTimeout(() => {
          var data = []
          if (node.data.menu_code) {
            this.$Apis.menu.menu_list(node.data.menu_code, null, true, this.pagination.page, this.page_size, this.device).then(response => {
              if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                data = response.payload.items
                const page = response.payload.pagination.page
                const count = response.payload.pagination.pages
                // 如果返回的子节点数据大于一页，则添加 “加载更多” 节点，用于分页加载子节点数据
                if (page !== count && count !== 0) {
                  data.push({
                    meta: { title: '加载更多' },
                    id: new Date().getTime() + '',
                    isLoadMoreNode: true,
                    index: response.payload.pagination.page,
                    pNode: node.data,
                    isParent: false,
                    isTree: false,
                    leaf: true
                  })
                }
                resolve(data)
              } else {
                resolve([])
              }
            })
          }
        }, 500)
      }
    },
    handleNodeClick(data, node) {
      // 点击时判断节点是否为加载更多的节点, 如果是, 请求下一页数据, 并将此节点移除
      if (!data.isParent && data.isLoadMoreNode) {
        var parent_code = null
        if (data.isTree) {
          parent_code = null
        } else {
          parent_code = data.pNode.menu_code
        }
        const page = ++data.index
        const refData = JSON.parse(JSON.stringify(data))
        refData.id = new Date().getTime() + ''
        this.$Apis.menu.menu_list(parent_code, null, true, page, this.page_size, this.device).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            const nodeData = response.payload.items
            const page = response.payload.pagination.page
            const count = response.payload.pagination.pages
            nodeData.forEach(item => {
              this.$refs.tree.insertBefore(item, node)
            })
            // 判断如果不是最后一页则添加 “加载更多” 节点
            if (page !== count && count !== 0) {
              this.$refs.tree.insertBefore(refData, node)
            }
            this.$nextTick(() => {
              this.$refs.tree.remove(node)
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.assignments-btn {
  position: relative;
  top: -4px;
}
</style>
