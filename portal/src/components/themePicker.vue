<template>
  <div class="theme-picker">
    <el-dropdown>
      <span :style="{ background: on }" class="el-dropdown-link">
        <i class="el-icon-arrow-down" />
      </span>
      <el-dropdown-menu slot="dropdown" class="dropdown-ul">
        <el-dropdown-item v-for="(item, i) in list" :key="i" class="dropdown-li">
          <span
            :style="{ background: item.value }"
            :class="{ active: current == item.label }"
            @click="change(item)"
          />
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [
        { value: '#252a2e', label: 'black' },
        { value: '#0278ae', label: 'blue' },
        { value: '#ef5c5c', label: 'red' },
        { value: '#e1791d', label: 'orange' },
        { value: '#583d72', label: 'purple' },
        { value: '#378810', label: 'green' }
      ],
      current: 'black',
      on: '#252a2e'
    }
  },
  computed: {
    ...mapGetters([
      'userProps'
    ])
  },
  created() {
    this.current = localStorage.theme || this.userProps.theme
  },
  mounted() {
    document.body.className = `theme-${this.current}`
    const obj = this.list.find(item => item.label === this.current)
    this.on = obj.value
  },
  methods: {
    change(val) {
      localStorage.theme = val.label
      this.current = val.label
      this.on = val.value
      document.body.className = `theme-${val.label}`
      const params = {
        props: Object.assign(this.userProps, {
          theme: val.label
        })
      }
      this.$Apis.user.user_update_props(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-picker {
  margin-right: 20px;
  .el-dropdown {
    padding: 4px;
    line-height: 1;
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, .4);
    border-radius: 4px;
  }
  .el-dropdown-link {
    display: block;
    width: 22px;
    height: 22px;
    border: 1px solid rgba(255, 255, 255, .8);
    text-align: center;
    line-height: 22px;
    color: #fff;
    border-radius: 2px;
    opacity: 0.8;
  }
}
</style>
<style lang="scss">
.dropdown-ul {
  display: flex;
  width: 140px;
  flex-wrap: wrap;
  .dropdown-li {
    margin: 5px 0;
    padding: 0 10px;
    line-height: 1;
    &:hover {
      background: transparent;
    }
    span {
      display: inline-block;
      width: 25px;
      height: 25px;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.75);
      &.active,
      &:hover {
        outline: 2px solid #dd5d2a;
      }
    }
  }
}
</style>
