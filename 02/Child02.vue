<template>
  <div class="content" @click="onClick">
    message: {{msg}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    msg: String
  },
  methods: {
    onClick() {
      this.$emit('update:msg', 'Child Message')
    }
  }
}
</script>
