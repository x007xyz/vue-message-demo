import Vue from "vue";
import Vuex from "./vuex";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    setCount(state, count) {
      state.count = count
    }
  },
  actions: {
    increase({ commit, state}) {
      setTimeout(() => {
        commit('setCount', state.count + 1)
      }, 300);
    },
    descrease({ commit, state }) {
      setTimeout(() => {
        commit('setCount', state.count - 1)
      }, 300);
    }
  }
})