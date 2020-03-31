<template>
  <div class="content">
    <Child v-model="message" @focus="onFocus" placeholder="默认提示"></Child>
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
      message: ''
    }
  },
  methods: {
    onFocus () {
      console.log('focus 触发')
    }
  }
})
</script>
