<template>
  <div class="card">
    <div class="top-title">
      <slot name="top-title"></slot>
    </div>
    <div class="card-top">
      <span class="title one-title" >
        <slot name="title"></slot>
      </span>
      <span class="sub-title" v-if="isIcon">
        <slot name="sub"></slot>
        <span class="icon iconfont icon-icon-"></span>
      </span>
    </div>
    <slot name="card-container"></slot>
  </div>
</template>

<script>
export default {
  props: {
    isIcon: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang='less' scope>
.card {
  padding: 15px 0;
  background-color: white;
  margin-top: 10px;
  border-radius: 10px;
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 10px;
    .title {
      max-width: 60vw;
      margin-left: 15px;
      font-size: 17px;
      color: black;
      font-weight: 600;
    }
    .icon-icon_refresh {
      color: black;
      font-size: 18px;
    }
    .sub-title {
      margin-right: 15px;
      font-size: 12px;
      line-height: 13px;
      padding: 1px 0px 1px 7px;
      border: 1px solid rgb(112, 111, 111);
      border-radius: 20px;
      .icon-jiantou {
        font-size: 10px;
      }
      .icon {
        margin-left: -2px;
        vertical-align: text-top;
      }
    }
  }
  .top-title {
    margin-left: 17px;
    font-size: 12px;
    margin-bottom: 3px;
  }
}
</style>