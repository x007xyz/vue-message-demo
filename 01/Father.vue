<template>
  <div class="content">
    <Child :value="message" @input="onMessage"></Child>
  </div>
</template>
<script>
import Vue from "vue";
import Child from "./Child.vue";
export default Vue.extend({
  name: 'Father',
  components: { Child },
  data () {
    return {
      message: 'Father Message'
    }
  },
  methods: {
    onMessage (msg) {
      console.log('接受子组件信息', msg)
    }
  }
})
</script>
