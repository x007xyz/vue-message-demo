<template>
  <div class="content">
    <Mid></Mid>
  </div>
</template>
<script>
import Vue from "vue";
import Mid from "./Mid.vue";
export default Vue.extend({
  name: 'Father',
  components: { Mid },
  provide () {
    return {
      father: this,
      msg: 'Father Message',
      obj: this.obj
    }
  },
  data () {
    return {
      obj: {
        message: 'Father Obj Message'
      }
    }
  },
  methods: {
    onMessage (msg) {
      console.log('接受信息', msg)
    }
  }
})
</script>
