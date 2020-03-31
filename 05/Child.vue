<template>
  <div class="content" @click="onClick">
    message: {{value}}
  </div>
</template>
<script>
import emitter from "./emitter.js";
export default {
  name: 'Child',
  mixins: [emitter],
  data() {
    return {
      value: 'Child Message'
    }
  },
  methods: {
    onClick() {
      this.dispatch('Father', 'sendMessage', 'Child Message')
    }
  },
  beforeMount() {
    this.$on('sendMessage', (msg) => {
      this.value = `获取信息${msg}`
    })
  }
}
</script>
