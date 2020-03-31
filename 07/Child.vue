<template>
  <div class="content" @click="onClick">
    message: {{message}}
  </div>
</template>
<script>
export default {
  name: 'Child',
  data () {
    return {
      message: ''
    }
  },
  methods: {
    onClick() {
      this.$bus.$emit('fatherEvent', 'Child Message')
    }
  },
  beforeMount() {
    this.$bus.$on('childEvent', (msg) => {
      this.message = msg
    })
  }
}
</script>
