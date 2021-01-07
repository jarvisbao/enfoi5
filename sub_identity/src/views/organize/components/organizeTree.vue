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
      node-key="org_code"
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span class="tree-list">
          <i v-if="updatePermission && data._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-edit" @click="organize_update(data.org_code)" />
          <i v-if="data._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-view" @click="organize_info(data.org_code, data.name)" />
          <i v-if="removePermission && data._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-delete" @click="organize_delete(data.org_code)" />
          <span v-if="removePermission && data._status === $Utils.Constlib.BaseStatusEnum.deleted" class="assignments-btn" @click="active_organize(data.org_code)">激活</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>

export default {
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
    }
  },
  data() {
    return {
      tree_items: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      status: 'all'
    }
  },
  watch: {
    text(val) {
      this.$refs.tree.filter(val)
    }
  },
  beforeDestroy() {
    this.$Utils.EventBus.$off('refreshTree')
    this.$Utils.EventBus.$off('add-refresh')
  },
  mounted() {
    // 修改局部刷新
    this.$Utils.EventBus.$on('refreshTree', org_code => {
      if (Array.isArray(org_code)) {
        org_code.forEach(item => {
          const node = this.$refs.tree.getNode(item)
          node.parent.loaded = false
          node.parent.expand()
        })
      } else {
        const node = this.$refs.tree.getNode(org_code)
        node.parent.loaded = false
        node.parent.expand()
      }
    })
    // 添加数据回显
    this.$Utils.EventBus.$on('add-refresh', (events) => {
      if (events.parent_code) {
        const parendNode = this.$refs.tree.getNode(events.parent_code)
        this.$refs.tree.append(events, parendNode)
      } else {
        this.$refs.tree.append(events)
      }
    })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    organize_update(org_code) {
      this.$emit('organize_update', org_code)
    },
    organize_info(org_code, name) {
      this.$router.push({ name: 'organize_info', query: { org_code: org_code, name: name }})
    },
    organize_delete(org_code) {
      this.$emit('organize_delete', org_code)
    },
    active_organize(org_code) {
      this.$emit('active_organize', org_code)
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.treeNode = node
        this.treeResolve = resolve
        var treeItems = []
        this.$Apis.organize.organize_list(null, null, null, true, this.pagination.page, this.page_size, true, this.status).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            treeItems = response.payload.items
            const page = response.payload.pagination.page
            const count = response.payload.pagination.pages
            // 如果返回的节点数据大于一页，则添加 “加载更多” 节点，用于分页加载子节点数据
            if (page !== count) {
              treeItems.push({
                name: '加载更多',
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
      }
      if (node.level >= 1) {
        setTimeout(() => {
          var data = []
          if (node.data.org_code) {
            this.$Apis.organize.organize_list(node.data.org_code, null, null, true, this.pagination.page, this.page_size, false, this.status).then(response => {
              if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                data = response.payload.items
                const page = response.payload.pagination.page
                const count = response.payload.pagination.pages
                // 如果返回的子节点数据大于一页，则添加 “加载更多” 节点，用于分页加载子节点数据
                if (page !== count && count !== 0) {
                  data.push({
                    name: '加载更多',
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
        var parend_id = null
        var tree = false
        if (data.isTree) {
          parend_id = null
          tree = true
        } else {
          parend_id = data.pNode.org_code
          tree = false
        }
        const page = ++data.index
        const refData = JSON.parse(JSON.stringify(data))
        refData.id = new Date().getTime() + ''
        this.$Apis.organize.organize_list(parend_id, null, null, true, page, this.page_size, tree, this.status).then(response => {
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
