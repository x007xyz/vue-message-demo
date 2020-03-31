import Vue from "vue";
import App from "./Father.vue";
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
new Vue({
  el: '#app',
  render: h => h(App)
})