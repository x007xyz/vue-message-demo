<template>
  <div class="content" @click="onClick">
    message: {{msg}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  model: {
    prop: 'msg',
    event: 'change'
  },
  props: {
    msg: String
  },
  methods: {
    onClick() {
      this.$emit('change', 'Child Message')
    }
  }
}
</script>
