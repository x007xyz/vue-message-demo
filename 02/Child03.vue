<template>
  <div class="content" @click="onClick">
    message: {{msg}}
    message01: {{msg01}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    msg: String,
    msg01: String
  },
  methods: {
    onClick() {
      this.$emit('update:msg', 'Child Message')
      this.$emit('update:msg01', 'Child Message01')
    }
  }
}
</script>
