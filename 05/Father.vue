<template>
  <div class="content" @click="onClick">
    message: {{message}}
    <Child></Child>
  </div>
</template>
<script>
import Vue from "vue";
import emitter from "./emitter.js";
import Child from "./Child.vue";
export default Vue.extend({
  name: 'Father',
  components: { Child },
  mixins: [emitter],
  data () {
    return {
      message: 'Father Message'
    }
  },
  methods: {
    onClick () {
      this.broadcast('Child', 'sendMessage', 'Father Message')
    }
  },
  beforeMount() {
    this.$on('sendMessage', (msg) => {
      this.message = `获取信息${msg}`
    })
  }
})
</script>
