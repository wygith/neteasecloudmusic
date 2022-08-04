<template>
  <v-touch
    class="drogan"
    ref="drogan"
    @panstart="panstart"
    @panleft="panleft"
    @panright="panright"
    @panend="panend"
    :style="{width: width +'vw'}"

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
  },
  data() {
    return {
      startx1: 0,
      startx2: 0
    };
  },
  methods: {
    panstart(e) {
      this.element.style.transition = 'none'
      this.startx1 = e.deltaX
    },
    panleft(e) {
      // this.startx2 = this.startx1 - e.deltaX
      this.element.translateX -=  this.startx1 - e.deltaX
      this.startx1 = e.deltaX 
    },
    panright(e) {
      // this.startx2 = this.startx1 - e.deltaX
      this.element.translateX -=  this.startx1 - e.deltaX
      this.startx1 = e.deltaX 
    },
    panend(e) {
      if(this.element.translateX > 0) {
        this.element.style.transition = 'all .5s'
        this.element.translateX = 0
      }else if(this.element.translateX < window.innerWidth - this.element.clientWidth) {
        this.element.style.transition = 'all .5s'
        this.element.translateX = window.innerWidth - this.element.clientWidth
      }
    }
  },
  mounted() {
    this.element = this.$refs.drogan.$el
    this.Transfrom(this.element);
  },
};
</script>

<style lang='less' scope>
.drogan {
  display: flex;
  padding: 0 10px;
  justify-content: center;
  touch-action: pan-y !important;
}
</style>