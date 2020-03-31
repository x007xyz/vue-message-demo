# Vue传值与状态管理总结
> 本文相关代码可以查看[此仓库](https://github.com/x007xyz/vue-message-demo)

## 传值基础 - prop与自定义事件

使用prop使得父子组件形成一个单向下行绑定：一般情况下，父级prop的更新会流动到子组件中，但是反过来则不行；子组件向父组件传递数据可以使用自定义事件，在子组件里使用$emit触发事件，然后在在父组件中使用v-on监听相应的事件。
```html
// 代码01 运行yarn dev01
// Father.vue
<template>
  <div class="content">
    <Child :value="message" @input="onMessage"></Child>
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
      message: 'Father Message'
    }
  },
  methods: {
    onMessage (msg) {
      console.log('接受子组件信息', msg)
    }
  }
})
</script>
// Child.vue
<template>
  <div class="content" @click="onClick">
    message: {{value}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    value: String
  },
  methods: {
    onClick() {
      this.$emit('input', 'Child Message')
    }
  }
}
</script>
```
## 基础的组合使用 - v-model与sync
> v-model与sync从本质上来讲是prop与自定义事件的结合使用，不过在写法上进行了缩写，是一个简单的语法糖。

一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件，`v-model="message"`即`:value="message" @input="message = $event"`的缩写，`代码01`的例子我们完全可以使用`v-model`来简化写法。
```html
// 代码02
// Father.vue
<Child v-model="message"></Child>
// Child.vue
<template>
  <div class="content" @click="onClick">
    message: {{value}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    value: String
  },
  methods: {
    onClick() {
      this.$emit('input', 'Child Message')
    }
  }
}
</script>

```
v-model默认使用名为 value 的 prop 和名为 input 的事件，但是你也可以通过`model`选项进行修改：
```html
// 代码02
// Father.vue
<Child01 v-model="message01"></Child01>
// Child01.vue
<template>
  <div class="content" @click="onClick">
    message: {{msg}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  model: {
    prop: 'msg',
    event: 'change'
  },
  props: {
    msg: String
  },
  methods: {
    onClick() {
      this.$emit('change', 'Child Message')
    }
  }
}
</script>
```
`.sync`修饰符与v-model类似，`:value.sync="message"`等同于`:value="message" @update:value="message = $event"`，`.sync`修饰符与`v-model`的不同在于`.sync`不限制prop，但是必须监听事件必须遵守`@update:${prop名}`的规则，另外在同一个组件上你可以使用`.sync`来绑定多个数据，这时可以配合`v-bind`进行进一步的简写。
```html
// 代码02
// Father.vue
<Child02 :msg.sync="message02"></Child02>
<Child03 v-bind.sync="message03"></Child03>
// Child02.vue
<template>
  <div class="content" @click="onClick">
    message: {{value}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    value: String
  },
  methods: {
    onClick() {
      this.$emit('input', 'Child Message')
    }
  }
}
</script>
// Child03.vue
<template>
  <div class="content" @click="onClick">
    message: {{msg}}
    message01: {{msg01}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    msg: String,
    msg01: String
  },
  methods: {
    onClick() {
      this.$emit('update:msg', 'Child Message')
      this.$emit('update:msg01', 'Child Message01')
    }
  }
}
</script>
```

`v-model`和`.sync`可以使我们的语法更加简洁明了，但是也有需要注意的几点：
1. **`v-model`和`.sync`不能和表达式一起使用 (例如 v-bind:title.sync=”doc.title + ‘!’” 是无效的)。取而代之的是，你只能提供你想要绑定的属性名**
2. **将`v-bind.sync`用在一个字面量的对象上，例如`v-bind.sync=”{ title: doc.title }”`，是无法正常工作的，因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。**

## 3.传值技巧 - \$attrs和\$listeners
\$attrs包含了父作用域中不作为 `prop` 被识别 (且获取) 的特性绑定 (`class` 和 `style` 除外)。\$listeners包含了父作用域中的 (不含 `.native` 修饰器的) `v-on` 事件监听器。通过`v-bind="$attrs"`和`v-on="$listeners"`可以直接将属性值和事件监听传入内部组件。当我们对第三方组件进行封装时，我们可以通过`$attrs`和`$listeners`直接将我们不需要处理的属性和事件直接传递给引用的组件，例如对ElementUI的Input组件进行封装使其只能输入数字，同时保留Input组件原有的事件和方法：
```html
<!--代码03 运行yarn dev03-->
<!--Father.vue-->
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
<!--Child.vue-->
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
```
这里有几个需要注意的点：
1. 使用`$attrs`时，需要设置`inheritAttrs: false`
2. `$listeners`不含`.native`修饰器的v-on事件监听器
3. `v-on`通过对象绑定事件可以和单独绑定同名事件共存，并且两者都生效

## 跨越层级 - provide/inject
`provide/inject`是一对需要配套使用的属性，`provide`定义的值，你可以使用`inject`进行接收，无论组件之前是如何嵌套的，父组件使用`provide`定义的值，你都可以在它的子孙组件中使用`inject`接收到，`provide`和`inject`绑定并不是可响应的，但是你可以通过传递一个可监听的数据，甚至直接传入组件的实例，来实现数据的相互传递：
```html
<!--代码04 yarn dev04-->
<!--Father.vue-->
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
<!--Mid.vue-->
<template>
  <div class="content">
    <Child></Child>
  </div>
</template>
<script>
import Child from "./Child.vue";
export default {
  name: 'Mid',
  components: { Child }
}
</script>
<!--Child.vue-->
<template>
  <div class="content" @click="onClick">
    msg: {{msg}}
    obj message: {{obj.message}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  inject: ['father', 'msg', 'obj'],
  methods: {
    onClick() {
      this.obj.message = 'Child Obj Message'
      this.father.onMessage('Child Message')
    }
  }
}
</script>
```
## 另辟蹊径 - 获取组件实例
在vue中存在多个可以直接获取实例的方法，如`$parent`获取父组件实例，`$root`获取根组件实例，`$children`获取直接子组件实例数组，`$refs`获取持有注册过ref特性的所dom元素和组件实例，如果注册在组件上获取组件实例，如果是dom元素上获取dom元素；通过组件实例，我们可以通过很多方式传递数据。
### 实现`$dispatch`和`$broadcast`
`$dispatch`和`$broadcast`是vue 1.0中提供的方法，`$dispatch`派发事件，触发上级指定组件的自定义事件；`$broadcast`广播事件，触发下级指定组件的自定义事件；它们使用`$parent`和`$children`来查找组件，然后通过vue实例的`$on`和`$emit`来实现事件的监听和触发，使用他们可以在多重嵌套中，触发指定组件的方法，而不用考虑嵌套层级的问题。
```js
<!--emitter.js-->
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}

export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
}
```
```html
<!--Father.vue-->
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
<!--Child.vue-->
<template>
  <div class="content" @click="onClick">
    message: {{value}}
  </div>
</template>
<script>
import emitter from "./emitter.js";
export default {
  name: 'Child',
  mixins: [emitter],
  data() {
    return {
      value: 'Child Message'
    }
  },
  methods: {
    onClick() {
      this.dispatch('Father', 'sendMessage', 'Child Message')
    }
  },
  beforeMount() {
    this.$on('sendMessage', (msg) => {
      this.value = `获取信息${msg}`
    })
  }
}
</script>
```
### 使用实例传值，简化代码
```html
<!--Father.vue-->
<el-button type="primary" @click="showDialog">显示Dialog</el-button>
message: {{message}}
<Dialog :visible.sync="visible" :default-value="message" @sendMessage="message = $event"></Dialog>
<!--Dialog.vue-->
<template>
  <el-dialog :visible="visible" @update:visible="$emit('update:visible', $event)" title="Dialog">
    <el-input v-model="message" type="textarea" rows="3"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
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
  props: {
    visible: Boolean,
    defaultValue: String
  },
  data () {
    return {
      message: this.defaultValue
    }
  },
  methods: {
    confirm() {
      this.$emit('sendMessage', this.message)
      this.$emit('update:visible', false)
    }
  }
}
</script>
```
这段代码实现了使用弹窗修改信息的功能，在实际项目中你可以找到很多相似的应用场景，如修改用户的重要信息（手机号码、密码），给信息添加修改备注等；在这段代码中，传递`visible`是为了控制弹窗的显示隐藏，我们使用了`ElementUI`的`Dialog`，我们的组件作为一个中间传递`visible`的角色，获取父组件给的`visible`，再传递给`Dialog`，监听`Dialog`的`update:visible`事件，然后在触发本身的`update:visible`事件，被父组件监听到，确实可以实现想要的功能，但是产生了太多不必要的中间过程；`defaultValue`用来给弹窗传递默认值，直接把`defaultValue`的值传递给`message`，但是在实际场景中，使用直接把`defaultValue`赋值给`message`作为初始值是存在问题的，首先我们的数据一般是通过网络请求获取的，`defaultValue`第一次很可能是没有获取到数据的空值，其次如果需要修改多条信息的相同值，我们会把不同信息里的值传递给组件，而`message`并不会根据传值产生变化，所以更好的方式是使用`watch`监听传入的`defaultValue`属性，然后修改`message`的值，为了把不同信息的值赋给`defaultValue`我们可能还需要一个中间值保存信息。使用常规的`prop`和事件结合的方式，在这样的场景下过于繁琐了，而使用实例传值的方式，我们的代码可能会更加简洁：
```html
<!--Father.vue-->
<el-button type="primary" @click="showDialog01">显示Dialog01</el-button>
message01: {{message01}}
<Dialog01 ref="dialog" @sendMessage="message01 = $event"></Dialog01>
showDialog01 () {
  this.$refs.dialog.show(this.message01)
}
<!--Dialog01.vue-->
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
```
通过实例，我们只需要把初始值通过方法给子组件的`message`赋值，而原本用来传递数据的`defaultValue`和控制是否显示的`visible`就没有必要去定义了，直接修改组件内部的值就可以了。
## 使用事件机制 - eventBus
一般我们通过`new Vue()`生成一个vue实例来实现事件总线:
```js
Vue.prototype.$bus = new Vue()
```
实际上我们定义一个简单的类，来实现事件的派发、监听和回调就可以了。
```js
<!--代码07 运行yarn dev07-->
class Bus {
    constructor() {
        this.callbacks = {}
    }
    $on(name, fn) {
        this.callbacks[name] = this.callbacks[name] || []
        this.callbacks[name].push(fn)
    }
    $emit(name, args) {
        if (this.callbacks[name]) {
            this.callbacks[name].forEach(fn => fn(args))
        }
    }
}
Vue.prototype.$bus = new Bus()
```
使用中我们需要注意一个问题，派发事件和监听事件的顺序，如果派发事件（`$emit`）时，没有监听事件（`$on`），而是在派发之后才监听事件，派发事件是不会被监听到的。
## 善用JS特性 - 共享对象
在js中引用类型是指向变量引用地址的，如果两个变量指向同一个引用地址，那我们修改其中的任意一个变量，都会引起所有变量的数据改动，利用这一特性我们可以实现简单的数据共享：
```html
<!--代码08 运行yarn dev08-->
<!--store.js-->
export default {
  message: '初始信息'
}
<!--在组件中使用-->
<template>
  <div class="content" @click="onClick">
    message: {{store.message}}
  </div>
</template>
<script>
import store from "./store.js";
export default {
  data () {
    return {
      store
    }
  }
}
</script>
```
更详细的内容可以查看[官方文档](https://cn.vuejs.org/v2/guide/state-management.html)，现在官方推荐管理简单状态时使用这种方案。
## 官方推荐 - vuex
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式，简单易上手，理解下面几个概念就可以了：
1. `state`用来存储数据，需要注意的是Vuex是单一状态的，虽然有模块，但是他们的状态其实都是集中管理的
2. `Mutation`更改Vuex的store中的状态的唯一方法，不支持异步，`Mutation`遵守 Vue 的响应规则，必须以合适的方式去修改数据，不然可能无法触发页面更新。
3. `Action`类似于`mutation`，但是`action`不能直接修改`state`，只能通过`mutation`去间接修改，而且`action`支持异步操作
4. `getters`根据`state`产生一些新的数据，类似与计算属性，会被缓存，只有依赖值修改时，才会产生变化
5. `module`在我们的状态过于臃肿的时候，可以通过模块去分隔我们的数据。建议使用代码实现`module`的自动加载，避免每次都需要导入模块：
```js
<!--将模块统一放在modules文件夹下-->
const modules = {}
const files = require.context('./modules', false, /\w+.js$/)
files.keys().forEach(fileName => {
  // 获取模块
  const file = files(fileName)
  // 获取组件名称，去除文件名开头的 `./` 和结尾的扩展名
  const name = fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[name] = file.default || file
})
export default new Vuex.Store({
  modules
})
```
## 原理探究 - vuex的简单实现
vuex的实现原理其实并不复杂，vuex的`state`实际上就是vue的data数据，getters使用了`defineProperty`方法，vuex中实现了两个方法，一个是`install`，安装 Vue.js 插件。如果插件是一个对象，必须提供`install`方法。如果插件是一个函数，它会被作为`install`方法，`install`方法调用时，会将Vue作为参数传入。一个是`Store`，生成`store`对象，然后放入到vue根元素中。
```js
<!--代码09 yarn dev09-->
let Vue
function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

class Store {
  constructor(options = {}) {
    this.state = new Vue({ data: options.state })
    this.mutations = options.mutations || {}
    this.actions = options.actions || {}
    options.getters && this.handleGetters(options.getters)
  }
  commit (type, arg) {
    this.mutations[type](this.state, arg)
  }
  dispatch(type, arg) {
    this.actions[type](
      {
        commit: this.commit.bind(this), // 将commit方法的this指向为对象
        state: this.state
      },
      arg
    )
  }
  handleGetters(getters) {
    this.getters = {}
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state)
        }
      })
    })
  }
}

export default { install, Store }
```




