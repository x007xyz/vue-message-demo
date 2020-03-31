<template>
  <div class="content">
    <Child></Child>
  </div>
</template>
<script>
import Child from "./Child.vue";
export default {
  name: 'Mid',
  components: { Child },
  data () {
    return {
    }
  }
}
</script>
<style lang="css" scoped>
</style>
