<template>
  <div v-if="playlist.creator" class="play">
    <nav-bar class="top" :scroll="true" @handle="change($event)">
      <div
        slot="left"
        @click="goback"
        class="iconfont icon-fanhuishangyibufangxianghuituichukouxiangzuo"
      ></div>
      <template slot="center">
        <span class="playlist">
          <span v-if="!show">歌单</span>
          <van-notice-bar
            v-if="show"
            delay="0.5"
            color="rgb(255, 255, 255)"
            background="rgba(0, 0, 0, 0)"
            scrollable
            :text="playlist.name"
          />
        </span>
      </template>
      <router-link to="/search/list" slot="right" class="iconfont icon-sousuo"></router-link>
    </nav-bar>
    <div class="playlist-details">
      <div class="header">
        <div class="cover">
          <img :src="playlist.coverImgUrl" alt />
        </div>
        <div class="playlist-info">
          <div class="title more-title">{{playlist.name}}</div>
          <div class="user">
            <div class="user-img">
              <img :src="playlist.creator.avatarUrl" alt />
            </div>
            <div class="user-name">{{playlist.creator.nickname}}</div>
            <div class="iconfont icon-cross"></div>
          </div>
          <div class="descript">
            <div class="context one-title">{{playlist.description}}</div>
            <div class="iconfont icon-jiantou"></div>
          </div>
        </div>
      </div>
      <div class="bg" :style="{backgroundImage: 'url('+ playlist.coverImgUrl +')'}"></div>
    </div>
    <div class="ability">
      <div class="ability-item" @click="commentPopup">
        <span class="iconfont icon-shoucang"></span>
        <span class="count">{{playlist.subscribedCount | count}}</span>
      </div>
      <div class="ability-item" @click="commentPopup">
        <span class="iconfont icon-xiaoxi"></span>
        <span class="count">{{playlist.commentCount | count}}</span>
      </div>
      <div class="ability-item" @click="commentPopup">
        <span class="iconfont icon-fenxiang"></span>
        <span class="count">{{playlist.shareCount | count}}</span>
      </div>
    </div>
    <div class="play-list">
      <div class="play-all" @click="updataList(list)">
        <span class="iconfont icon-bofang1"></span>
        <span class="title">播放全部</span>
        <span class="play-count">({{length}})</span>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="play-item" v-for="(item, index) in list" :key="index" @click="updataMuic(item)">
          <div class="index" :class="{hot: index < 3}">{{index + 1}}</div>
          <div class="play-info">
            <div class="name one-title">{{item.name}}</div>
            <div class="author-name one-title">{{item | authorName}}</div>
          </div>
          <div class="iconfont icon-shipin"></div>
          <div class="iconfont icon-shenglve"></div>
        </div>
      </van-list>
    </div>
    <van-popup v-model="popupShow" position="bottom" :style="{ height: '50%' }">
      <van-empty image="error" image-size="50px" description="后台数据有误，所以没有实现，才不是我懒的去实现(⸝⸝•‧̫•⸝⸝)
" />
    </van-popup>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import navBar from "@/components/navBar";
export default {
  name: "playlistDetails",
  data() {
    return {
      playlist: {},
      musicList: [],
      show: false,
      list: [],
      loading: false,
      finished: false,
      length: 0,
      popupShow: false,
    };
  },
  methods: {
    ...mapMutations(['updataMuic', 'updataList']),
    change(data) {
      this.show = data;
    },
    goback() {
      this.$router.go(-1);
    },
    async onLoad() {
      var arr = [];
      if (this.musicList.length > 50) {
        arr = this.musicList.splice(0, 50);
      } else {
        arr = this.musicList.splice(0, this.musicList.length);
      }
      var data = await this.$http.get("song/detail", {
        params: {
          ids: arr.join(","),
        },
      });
      if(this.list[0]) {
        this.list = [...this.list, ...data.data.songs]
      }else {
        this.list = data.data.songs
      }
      this.loading = false
      if(this.musicList.length <= 0) {
        this.finished = true
      }
    },
    async commentPopup() {
      this.popupShow = true;
    },
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
    count(count) {
      if (count >= 10000) {
        count = Math.floor(count / 1000) / 10 + "万";
      }
      return count;
    },
  },
  async created() {
    if (!this.$route.query.id) {
      this.$router.replace("/home/find");
    }

    var res = await this.$http.get(
      `/playlist/detail?id=${this.$route.query.id}`
    );
    this.playlist = res.data.playlist;
    res.data.playlist.trackIds.forEach((e) => {
      this.musicList.push(e.id);
    });
    this.length = this.musicList.length
  },
  components: {
    navBar,
  },
};
</script>

<style lang='less'>
.play {
  .nav-bar {
    color: white;
    .nav-bar-center {
      justify-content: space-between;
    }
    .nav-bar-right .iconfont {
        font-size: 16px;
        color: white;
      }
    .playlist {
      width: 100%;
      float: left;
      .van-notice-bar {
        padding: 0;
      }
    }
    .iconfont {
      float: right;
      font-weight: 600;
    }
  }
  .occupy {
    display: none;
  }
}

.playlist-details {
  position: relative;
  z-index: 1;
  padding: 60px 15px 20px;
  overflow: hidden;
  margin-top: -50px;
  border-radius: 0 0 10px 10px;
  .bg {
    position: absolute;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-size: cover;
    filter: blur(80px);
    transform: translateX(-15px);
  }

  .header {
    position: relative;
    display: flex;
    width: 100%;
    padding: 30px 0px 60px;
    .cover {
      width: 120px;
      img {
        width: 100%;
        border-radius: 10px;
      }
    }
    .playlist-info {
      display: flex;
      height: 120px;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-left: 15px;
      .title {
        font-size: 18px;
      }
      .user {
        display: flex;
        align-items: center;
        .user-img {
          width: 34px;
          img {
            width: 100%;
            border-radius: 50%;
          }
        }
        .iconfont {
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 10px;
          color: white;
          background-color: rgba(170, 170, 170, 0.5);
        }
        .user-name {
          max-width: 70%;
          margin: 0 10px;
          font-size: 12px;
          color: rgb(95, 95, 95);
          font-weight: 600;
        }
      }
      .descript {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: rgb(51, 51, 51);
        .context {
          width: 200px;
        }
        .iconfont {
          font-size: 12px;
          vertical-align: bottom;
        }
      }
    }
  }
}
.ability {
  position: relative;
  display: flex;
  align-items: center;
  z-index: 2;
  width: 75%;
  height: 50px;
  margin: auto;
  border-radius: 30px;
  margin-top: -25px;
  background-color: rgb(250, 250, 250);
  box-shadow: 0 0 5px rgb(179, 179, 179);
  .ability-item {
    flex: 1;
    text-align: center;
    border-right: 1px solid rgb(207, 207, 207);
    &:last-child {
      border: 0;
    }
    .iconfont {
      font-size: 21px;
    }
    .count {
      font-size: 12px;
      vertical-align: top;
      line-height: 25px;
      margin-left: 5px;
    }
  }
}
.play-list {
  padding: 0 15px;
  margin-top: 25px;
  .play-all {
    position: sticky;
    top: 50px;
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
      width: 20px;
      text-align: center;
      font-size: 17px;
      margin-right: 17px;
    }
    .play-info {
      flex: 1;
      .name {
        width: 65vw;
        font-size: 15px;
        color: black;
      }
      .author-name {
        width: 65vw;
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
  .hot {
    color: red;
  }
}
</style>