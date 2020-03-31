<template>
  <div class="content" @click="onClick">
    message: {{value}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    value: String
  },
  methods: {
    onClick() {
      this.$emit('input', 'Child Message')
    }
  }
}
</script>
