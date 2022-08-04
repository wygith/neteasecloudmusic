<template>
  <div class="card-swiper-item" @click="playMuic">
    <div class="img">
      <slot name="img"></slot>
      <span class="icon iconfont icon-icon_play"></span>
    </div>
    <div class="text-content">
      <div class="music-info">
        <div class="music-name one-title">
          <slot name="music-name"></slot>
        </div>
        <span class="iconfont icon-icon-test"></span>
        <div class="music-author one-title">
          <slot name="music-author"></slot>
        </div>
      </div>
      <div class="music-descript">
          <span class="one-title des" :class="{songRcmdTag: flag}">{{item | musicDesc}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
      item: {
        default: {}
      }
    },
  data() {
    return {
        flag: false
    };
  },
  methods: {
    playMuic() {
      this.$emit('playMuic')
    }
  },
  mounted() {
      if(this.item.subTitle) {
          this.flag = this.item.subTitle.titleType == 'songRcmdTag'
      }
  },
  filters: {
    musicDesc(desc) {
      if (desc.subTitle) {
        return desc.subTitle.title;
      }
      return "";
    },
  },
};
</script>

<style lang='less' scope>
.card-swiper-item {
  display: flex;
  align-items: center;
  margin-top: 10px;
  .img {
    width: 14.2vw;
    height: 14.2vw;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: rgba(241, 240, 240, 0.8);
      font-size: 23px;
    }
  }
  .text-content {
    display: flex;
    width: 80%;
    height: 14.2vw;
    margin-left: 10px;
    flex-direction: column;
    justify-content: center;
    border-bottom: 1px solid #e2e2e2;
    .music-info {
      display: flex;
      align-items: center;
      .music-name {
        max-width: 70%;
        font-size: 16px;
        color: black;
        font-weight: 600;
      }
      .music-author {
        width: 25%;
        font-size: 10px;
      }
    }
    .music-descript {
      font-size: 10px;
      display: inline-block;
      margin-top: 4px;
    }
    .des {
        max-width: 100%;
    }
    .songRcmdTag {
        color: rgb(255, 167, 104);
        background-color: rgba(209, 209, 209, .2);
        padding: 0 3px;
        border-radius: 10px;
        font-size: 6px;
    }
  }
}
</style>