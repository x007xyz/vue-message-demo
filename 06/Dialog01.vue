<template>
  <el-dialog :visible.sync="visible" title="Dialog">
    <el-input v-model="message" type="textarea" rows="3"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Dialog, Input, Button } from "element-ui";
import 'element-ui/lib/theme-chalk/index.css'
export default {
  name: 'Dialog',
  components: { ElDialog: Dialog, ElInput: Input, ElButton: Button },
  data () {
    return {
      visible: false,
      message: ''
    }
  },
  methods: {
    show (message) {
      this.visible = true
      this.message = message
    },
    confirm() {
      this.$emit('sendMessage', this.message)
      this.visible = false
    }
  }
}
</script>
