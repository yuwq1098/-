<template>
  <div class="container" ref="usersId">
    {{title}} 页面参数id为{{id}}
    <div id="myNewContainer"></div>
  </div>
</template>

<script>
export default {
  transition: 'test',
  validate ({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id)
  },
  data () {
    return {
      title: '根据id查找的页面',
    }
  },
  computed:{
    id(){
      return this.$router.currentRoute.params.id;
    }
  },
  created(){
    console.log("呵呵大",this.$router.currentRoute.params.id);
    // this.$refs.usersId.style.backgroundColor = "#e45"
  },
  mounted(){
    var colors = ["#e56","#26a","#f83","#fc5","#8d3"]
    var theColor = colors[Math.floor(Math.random() * colors.length)];
    console.log(theColor)
    this.$refs.usersId.style.backgroundColor = theColor;
    // 调用初始化方法
    this.init();
  },
  methods:{
    init(){
      $("#myNewContainer").html("蛋疼的紧");
      var theArr = ["a","b","c","d","e"];
      console.log(_.chunk(theArr, 2));
    }
  }
}
</script>

<style>
  .container{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
</style>

