<template>
    <div class="nav-bar" ref="navBar">
      <div class="nav-bar-left">
        <slot name="left"></slot>
      </div>
      <div class="nav-bar-center">
        <slot name="center"></slot>
      </div>
      <div class="nav-bar-right">
        <slot name="right"></slot>
      </div>
    </div>
</template>

<script>
export default {
  props: ["scroll"],
  data() {
    return {};
  },
  methods: {},
  mounted() {
    if (!this.scroll) return;
    var navBar = this.$refs.navBar;
    var a = 0;
    var that = this;
    var flag = false;
    var scroll = null;
    navBar.style.backgroundColor = "rgba(0,0,0,0)";
    document.addEventListener(
      "scroll",
      function (e) {
        scroll = document.documentElement.scrollTop || document.body.scrollTop;
        a = scroll / 200;
        if (a > 0.5 && !flag) {
          flag = true;
          that.$emit("handle", flag);
        } else if (a <= 0.5 && flag) {
          flag = false;
          that.$emit("handle", flag);
        }
          navBar.style.backgroundColor = `rgba(0, 0, 0, ${a})`;
      },
      20
    );
  },
};
</script>

<style lang="less" scope>
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  height: 50px;
  align-items: center;
  width: 100vw;
  box-sizing: border-box;
  padding: 0 15px;
  background-color: white;
  div {
    margin: auto;
  }
  .nav-bar-left,
  .nav-bar-right {
    box-sizing: border-box;
    line-height: 40px;
    text-align: center;
    .iconfont {
      font-size: 20px;
    }
  }
  .nav-bar-center {
    display: flex;
    flex: 1;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    padding: 0 15px 0 10px;
  }
}
.occupy {
  height: 40px;
}
</style>