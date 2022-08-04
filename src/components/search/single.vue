<template>
  <div class="item">
    <div class="music-info">
      <div class="title one-title" v-html="keywordscolorful(item.name)"></div>
      <div class="name">
        <div class="sq">SQ</div>
        <div class="author one-title" v-html="keywordscolorful(item.ar, 1)"></div>
        <div class="iconfont icon-icon-test"></div>
        <div class="music-name one-title" v-html="keywordscolorful(item.al.name)"></div>
      </div>
    </div>
    <div class="video" v-if="item.mv != 0">
      <span class="iconfont icon-sanjiaoxing"></span>
    </div>
    <div class="iconfont icon-shenglve"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang='less' scoped>
</style>