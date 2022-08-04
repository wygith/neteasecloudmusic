<template>
  <div class="suggest">
    <nav-bar class="top" :scroll="true">
      <div
        slot="left"
        @click="goback"
        class="iconfont icon-fanhuishangyibufangxianghuituichukouxiangzuo"
      ></div>
      <template slot="center">
        <div class="playlist">{{artistInfo.name}}</div>
      </template>
    </nav-bar>
    <div class="header" :style="{backgroundImage: 'url(' + artistInfo.cover + ')'}"></div>
    <div class="play-list">
      <div class="play-all">
        <span class="iconfont icon-bofang1"></span>
        <span class="title">播放全部 <span class="play-count">({{count}})</span> </span>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div
          class="play-item"
          v-for="(item, index) in list"
          :key="index"
          @click="getMuisc(item.id)"
        >
          <div class="index">{{index + 1}}</div>
          <div class="play-info">
            <div class="name one-title">{{item.name}}</div>
            <div class="author-name one-title">{{item | authorName}}</div>
          </div>
          <div class="iconfont icon-shipin"></div>
          <div class="iconfont icon-shenglve"></div>
        </div>
      </van-list>
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
      loading: false,
      finished: false,
      artistInfo: {},
      count: 0,
      offset: 0
    };
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    async getMuisc(id) {
      var res = await this.$http.get(`/song/detail?ids=${id}`);
      if (res.data.code == 200) {
        this.updataMuic(res.data.songs[0]);
      } else {
        alert("获取歌曲失败，请重试");
      }
    },
    async onLoad() {
      if(this.$route.query.type == 'album') {
        var res = await this.$http.get(`/album?id=${this.$route.query.id}`)
        this.artistInfo.name = res.data.album.name
        this.artistInfo.cover = res.data.album.picUrl
        this.list = res.data.songs
        this.finished = true
        return
      }
      var res = await this.$http.get(`/artist/songs`, {
          params: {
              id: this.$route.query.id,
              order: 'hot',
              limit: 30,
              offset: this.offset * 30
          }
      });
      this.offset++
      this.list = [...this.list, ...res.data.songs];
      this.count = res.data.total
      this.loading = false;
      if(this.list.length >= this.count) {
          this.finished = true;
      }
    },
    ...mapMutations(["updataMuic"]),
  },
  async created() {
    console.log(this.$route.query.type);
    if(this.$route.query.type == 'album') return
      var res = await this.$http.get(`/artist/detail?id=${this.$route.query.id}`);
      this.artistInfo = res.data.data.artist
  },
  filters: {
    authorName(item) {
      var str = "";
      if (item.ar instanceof Array) {
        item.ar.forEach((e) => {
          str += " / " + e.name;
        });
        str = str.slice(2);
        str += "  -  " + item.al.name;
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
  .playlist {
      text-align: center;
  }
  .header {
    position: relative;
    min-height: 300px;
    margin-top: -50px;
    background-size: cover;
  }
  .play-list {
    padding: 0 15px;
    margin-top: 15px;
    .play-all {
      position: sticky;
      top: 48px;
      display: flex;
      align-items: center;
      padding: 7px 0 15px;
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