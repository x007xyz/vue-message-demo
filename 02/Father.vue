<template>
  <div class="content">
    message: {{message}}
    <Child v-model="message"></Child>
    message01: {{message01}}
    <Child01 v-model="message01"></Child01>
    message02: {{message02}}
    <Child02 :msg.sync="message02"></Child02>
    message03: {{message03}}
    <Child03 v-bind.sync="message03"></Child03>
  </div>
</template>
<script>
import Vue from "vue";
import Child from "./Child.vue";
import Child01 from "./Child01.vue";
import Child02 from "./Child02.vue";
import Child03 from "./Child03.vue";
export default Vue.extend({
  name: 'Father',
  components: { Child, Child01, Child02, Child03 },
  data () {
    return {
      message: 'Father Message',
      message01: 'Father Message01',
      message02: 'Father Message02',
      message03: {
        msg: 'Father Msg',
        msg01: 'Father Msg01'
      }
    }
  }
})
</script>
