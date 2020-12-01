
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)" @click.native="set_menuaccess(menuid, to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/library/js/validate'
import { set_menuaccess } from '@/library/api/widget'

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    menuid: {
      type: String,
      required: true
    }
  },
  // 接收注入的数据
  inject: ['reload'],
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    },
    set_menuaccess(menuid, to) {
      set_menuaccess(menuid)
      this.reload()
      this.$store.commit('SET_RELOAD', to)
    }
  }
}
</script>
