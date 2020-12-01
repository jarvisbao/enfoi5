
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    isExternal(path) {
      return /^(\/?https?:|mailto:|tel:|\/addon)/.test(path)
    },
    linkProps(url) {
      if (this.isExternal(url)) {
        return {
          is: 'a',
          href: url,
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
