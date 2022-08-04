<template>
  <div>
    <div class="music-play">
      <div class="play-bg" @click="showPopup" v-if="music.id">
        <img :src="music.al.picUrl" alt />
      </div>
      <van-notice-bar v-if="music.id" class="music-play-info" color="#000" @click="showPopup"
        background="rgba(0,0,0,0)">
        <span class="music-name">{{ music.name }}</span>
        <span class="iconfont icon-icon-test"></span>
        <span class="music-author">{{ music | authorName }}</span>
      </van-notice-bar>
      <div @click="play" v-if="music.id">
        <van-circle v-model="value" :rate="value" speed="1000" size="34px">
          <div class="iconfont" :class="playState"></div>
        </van-circle>
      </div>
      <div @click="goHistory" class="iconfont icon-bofangliebiao" v-if="music.id"></div>
    </div>

    <!-- 播放页面 -->
    <van-popup v-if="music.id" @opened="open" v-model="show" class="play-music" position="bottom"
      :style="{ height: '100%' }">
      <nav-bar class="v-touch">
        <div slot="right" class="iconfont icon-sousuo" @click="search"></div>
        <div class="music-name one-title" slot="center">{{ music.name }}</div>
        <div slot="left" @click="show = false" class="iconfont icon-sanjiao-copy"></div>
      </nav-bar>
      <v-touch class="lyric" id="box" @panstart="panstart" @panmove="move" @panend="panend">
        <ul ref="lyric" class="v-touch">
          <li @click="handleLyric(index)" class="more-title" v-for="(item, index) in lyric"
            :class="{ lyricAction: index + 1 == lyricIndex }" :key="index">{{ item.lyric }}</li>
        </ul>
      </v-touch>
      <div class="slider">
        <div class="left">{{ playTime }}</div>
        <van-slider class="center" bar-height="1px" button-size="12px" v-model="value" @change="onChange" />
        <div class="right">{{ durationTime }}</div>
      </div>
      <div class="play-button">
        <div class="iconfont icon-1" :class="playMode" @click="changeMode(true)"></div>
        <div class="iconfont icon-xiayishou" @click="lastPlay"></div>
        <div class="iconfont icon-2" :class="playState" @click="play"></div>
        <div class="iconfont icon-xiayishou1" @click="ended"></div>
        <div @click="goHistory" class="iconfont icon-bofangliebiao"></div>
      </div>
    </van-popup>
    <audio :src="audioSrc" ref="audio" @ended="ended" @canplay="getDuration"></audio>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "@/components/navBar";
