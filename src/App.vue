<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <play-page></play-page>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import playPage from '@/views/play-navBar'
export default {
  mounted() {
    
  },
  components: {
    playPage
  },
  methods: {
    goBack() {
      history.pushState(null, null, document.URL);
      console.log("wofanghuile");
    }
  },
  computed: {
    ...mapState(['music'])
  },
};
</script>


<style lang="less">
#app {
  min-height: 500px;
  padding-bottom: 40px;
}
::-webkit-scrollbar {
  display: none;
    width: 5px;
    height: 10px;
}
::-webkit-scrollbar-thumb {
    height: 30px;
    background-color: #999;
    border-radius: 7px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
}
</style>
