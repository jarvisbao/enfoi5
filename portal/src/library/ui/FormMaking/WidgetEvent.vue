<template v-if="data.options.events">
  <div>
    <el-form-item
      v-for="(item,event_name) in data.options.events"
      :key="event_name"
      :label="event_name+'事件'"
    >
      <el-input v-model="data.options.events[event_name].func_name" style="width:80%" />
      <i class="el-icon-edit event-icon" @click="set_script(event_name)" />
      <i class="el-icon-delete event-icon" @click="remove_script(event_name)" />
      <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="title" :close-on-click-modal="false" append-to-body>
        <pythonCodemirror :prop_code="prop_code" :param-code="param_code" placeholder="函数主体部分" code-mode="javascript" @get_code="get_code($event)" />
        <div v-if="variable" class="tips">
          参数: {{ variable }}
        </div>
      </el-dialog>
    </el-form-item>
  </div>
</template>

<script>
import pythonCodemirror from '../pythonCodemirror'
export default {
  name: 'WidgetEvent',
  components: {
    pythonCodemirror
  },
  props: ['data'],
  data() {
    return {
      dialogVisible: false,
      title: this.data.name,
      param_code: '',
      prop_code: '',
      variable: ''
    }
  },
  methods: {
    set_script(event_name) {
      this.dialogVisible = !this.dialogVisible
      var func_name = this.data.options.events[event_name].func_name
      if (!func_name) {
        const key = new Date().getTime() + ''
        func_name = 'func_' + key
        this.data.options.events[event_name].func_name = func_name
      }
      this.title = this.data.name + '的' + event_name + '事件'
      this.param_code = event_name
      this.prop_code = this.data.options.events[event_name].func_body
      this.variable = this.data.options.events[event_name].tips
    },
    get_code(value) {
      for (var event_name in value) {
        this.data.options.events[event_name].func_body = value[event_name]
      }
    },
    remove_script(event_name) {
      this.data.options.events[event_name].func_name = ''
      this.data.options.events[event_name].func_body = ''
    }
  }
}
</script>

<style scoped lang="scss">
.event-icon {
  margin-left: 8px;
  font-size: 17px;
  cursor: pointer;
  &:hover {
    color: rgb(38, 126, 241);
  }
}
</style>
