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
