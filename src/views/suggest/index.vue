<template>
  <div class="suggest">
    <nav-bar class="top" :scroll="true">
      <div
        slot="left"
        @click="goback"
        class="iconfont icon-fanhuishangyibufangxianghuituichukouxiangzuo"
      ></div>
      <template slot="center">
        <span class="playlist">每日推荐</span>
      </template>
    </nav-bar>
    <div
      class="header"
      @click="getMuisc(list[0].id)"
      :style="{backgroundImage:  'url(' + list[0].picUrl + ')'}"
    >
      <div class="calendar">
        <span class="day">{{d}}</span>/
        <span class="month">{{m}}</span>
      </div>
    </div>

    <div class="play-list">
      <div class="play-all">
        <span class="iconfont icon-bofang1"></span>
        <span class="title" @click="playAll">播放全部</span>
      </div>
      <div class="play-item" v-for="(item, index) in list" :key="index" @click="getMuisc(item.id)">
        <div class="index">
          <img :src="item.picUrl" />
        </div>
        <div class="play-info">
          <div class="name one-title">{{item.name}}</div>
          <div class="author-name one-title">{{item.song | authorName}}</div>
        </div>
        <div class="iconfont icon-shipin"></div>
        <div class="iconfont icon-shenglve"></div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/navBar";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      list: [],
      d: 0,
      m: 0,
    };
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getTime() {
      var date = new Date();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m < 10) {
        m = "0" + m;
      }
      if (d < 10) {
        d = "0" + d;
      }
      this.m = m;
      this.d = d;
    },
    async getMuisc(id) {
      var res = await this.$http.get(`/song/detail?ids=${id}`);
      if (res.data.code == 200) {
        this.updataMuic(res.data.songs[0]);
      } else {
        alert("获取歌曲失败，请重试");
      }
    },
    async playAll() {
      var arr = []
      this.list.forEach(e => {
        arr.push(e.id)
      })
      var res = await this.$http.get('/song/detail', {
        params: {
          ids: arr.join(',')
        }
      })
      this.updataList(res.data.songs)
    },
    ...mapMutations(["updataMuic", "updataList"]),
  },
  async created() {
      var res = await this.$http.get("/personalized/newsong?limit=30");
      this.list = res.data.result;
      this.getTime();
  },
  filters: {
    authorName(item) {
      var str = "";
      if (item.artists instanceof Array) {
        item.artists.forEach((e) => {
          str += " / " + e.name;
        });
        str = str.slice(2);
        str += "  -  " + item.album.company;
      }
      return str;
    },
  },
  components: {
    navBar,
  },
};
</script>

<style lang='less'>
.suggest {
  .nav-bar {
    color: white;
  }
  .header {
    position: relative;
    height: 250px;
    margin-top: -50px;
    background-size: cover;
    .calendar {
      position: absolute;
      bottom: 10px;
      left: 10px;
      color: white;
      .day {
        font-size: 28px;
        font-weight: 600;
        margin-right: 3px;
      }
      .month {
        margin-left: 3px;
      }
    }
  }
  .play-list {
    padding: 0 15px;
    margin-top: 15px;
    .play-all {
      position: sticky;
      top: 48px;
      width: 100vw;
      margin-left: -15px;
      display: flex;
      align-items: center;
      padding: 7px 15px 15px;
      box-sizing: border-box;
      background-color: white;
      .iconfont {
        width: 20px;
        font-size: 20px;
        color: red;
        margin-right: 17px;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
        margin-right: 10px;
      }
      .play-count {
        font-size: 13px;
        color: rgb(145, 145, 145);
      }
    }
    .play-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      color: rgb(145, 145, 145);
      .index {
        width: 45px;
        text-align: center;
        margin-right: 17px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .play-info {
        flex: 1;
        overflow: hidden;
        .name {
          font-size: 15px;
          color: black;
        }
        .author-name {
          margin-top: 3px;
          font-size: 12px;
        }
      }
      .iconfont {
        font-size: 22px;
        color: rgb(179, 179, 179);
      }
      .icon-shipin {
        margin: 0 20px 0 10px;
      }
      .icon-shenglve {
        font-weight: 600;
      }
    }
  }
}
</style>