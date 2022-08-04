<template>
  <div class="details">
    <van-tabs v-model="active" @click="activeName">
      <van-tab title="单曲" name="single">
        <van-list
          class="list"
          v-model="single.loading"
          :finished="single.finished"
          offset="100"
          finished-text="没有更多了"
          @load="onLoad(single)"
        >
          <div class="count">
            共为你找到了 "
            <span>{{single.musicCount}}</span>" 条数据
          </div>
          <div class="item" @click="updataMuic(item)" v-for="(item, index) in single.musicList" :key="index">
            <div class="img">
                <img :src="item.al.picUrl" alt="">
              </div>
            <div class="music-info">
              <div class="title one-title" v-html="keywordscolorful(item.name)"></div>
              <div class="name">
                <span class="iconfont icon-sq"></span>
                <div
                  class="author one-title"
                  v-html="keywordscolorful(item.ar, item.al.name, ' — ')"
                ></div>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>

      <van-tab title="专辑" name="album">
        <van-list
          class="list"
          v-model="album.loading"
          :finished="album.finished"
          offset="100"
          finished-text="没有更多了"
          @load="onLoad(album)"
        >
          <div class="count">
            共为你找到了 "
            <span>{{album.musicCount}}</span>" 条数据
          </div>
          <div class="album-item" @click="albumDetails(item)" v-for="item in album.musicList" :key="item.id">
            <div class="img">
              <div class="circular"></div>
              <img :src="item.blurPicUrl" alt />
            </div>
            <div class="album-info">
              <div class="title one-title" v-html="keywordscolorful(item.name)"></div>
              <div class="container">
                <div class="name" v-html="keywordscolorful(item.artist.name)"></div>
                <div class="time">{{item.publishTime | getTime}}</div>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>

      <van-tab title="歌手" name="artist">
        <van-list
          class="list"
          v-model="artist.loading"
          :finished="artist.finished"
          offset="100"
          finished-text="没有更多了"
          @load="onLoad(artist)"
        >
          <div class="count">
            共为你找到了 "
            <span>{{artist.musicCount}}</span>" 条数据
          </div>
          <div @click="artistDetails(item)" class="artist-item" v-for="item in artist.musicList" :key="item.id">
            <div class="img">
              <img :src="item.img1v1Url" alt />
            </div>
            <div class="title one-title" v-html="keywordscolorful(item.name)"></div>
          </div>
        </van-list>
      </van-tab>

      <van-tab title="歌单" name="playlist">
        <van-list
          class="list"
          v-model="playlist.loading"
          :finished="playlist.finished"
          offset="100"
          finished-text="没有更多了"
          @load="onLoad(playlist)"
        >
          <div class="count">
            共为你找到了 "
            <span>{{playlist.musicCount}}</span>" 条数据
          </div>
          <router-link :to="'/playlistDetails?id=' + item.id" class="album-item" v-for="(item, index) in playlist.musicList" :key="index">
            <div class="img">
              <img :src="item.coverImgUrl" alt />
            </div>
            <div class="album-info">
              <div class="title one-title" v-html="keywordscolorful(item.name)"></div>
              <div class="container">
                <div class="name">{{item | playlistInfo}}</div>
              </div>
            </div>
          </router-link>
        </van-list>
      </van-tab>

      <!-- <van-tab title="视频" name="video">
        <van-list
          class="list"
          v-model="video.loading"
          :finished="video.finished"
          offset="100"
          finished-text="没有更多了"
          @load="onLoad(video)"
        >
          <div class="count">
            共为你找到了 "
            <span>{{video.musicCount}}</span>" 条数据
          </div>
          <div class="video">
            <div class="video-item" v-for="item in video.musicList" :key="item.id">
              <div class="img">
                <div class="bg" :style="{backgroundImage: `url(${item.coverUrl})`}"></div>
                <img :src="item.coverUrl" alt />
              </div>
              <div class="video-info">
                <p class="title more-title">{{item.title}}</p>
                <div class="play-good">
                  <div class="iconfont icon-writer">
                    <span>{{item.creator[0].userName}}</span>
                  </div>
                  <div class="iconfont icon-play">
                    <span>{{item.playTime | videoPlay}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab> -->

      <!-- <van-tab title="用户" name="userprofile">
        <van-list
          class="list"
          v-model="userprofile.loading"
          :finished="userprofile.finished"
          offset="100"
          finished-text="没有更多了"
          @load="onLoad(userprofile)"
        >
          <div class="count">
            共为你找到了 "
            <span>{{userprofile.musicCount}}</span>" 条数据
          </div>
          <div class="artist-item" v-for="item in userprofile.musicList" :key="item.id">
            <div class="img">
              <img :src="item.avatarUrl" alt />
            </div>
            <div class="info">
              <div>
                <span class="title one-title" v-html="keywordscolorful(item.nickname)"></span>
                <span v-if="item.gender == 1" class="iconfont icon-ico_male"></span>
                <span v-else class="iconfont icon-nv"></span>
              </div>
              <div class="introduce one-title">{{item.signature || ''}}</div>
            </div>
            <div class="follow">
              <span class="iconfont icon-cross"></span>关注
            </div>
          </div>
        </van-list>
      </van-tab> -->
    </van-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      active: "single",
      single: {
        musicCount: 0,
        musicList: [],
        str1: "songs",
        str2: "songCount",
        finished: false,
        loading: false,
        params: {
          type: 1,
          offset: 0,
          limit: 15,
        },
      },
      album: {
        musicCount: 0,
        musicList: [],
        str1: "albums",
        str2: "albumCount",
        finished: false,
        loading: false,
        params: {
          type: 10,
          offset: 0,
          limit: 15,
        },
      },
      artist: {
        musicCount: 0,
        musicList: [],
        str1: "artists",
        str2: "artistCount",
        finished: false,
        loading: false,
        params: {
          type: 100,
          offset: 0,
          limit: 15,
        },
      },
      playlist: {
        musicCount: 0,
        musicList: [],
        str1: "playlists",
        str2: "playlistCount",
        finished: false,
        loading: false,
        params: {
          type: 1000,
          offset: 0,
          limit: 15,
        },
      },
      video: {
        musicCount: 0,
        musicList: [],
        str1: "videos",
        str2: "videoCount",
        finished: false,
        loading: false,
        params: {
          type: 1014,
          offset: 0,
          limit: 10,
        },
      },
      userprofile: {
        musicCount: 0,
        musicList: [],
        str1: "userprofiles",
        str2: "userprofileCount",
        finished: false,
        loading: false,
        params: {
          type: 1002,
          offset: 0,
          limit: 15,
        },
      },
    };
  },
  computed: {
    ...mapState(["searchName", "detailsActive"]),
  },
  methods: {
    async onLoad(obj) {
      var res = await this.$http.get("/cloudsearch", {
        params: {
          type: obj.params.type,
          offset: obj.params.offset * obj.params.limit,
          limit: obj.params.limit,
          keywords: this.searchName,
        },
      });
      console.log(res);
      obj.loading = false;
      try {
        if (res.data.code == 200) {
          obj.musicCount = res.data.result[obj.str2] || 0;
          if (obj.musicList[0]) {
            obj.musicList = [...obj.musicList, ...res.data.result[obj.str1]];
          } else {
            obj.musicList = res.data.result[obj.str1] || [];
          }
          if (obj.musicList.length >= obj.musicCount) {
            obj.finished = true;
          }
          obj.params.offset++;
        }
      } catch (error) {
        obj.musicCount = obj.musicList.length;
        obj.finished = true;
      }
    },
    keywordscolorful(string, value, icon) {
      if (value) {
        var str = "";
        if (string instanceof Array) {
          string.forEach((e) => {
            str += "&" + e.name;
          });
          str = str.slice(1);
          string = str + icon + value;
        } else {
          string += icon + value;
        }
      }
      if(typeof string == 'string') {
        var reg = new RegExp("(" + this.searchName + ")", "g");
      var newstr = string.replace(
        reg,
        "<font style='color: rgb(114, 113, 218);'>$1</font>"
      );
      return newstr.trim();
      } else {
        return ''
      }
    },
    activeName(name, title) {
      this.detailsName(name);
    },
    async albumDetails(item) {
      this.$router.push(`/artist?type=album&id=${item.id}`)
    },
    artistDetails(item) {
      this.$router.push(`/artist?id=${item.id}`)
    },
    ...mapMutations(["detailsName", 'updataMuic']),
  },
  filters: {
    getTime(time) {
      var date = new Date(time);
      return (
        date.getFullYear() + "." + date.getMonth() + 1 + "." + date.getDate()
      );
    },
    playlistInfo(item) {
      if (item.playCount >= 10000) {
        item.playCount = Math.floor(item.playCount / 1000) / 10 + "万";
      }
      return (
        item.trackCount +
        "首 . by " +
        item.creator.nickname +
        ", 播放" +
        item.playCount +
        "次"
      );
    },
    videoPlay(count) {
      if (count >= 10000) {
        count = Math.floor(count / 1000) / 10 + "万";
      }
      return count;
    },
  },
  async created() {
    this.active = this.detailsActive;
    if (this.searchName == "") {
      this.$router.replace("/search/list");
    }
  },
};
</script>

