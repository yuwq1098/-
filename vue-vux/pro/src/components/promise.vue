<template>
  <div class="promise">
      <div>我是promise测试页面</div>
  </div>
</template>

<script>
export default {
  name: 'promise',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  // 生命周期创建的时候
  created () {
    let myname = '理由 是啥'
    console.log(myname)
    console.log('muyouche')
    // console.log('木有车');
    console.log('esline 有利于让我们养成一个良好的编程代码习惯')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
