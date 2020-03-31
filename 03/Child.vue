<template>
  <el-input v-bind="$attrs" v-on="events" :value="value" @input="onInput">
  </el-input>
</template>
<script>
import { Input } from "element-ui";
import 'element-ui/lib/theme-chalk/index.css'
export default {
  name: 'Child',
  components: { ElInput: Input },
  // 默认为true，没有在props的定义的属性，将会作为普通的html属性定义在组件的根元素上，设置为false，将传递给$attrs
  inheritAttrs: false,
  props: {
    value: [String, Number],
    decimal: {
      type: Number,
      default: 2
    }
  },
  computed: {
    // 定义事件，并且排除我们需要处理的input事件，v-on通过对象绑定事件可以和单独绑定同名事件共存，并且两者都生效
    events () {
      let ret = {}
      Object.keys(this.$listeners).forEach(key => {
        if (key !== 'input') {
          ret[key] = this.$listeners[key]
        }
      })
      return ret
    }
  },
  methods: {
    onInput (value) {
      const reg = new RegExp(`^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,${this.decimal}})?$`)
      if (reg.test(value) || value === '') {
        this.$emit('input', value)
      }
    }
  }
}
</script>
