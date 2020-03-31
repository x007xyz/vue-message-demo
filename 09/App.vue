<template>
  <div class="content">
    Count: {{$store.state.count}}
    <button @click="$store.dispatch('increase')">+</button>
    <button @click="$store.dispatch('descrease')">-</button>
  </div>
</template>
<script>
import Vue from "vue";
export default Vue.extend({
  name: 'App'
})
</script>
