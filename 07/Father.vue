<template>
  <div class="content">
    message: {{message}}
    <Child @input="onMessage"></Child>
  </div>
</template>
<script>
import Vue from "vue";
import Child from "./Child.vue";
export default Vue.extend({
  name: 'Father',
  components: { Child },
  data() {
    return {
      message: 'Father message'
    }
  },
  beforeMount() {
    this.$bus.$on('fatherEvent', (msg) => {
      this.message = `接受子组件信息${msg}`
    })
    this.$bus.$emit('childEvent', this.message)
  }
})
</script>
