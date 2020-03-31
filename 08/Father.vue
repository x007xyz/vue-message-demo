<template>
  <div class="content">
    message: {{store.message}}
    <Child :value="message" @input="onMessage"></Child>
  </div>
</template>
<script>
import Vue from "vue";
import Child from "./Child.vue";
import store from "./store.js";
export default Vue.extend({
  name: 'Father',
  components: { Child },
  data () {
    return {
      store
    }
  }
})
</script>