import router from '../../router/index'
export default {
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
    var that = this
    router.beforeEach((to, from, next) => {
      if (that.show == true) {
        that.show = false
        next(false)
      } else {
        next()
      }
    })
  },
  data() {
    return {
      currentRate: 0,
      show: false,
      value: 0,
      playMode: "icon-xunhuan",
      playState: "icon-sanjiaoxing",
      mode: 0,
      suspend: false,
      audioSrc: "",
      settime: null,
      durationTime: "00:00",
      playTime: "00:00",
      lyric: [],
      lyTime: [],
      lastTranslateY: 0,
      lyricIndex: 0,
      phyTouch: null,
      moveFlag: false,
      phy: true,
      history: [],
      playList: [],
      randomList: [],
    };
  },
  methods: {
    showPopup() {
      this.$router.push('/asd')
      this.show = true;
    },
    onChange(value) {
      this.$refs.audio.currentTime = (this.$refs.audio.duration * value) / 100;
      this.handle();
    },
    changeMode(flag) {
      flag && this.mode++;
      if (this.mode < 0 || this.mode >= 3) {
        this.mode = 0;
      }
      this.$refs.audio.loop = false;
      if (this.mode == 0) {
        this.playMode = "icon-xunhuan";
        this.playList = this.history;
      } else if (this.mode == 1) {
        this.playMode = "icon-suiji";
        this.random();
        console.log(this.playList);
        console.log(this.history);
      } else if (this.mode == 2) {
        this.playMode = "icon-danquxunhuan";
        this.$refs.audio.loop = true;
        this.playList = this.history;
      }
    },
    random() {
      this.playList = [];
      var list = [...this.history];
      var index = 0;
      for (let i = 0; i < this.history.length; i++) {
        index = Math.floor(Math.random() * list.length);
        if (index == list.length) {
          index = list.length - 1;
        }
        this.playList.push(list[index]);
        list.splice(index, 1);
      }
    },
    play() {
      clearInterval(this.settime);
      if (this.suspend) {
        this.playState = "icon-sanjiaoxing";
        this.$refs.audio.pause();
      } else {
        this.$refs.audio.play();
        this.playState = "icon-zantingtingzhi";
        this.settime = setInterval(this.handle, 200);
      }
      this.suspend = !this.suspend;
    },
    handle() {
      this.playTime = this.fillterTime(this.$refs.audio.currentTime);
      this.value =
        Math.floor(
          (this.$refs.audio.currentTime / this.$refs.audio.duration) * 1000
        ) / 10;
      this.lyricIndex = this.lyTime.findIndex(
        (e) => e >= this.$refs.audio.currentTime + 0.2
      );
      if (this.lyricIndex < 0) {
        this.lyricIndex = this.lyTime.length;
      }
    },

    fillterTime(time) {
      var m = Math.floor(time / 60);
      var s = Math.round(time % 60);
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return m + ":" + s;
    },
    getDuration() {
      this.durationTime = this.fillterTime(this.$refs.audio.duration);
    },
    handleLyric(index) {
      this.$refs.audio.currentTime = this.lyTime[index];
      this.suspend = false;
      this.moveFlag = false;
      clearInterval(this.settime);
      this.play();
    },
    open() {
      this.tranfrom();
      this.phyTouch.min =
        -this.$refs.lyric.clientHeight +
        this.$refs.lyric.children[0].clientHeight;
      var value = -this.lyricIndex * this.$refs.lyric.children[0].clientHeight;
      this.phyTouch.to(value, 300);
    },
    tranfrom() {
      if (this.phy) {
        var that = this;
        this.phy = false;
        var target = this.$refs.lyric;
        this.Transfrom(target);
        this.phyTouch = new this.PhyTouch({
          touch: "#box",
          vertical: true, //不必需，默认是true代表监听竖直方向touch
          target: target, //运动的对象
          property: "translateY", //被滚动的属性
          min: -target.clientHeight + target.children[0].clientHeight, //不必需,滚动属性的最小值
          max: 0, //不必需,滚动属性的最大值
          step: 40,
          factor: 1,
          moveFactor: 0.5,
          maxSpeed: 1,
          animationEnd: function (value) {
            that.moveFlag = false;
          },
        });
      }
    },
    panstart() {
      this.moveFlag = true;
    },
    move(e) {
      this.$refs.lyric.translateY += e.deltaY - this.lastTranslateY;
      this.lastTranslateY = e.deltaY;
    },
    panend() {
      this.lastTranslateY = 0;
    },
    lyricTime() {
      this.lyric.forEach((e) => {
        var time = e.time.split(":");
        this.lyTime.push(time[0][0] * 600 + time[0][1] * 60 + time[1] * 1);
      });
    },
    ended() {
      this.suspend = true;
      this.play();
      var index = this.playList.findIndex((e) => e.id == this.music.id);
      if (index < this.playList.length - 1) {
        index++;
      } else {
        index = 0;
      }
      this.updataMuic(this.playList[index]);
    },
    lastPlay() {
      var index = this.playList.findIndex((e) => e.id == this.music.id);
      index--;
      if (index < 0) {
        index = this.playList.length - 1;
      }
      this.updataMuic(this.playList[index]);
    },
    search() {
      this.show = false
      this.$router.push('/search/list')
    },
    goHistory() {
      this.show = false
      this.$router.push('/history')
    },
    ...mapMutations(["updataMuic"]),
  },
  computed: {
    ...mapState(["music", 'list']),
  },

  filters: {
    authorName(item) {
      var str = "";
      if (item.ar instanceof Array) {
        item.ar.forEach((e) => {
          str += " / " + e.name;
        });
        str = str.slice(2);
      }
      return str;
    },
  },
  watch: {
    lyricIndex() {
      if (!this.show) return;
      var value = this.$refs.lyric.children[this.lyricIndex - 1]
        ? -this.$refs.lyric.children[this.lyricIndex - 1].offsetTop
        : 0;
      !this.phy && !this.moveFlag && this.phyTouch.to(value, 300);
    },
    async music() {
      this.lyricIndex = this.value = 0;
      this.lyTime = [];
      this.lyric = [];
      var index = this.history.findIndex((e) => {
        return e.id == this.music.id;
      });
      if (index == -1) {
        this.history.push(this.music);
        localStorage.setItem("history", JSON.stringify(this.history));
      }
      // localStorage.clear()
      var res = await this.$http.get(`/song/url?id=${this.music.id}`);
      this.audioSrc = res.data.data[0].url;
      console.log(res)
      var data = await this.$http.get(`/lyric?id=${this.music.id}`);
      var lyric = data.data.lrc.lyric.split("\n");
      lyric.forEach((e) => {
        var arr = e.split("]");
        if (arr[1] && arr[1].trim() != "") {
          this.lyric.push({
            time: arr[0].substr(1),
            lyric: arr[1].trim(),
          });
        }
      });
      this.lyricTime();
      clearInterval(this.settime);
      this.$refs.audio.autoplay = true;
      this.suspend = false;
      this.play();
    },
    list() {
      this.history = this.list
      this.playList = [...this.list]
      this.changeMode(false)
    },
    show() {
      this.$bus.$emit('isShow', this.show)
    }
  },
  components: {
    navBar,
  },
};
</script>

