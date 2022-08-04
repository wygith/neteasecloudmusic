<template>
  <div class="home">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <van-tabbar v-model="active"  active-color="#ee0a24" inactive-color="#000">
      <!-- 发现 -->
      <van-tabbar-item replace :to="item.path" v-for="(item, index) in tabarList" :key="index">
        <span>{{item.name}}</span>
        <template #icon="props">
            <div class="iconfont" :class="{activeColor: props.active}+ ' ' + item.icon"></div>
        </template>
      </van-tabbar-item>
      
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      tabarList: [
        {
          path: '/home/find',
          name: '发现',
          icon: 'icon-yinleyanzou'
        },
        {
          path: '/home/mine',
          name: '我的',
          icon: 'icon-yinle'
        },
      ]
    };
  },
  methods: {},
  mounted() {
     this.active= this.tabarList.findIndex(e => {
         return e.path == this.$route.path
      })
  },
  watch: {
    $route() {
      this.active= this.tabarList.findIndex(e => {
         return e.path == this.$route.path
      })
    }
  },
   beforeRouteEnter(to, form, next) {
     var play = document.querySelector('.music-play')
     play.style.bottom = '50px'
    next()
  },
   beforeRouteLeave(to, form, next) {
     console.log(123);
     var play = document.querySelector('.music-play')
     play.style.bottom = '0px'
    next()
  }
};
</script>

<style lang="less" scope>
 .home {
   background-color: rgb(247, 247, 247);
   padding-bottom: 3.125rem;
     .activeColor {
         color: red;
     }
     .iconfont {
         font-size: 1.25rem;
         font-weight: 600;
     }
 }
 .music-play {
 }
</style>