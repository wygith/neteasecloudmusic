<template>
  <v-touch
  ref="cardSwiper"
  @panstart="panstart"
  @panright="panright"
  @panleft="panleft"
  @panend="panend"
   class="card-swiper"
   :style="{width: width + 10 + 'vw'}"
   >
    <slot></slot>
  </v-touch>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 100,
    },
    maxNum: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      startx1: 0,
      startx2: 0,
      num: 0
    };
  },
  methods: {
    panstart(e) {
      this.$refs.cardSwiper.$el.style.transition = 'none'
      this.startx1 = this.startx2 = e.deltaX
    },
    panleft(e) {
      this.$refs.cardSwiper.$el.translateX -= this.startx1 - e.deltaX
      this.startx1 = e.deltaX 
    },
    panright(e) {
      this.$refs.cardSwiper.$el.translateX -= this.startx1 - e.deltaX
      this.startx1 = e.deltaX 
    },
    panend(e) {
      this.$refs.cardSwiper.$el.style.transition = 'all .5s'
      if(this.startx2 - e.deltaX > 60 && this.num > -this.maxNum + 1) {
        this.num--
      }else if(this.startx2 - e.deltaX < -60 && this.num < 0) {
        this.num++
      }
      this.$refs.cardSwiper.$el.translateX = this.num * 0.9 * window.innerWidth
    },
  },
  mounted() {
    this.Transfrom(this.$refs.cardSwiper.$el)
  },
};
</script>

<style lang='less' scope>
.card-swiper {
  display: flex;
  touch-action: pan-y !important;
}
</style>