<style lang='less'>
.music-play {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  position: fixed;
  z-index: 10;
  border-top: 1px solid rgb(238, 238, 238);
  bottom: 0;
  padding: 0 15px;
  width: 100%;
  background-color: white;

  .van-circle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .play-bg {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    padding: 5px;
    border-radius: 50%;
    background-color: red;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .music-play-info {
    display: flex;
    flex: 1;
    align-items: center;
    font-size: 15px;
    margin-left: 10px;
    padding: 0 20px 0 5px;
    font-size: 16px;

    .music-name {
      font-weight: 600;
    }

    .iconfont {
      display: inline-block;
    }

    .music-author {
      font-size: 13px;
      color: rgb(109, 109, 109);
    }
  }

  .icon-bofangliebiao {
    font-size: 22px;
    margin-left: 15px;
  }
}

.play-music {
  display: flex;
  background-image: linear-gradient(rgb(196, 231, 255), rgb(3, 161, 209));
  flex-direction: column;
  padding: 2px 0;
  box-sizing: border-box;

  .music-name {
    width: 60vw;
    text-align: center;
  }

  .lyric {
    position: relative;
    width: 100%;
    flex: 1;
    padding-top: 50%;
    margin-top: 20px;
    overflow: hidden;
    box-sizing: border-box;

    .v-touch {
      touch-action: pan-y !important;
    }

    ul {
      left: 0;
      right: 0;
      margin: auto;
      box-sizing: border-box;
      position: absolute;

      li {
        width: 100%;
        padding: 8px;
        text-align: center;
        box-sizing: border-box;
        transition: all 0.2s;
      }

      .lyricAction {
        color: white;
      }
    }
  }

  .slider {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 0 15px;
    font-size: 12px;

    .center {
      margin: 0 15px;
      box-sizing: border-box;
    }
  }

  .play-button {
    display: flex;
    margin: 17px 20px;
    padding: 0 40px;
    align-items: center;
    justify-content: space-between;

    div {
      font-size: 19px;
    }

    .icon-2 {
      padding: 11px;
      border: 2px solid black;
      border-radius: 50%;
    }

    .icon-1 {
      font-size: 24px;
    }

    .icon-bofangliebiao {
      font-size: 22px;
    }
  }

  .nav-bar {
    background-color: transparent !important;
  }
}
</style>