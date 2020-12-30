<template>
  <div class="widget-container">
    <el-container>
      <el-aside width="380px" class="widget-aside">
        <el-button plain size="medium" @click="goBack">
          返回
        </el-button>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <ul :list="widgetItem" class="widget-list">
            <template v-for="(item, index) in widgetItem">
              <li v-if="item.content_config !== null && JSON.parse(item.content_config).border" :id="'wdgt_' + item.wdgt_id" :key="index" :style="{borderColor: JSON.parse(item.content_config).border==='obvious'?item.wdgt_color:''}" :class="{hasColor: JSON.parse(item.content_config).border==='obvious'?item.wdgt_color:''}">
                <div :style="{background: JSON.parse(item.content_config).border==='obvious'?item.wdgt_color:'', borderColor: JSON.parse(item.content_config).border==='obvious'?item.wdgt_color:''}" class="title">
                  <span><i v-if="item.wdgt_icon" :class="item.wdgt_icon" />{{ item.wdgt_title }}</span>
                  <div class="tools-bar">
                    <i class="el-icon-edit" @click="updateWdgt(item)" />
                    <i class="el-icon-delete" @click="removeWdgt(item.wdgt_id)" />
                  </div>
                </div>
                <div class="desc">
                  {{ item.wdgt_summary }}
                </div>
              </li>
              <li v-else :id="'wdgt_' + item.wdgt_id" :key="index" :style="{borderColor: item.wdgt_color?item.wdgt_color:''}" :class="{hasColor: item.wdgt_color?item.wdgt_color:''}">
                <div :style="{background: item.wdgt_color?item.wdgt_color:'', borderColor: item.wdgt_color?item.wdgt_color:''}" class="title">
                  <span><i v-if="item.wdgt_icon" :class="item.wdgt_icon" />{{ item.wdgt_title }}</span>
                  <div class="tools-bar">
                    <i class="el-icon-edit" @click="updateWdgt(item)" />
                    <i class="el-icon-delete" @click="removeWdgt(item.wdgt_id)" />
                  </div>
                </div>
                <div class="desc">
                  {{ item.wdgt_summary }}
                </div>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <!-- <update-info :widget-info="widgetInfo" /> -->
        <widget-update :is-portal="true" :widget-info="widgetInfo" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
// import updateInfo from './components/updateInfo'

export default {
  components: {
    // updateInfo
  },
  data() {
    return {
      widgetItem: [],
      widgetInfo: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$Apis.widget.widget_list().then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.widgetItem = response.payload.items
        }
      })
    },
    updateWdgt(item) {
      this.widgetInfo = item
    },
    removeWdgt(wdgt_id) {
      this.$confirm('确定要删除这个Widget吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Apis.widget.widget_remove(wdgt_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.$router.go(0)
          } else {
            alert(response.message)
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.widget-container {
  .widget-list {
    margin-top: 20px;
    li {
      cursor: text;
    }
  }
}
</style>