<style lang='less'>
.search {
  .nav-bar {
  transform: translateX(-15px);
}
}
.van-tabs--line .van-tabs__wrap {
    width: 100vw;
    position: sticky;
    z-index: 1;
    top: 55px;
    padding-bottom: 5px;
    margin-left: -15px;
    background-color: white;
    height: 25px !important;
  }
.van-tabs__nav {
  padding: 0 15px !important;
  justify-content: space-between;
  background-color: transparent;
  padding: 0px 0 5px;
  .van-tab {
    font-size: 13px;
    flex: none;
  }
  .van-tab--active {
    font-weight: 600;
    color: black;
  }
  .van-tabs__line {
    width: 28px;
    bottom: 0px;
  }
}
.van-tabs__wrap--scrollable .van-tabs__nav--complete {
  padding-right: 0px;
  padding-left: 0px;
}
.van-cell {
  background-color: transparent;
}
.list {
  .count {
    font-size: 10px;
    color: rgb(145, 145, 145);
    margin-top: 10px;
    span {
      color: black;
      font-weight: 600;
    }
  }
  .item {
    display: flex;
    padding: 12px 0;
    align-items: center;
    .music-info {
      flex: 1;
      overflow: hidden;
      font-size: 16px;
      .title {
        max-width: 70vw;
      }
    }
    .img {
      width: 45px;
      margin-right: 10px;
      img {
        width: 100%;
      }
    }
    .name {
      width: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
      margin-top: 5px;
      color: rgb(158, 158, 158);
      .iconfont {
        padding: 0;
        margin: 0;
      }
      .icon-sq {
        color: red;
        font-size: 16px;
        margin-right: 5px;
      }
      .author {
        font-size: 12px;
        max-width: 75vw;
      }
    }
    .video {
      border-radius: 7px;
      border: 1px solid #cccbcb;
      text-align: center;
      padding: 0px 2px;
      .iconfont {
        margin-left: 0;
        padding: 0px 0px;
        color: #cccbcb;
        font-size: 8px;
        vertical-align: middle;
      }
    }
    .iconfont {
      padding: 0 10px;
      margin-left: 10px;
    }
  }
  .album-item {
    display: flex;
    margin-top: 20px;
    align-items: center;
    .img {
      position: relative;
      width: 55px;
      height: 55px;
      margin-right: 10px;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
      .circular {
        position: absolute;
        width: 100%;
        height: 100%;
        top: -6px;
        background-color: black;
        border-radius: 50%;
      }
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      max-width: 75vw;
    }
    .container {
      display: flex;
      margin-top: 5px;
      align-items: center;
      font-size: 10px;
      div {
        margin-right: 10px;
      }
    }
  }
  .artist-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgb(230, 230, 230);
    .img {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      flex: 1;
      .icon-nv {
        margin-left: 7px;
        font-size: 15px;
        color: rgb(235, 57, 146);
      }
      .icon-ico_male {
        font-size: 13px;
        margin-left: 7px;
        color: rgb(88, 88, 199);
      }
    }
    .title {
      max-width: 60vw;
      font-size: 14px;
      font-weight: 600;
    }
    .introduce {
      max-width: 60vw;
      margin-top: 5px;
      font-size: 12px;
      color: rgb(182, 182, 182);
    }
    .follow {
      width: 50px;
      text-align: center;
      border: 1px solid rgb(211, 65, 65);
      font-size: 12px;
      padding: 2px 5px;
      border-radius: 15px;
      color: rgb(211, 65, 65);
      .iconfont {
        font-size: 12px;
        margin-right: 3px;
      }
    }
  }
  .video {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .video-item {
      position: relative;
      width: 44vw;
      margin-top: 25px;
      border-radius: 10px;
      box-shadow: 0 0 5px #d3d3d3;
      overflow: hidden;
      .img {
        position: relative;
        width: 100%;
        height: 200px;
        background-size: cover;
        overflow: hidden;
        img {
          position: absolute;
          width: 100%;
          top: 0;
          bottom: 0;
          margin: auto;
        }
        .bg {
          width: 100%;
          height: 200px;
          filter: blur(100px);
          background-size: cover;
          background-repeat: no-repeat;
        }
      }
      .video-info {
        padding: 10px 10px 35px;
        .title {
          width: 100%;
          font-size: 14px;
        }
        .play-good {
          position: absolute;
          width: 100%;
          margin-top: 10px;
          display: flex;
          bottom: 10px;
          color: #a1a1a1;
          div {
            font-size: 10px;
            span {
              margin-left: 3px;
            }
            &:first-child {
              max-width: 60%;
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
}
</style>