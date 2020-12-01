<template>
  <div class="theme-picker">
    <el-dropdown>
      <span :style="{ background: current }" class="el-dropdown-link">
        <i class="el-icon-arrow-down" />
      </span>
      <el-dropdown-menu slot="dropdown" class="dropdown-ul">
        <el-dropdown-item v-for="(item, i) in list" :key="i" class="dropdown-li">
          <span
            :style="{ background: item.value }"
            :class="{ active: current == item.value }"
            @click="change(item)"
          />
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        { value: '#304156', key: 'darkBlue' },
        { value: '#212121', key: 'black' },
        { value: '#0b75e2', key: 'blue' },
        { value: '#ef5c5c', key: 'red' },
        { value: '#e1791d', key: 'orange' },
        { value: '#891cdc', key: 'purple' },
        { value: '#52a22b', key: 'green' },
        { value: '#53585f', key: 'gray' }
      ],
      // current: localStorage.theme ? localStorage.theme : '#304156'
      current: '#304156'
    }
  },
  methods: {
    change(val) {
      // localStorage.theme = val.value
      this.current = val.value
      document.body.className = 'body-theme-' + val.key
      document.documentElement.style.setProperty('--Main', val.value)
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
  width: 200px;
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
        outline: 2px solid #bfafaf;
      }
    }
  }
}
</style>
