<template>
  <div class="content">
    <el-button type="primary" @click="showDialog">显示Dialog</el-button>
    message: {{message}}
    <Dialog :visible.sync="visible" :default-value="message" @sendMessage="message = $event"></Dialog>
    <el-button type="primary" @click="showDialog01">显示Dialog01</el-button>
    message01: {{message01}}
    <Dialog01 ref="dialog" @sendMessage="message01 = $event"></Dialog01>
  </div>
</template>
<script>
import Vue from "vue";
import Dialog from "./Dialog.vue";
import Dialog01 from "./Dialog01.vue";
import { Button } from "element-ui";
export default Vue.extend({
  name: 'Father',
  components: { Dialog, Dialog01, ElButton: Button },
  data () {
    return {
      visible: false,
      message: 'Father Message',
      message01: 'Father Message01'
    }
  },
  methods: {
    showDialog () {
      this.visible = true
    },
    showDialog01 () {
      this.$refs.dialog.show(this.message01)
    }
  }
})
</script>
