<template>
  <div class="list-to-tree">
    <el-tree
      ref="tree"
      :data="tree_items"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :load="loadNode"
      :expand-on-click-node="false"
      lazy
      show-checkbox
      check-strictly
      node-key="res_id"
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <!-- <span class="tree-list" @click="go_resource_list(data)">查看列表</span> -->
        <span class="tree-list">
          <i v-if="updatePermission" class="el-icon-edit" @click="resource_update(data.res_id)" />
          <i class="el-icon-view" @click="resource_info(data.namespace, data.text)" />
          <i v-if="removePermission" class="el-icon-delete" @click="resource_delete(data.res_id)" />
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  props: {
    updatePermission: {
      type: Boolean,
      default: false
    },
    removePermission: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tree_items: [],
      defaultProps: {
        children: 'children',
        label: 'text',
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
    this.$Utils.EventBus.$off('refreshTree')
    this.$Utils.EventBus.$off('delete-refresh')
    this.$Utils.EventBus.$off('add-refresh')
  },
  mounted() {
    // 修改局部刷新
    this.$Utils.EventBus.$on('refreshTree', (res_id) => {
      const node = this.$refs.tree.getNode(res_id)
      node.parent.loaded = false
      node.parent.expand()
    })
    // 删除数据回显
    this.$Utils.EventBus.$on('delete-refresh', res_id => {
      if (Array.isArray(res_id)) {
        res_id.forEach(item => {
          this.$refs.tree.getNode(item).remove()
        })
      } else {
        this.$refs.tree.getNode(res_id).remove()
      }
    })
    // 添加数据回显
    this.$Utils.EventBus.$on('add-refresh', (events) => {
      if (events.parent_namespace) {
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
      return data.text.toLowerCase().indexOf(value) !== -1
    },
    resource_update(res_id) {
      this.$emit('resource_update', res_id)
    },
    resource_info(namespace, text) {
      this.$router.push({ name: 'resource_info', query: { namespace: namespace, text: text }})
    },
    resource_delete(res_id) {
      this.$emit('resource_delete', res_id)
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.treeNode = node
        this.treeResolve = resolve
        var treeItems = []
        this.$Apis.resource.resource_list(null, null, true, this.pagination.page, this.page_size, true).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            treeItems = response.payload.items
            const page = response.payload.pagination.page
            const count = response.payload.pagination.pages
            // 如果返回的节点数据大于一页，则添加 “加载更多” 节点，用于分页加载子节点数据
            if (page !== count && count !== 0) {
              treeItems.push({
                text: '加载更多',
                id: new Date().getTime() + '',
                isLoadMoreNode: true,
                index: response.payload.pagination.page,
                pNode: node.data,
                isParent: false,
                isTree: true,
                leaf: true,
                disabled: true
              })
            }
            resolve(treeItems)
          } else {
            resolve([])
          }
        })
        // return resolve(treeItems)
      }
      if (node.level >= 1) {
        setTimeout(() => {
          var data = []
          if (node.data.namespace) {
            this.$Apis.resource.resource_list(node.data.namespace, null, true, this.pagination.page, this.page_size).then(response => {
              if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                data = response.payload.items
                const page = response.payload.pagination.page
                const count = response.payload.pagination.pages
                // 如果返回的子节点数据大于一页，则添加 “加载更多” 节点，用于分页加载子节点数据
                if (page !== count && count !== 0) {
                  data.push({
                    text: '加载更多',
                    id: new Date().getTime() + '',
                    isLoadMoreNode: true,
                    index: response.payload.pagination.page,
                    pNode: node.data,
                    isParent: false,
                    isTree: false,
                    leaf: true,
                    disabled: true
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
        var namespace = null
        var tree = false
        if (data.isTree) {
          namespace = null
          tree = true
        } else {
          namespace = data.pNode.namespace
          tree = false
        }
        const page = ++data.index
        const refData = JSON.parse(JSON.stringify(data))
        refData.id = new Date().getTime() + ''
        this.$Apis.resource.resource_list(namespace, null, true, page, this.page_size, tree).then(response => {
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
    },
    checkHandle() {
      return this.$refs.tree.getCheckedKeys()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
