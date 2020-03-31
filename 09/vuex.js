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