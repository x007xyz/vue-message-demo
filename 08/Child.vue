<template>
  <div class="content" @click="onClick">
    message: {{store.message}}
  </div>
</template>
<script>
import store from "./store.js";
export default {
  name: 'Child',
  props: {
    value: String
  },
  data () {
    return {
      store
    }
  },
  methods: {
    onClick() {
      this.store.message = 'Child Message'
    }
  }
}
</script>
