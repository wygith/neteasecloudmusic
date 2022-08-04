<template>
  <div class="history">
    <nav-bar class="top">
      <div
        slot="left"
        @click="goback"
        class="iconfont icon-fanhuishangyibufangxianghuituichukouxiangzuo"
      ></div>
      <template slot="center">
        <span class="playlist">
          历史记录
        </span>
      </template>
      <router-link to="/search/list" slot="right" class="iconfont icon-sousuo"></router-link>
    </nav-bar>
    <div class="play-list">
      <div class="play-all all">
        <span class="iconfont icon-bofang1"></span>
        <span class="title" @click="updataList(list)">播放全部</span>
        <span class="count">({{list.length}})</span>
      </div>
      <div class="play-item" v-for="(item) in list" :key="item.id" @click="getMuisc(item.id)">
        <div class="index">
          <img :src="item.al.picUrl" />
        </div>
        <div class="play-info">
          <div class="name one-title">{{item.name}}</div>
          <div class="author-name one-title">{{item | authorName}}</div>
        </div>
        <div class="iconfont icon-cha" @click.stop="del(item.id)"></div>
        <!-- <div class="iconfont icon-xin"></div> -->
      </div>
    </div>
    <div class="none">没有更多了...</div>
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
    async getMuisc(id) {
      var res = await this.$http.get(`/song/detail?ids=${id}`);
      if (res.data.code == 200) {
        this.updataMuic(res.data.songs[0]);
      } else {
        alert("获取歌曲失败，请重试");
      }
    },
    del(id) {
      var index = this.list.findIndex(e => e.id == id)
      this.list.splice(index, 1)
      localStorage.setItem('history', JSON.stringify(this.list))
    },
    ...mapMutations(["updataMuic", "updataList"]),
  },
  activated() {
      this.list = JSON.parse(localStorage.getItem('history'))
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
.history {
  .play-list {
    padding: 0 15px;
    .play-all {
      position: sticky;
      top: 45px;
      z-index: 55;
      padding-bottom: 5px;
      display: flex;
      align-items: center;
      background-color: white;
      margin-bottom: 10px;
      .iconfont {
        width: 20px;
        font-size: 25px;
        margin-right: 17px;
      }
      .icon-bofang1 {
        color: red;
      }
      .title {
        font-size: 15px;
        margin-right: 5px;
        color: rgb(138, 138, 138);
      }
      .count {
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
        padding: 0 10px;
        font-size: 18px;
        color: rgb(179, 179, 179);
      }
      .icon-xin1 {
        font-size: 20px;
        color: black;
      }
      .icon-xin {
        color: red;
      }
    }
  }
  .none {
      text-align: center;
      font-size: 14px;
      margin-top: 10px;
      color: rgb(141, 140, 140);
  }
  .count {
    font-size: 14px;
    color: black !important;
  }
}
</style>