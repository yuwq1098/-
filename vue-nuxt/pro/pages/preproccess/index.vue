<template lang="pug">
  div.container
    h1.red Hello {{ name }}!
    div.oppo 我是一个div
    section.desc-content 不可醉心于此
    p.myc html5知识还不够，css3学的还凑和，
</template>

<script lang="coffee">

module.exports = 
    data: -> { name: 'World' }
    head: {
        title: '可以写 jade html模板、coffeeScript js预处理、sass css预处理',
        meta: [
            { hid: 'keywords', name: 'keywords', content: '老子是关键字' },
            { hid: 'description', name: 'description', content: '我有错吗？' }
        ],
    },
</script>

<style lang="sass">
.red
  color: red
.oppo
  width: 250px
  height: 160px
  background: #e45
</style>