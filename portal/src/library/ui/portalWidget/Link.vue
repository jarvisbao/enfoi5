<template>
  <component v-bind="linkProps(addon)">
    <slot />
  </component>
</template>
<script>
export default {
  props: {
    addon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    linkProps(addon) {
      if (addon === 'portal') {
        return {
          is: 'router-link',
          to: '/widget'
        }
      }
      return {
        is: 'a',
        href: `/widget?name=${addon}`
      }
    }
  }
}
</script>