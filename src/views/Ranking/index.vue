<template>
  <div class="ranking">
    <nav-bar>
      <div slot="left" @click="back" class="iconfont icon1 icon-fanhuishangyibufangxianghuituichukouxiangzuo"></div>
      <div slot="center" class="title">排行榜</div>
    </nav-bar>

    <div class="ranking-card essence artis">
      <div class="header">热门歌手</div>
      <div class="container-card">
        <div @click="getInfo(item.id)" class="artis-item" v-for="item in artis" :key="item.id">
          <img :src="item.img1v1Url">
          <p class="artis-name one-title">{{item.name}}</p>
        </div>
      </div>
    </div>

    <div class="ranking-card">
      <div class="header">
        <span class="iconfont icon icon-yinfu1"></span>
        <span>官方榜</span>
      </div>
      <div class="container">
        <router-link :to="`/playlistDetails?id=${item.id}`" class="card-1" v-for="item in list.official" :key="item.id">
          <div class="updata-time">{{item.updateFrequency}}</div>
          <div class="rangk-item">
            <div class="left">
              <div class="ranking-title">{{item.name}}</div>
              <img :src="item.bgUrl" alt />
            </div>
            <div class="right">
              <div class="song-item" v-for="(item2, index2) in item.tracks" :key="index2">
                <div class="song-info one-title">
                  <span>{{item2.first}}</span>
                  <span class="iconfont icon-icon-test"></span>
                  <span class="song-author">{{item2.second}}</span>
                </div>
                <div class="song-tag">热</div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div class="ranking-card essence">
      <div class="header">精选榜</div>
      <div class="container-card">
        <ranking-item v-for="item in list.suggest" :key="item.id" :id="item.id">
          <img slot="img" v-lazy="item.coverImgUrl" alt="">
          <template slot="tag">
            {{item.updateFrequency}}
          </template>
          <template slot="count">
            {{item.playCount | count}}
          </template>
          <template slot="title">
            {{item.name}}
          </template>
        </ranking-item>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/navBar";
import rankingItem from "@/components/ranking-item";
export default {
  data() {
    return {
      list: {
        official: [],
        suggest: [],
      },
      artis: []
    };
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    async getInfo(id) {
      this.$router.push(`/artist?id=${id}`)
    }
  },
  filters: {
    count(count) {
      if(count >= 100000000) {
        count = Math.ceil(count / 10000000) / 10 + '亿'
      }else if(count >= 10000) {
        count = Math.ceil(count / 1000) / 10 + '万'
      }
      return count
    }
  },
  async created() {
    var res = await this.$http.get("/toplist/detail");
    console.log(res);
    res.data.list.forEach((e) => {
      e.bgUrl = "";
      if (e.tracks[0]) {
        this.list.official.push(e);
      } else {
        this.list.suggest.push(e);
      }
    });
    // 获取歌手榜背景图片
    for(let i=0; i<res.data.artistToplist.artists.length; i++) {
      var artis = await this.$http.get(`/cloudsearch`, {
        params: {
          keywords: res.data.artistToplist.artists[i].first,
          type: 100,
          limit: 1
        }
      })
      this.artis.push(artis.data.result.artists[0])
    }
    // 获取官方榜背景图片
    for (let i = 0; i < this.list.official.length; i++) {
      var str = "";
      for (let name in this.list.official[i].tracks[0]) {
        str += " " + this.list.official[i].tracks[0][name];
      }
      var song = await this.$http.get(`/cloudsearch?keywords=${str}&limit=1`);
      this.list.official[i].bgUrl = song.data.result.songs[0].al.picUrl;
    }
  },
  mounted() {},
  components: {
    navBar,
    rankingItem,
  },
};
</script>

<style lang='less'>
.ranking {
  .icon1 {
    font-size: 25px !important;
  }
  .title {
    font-weight: 600;
  }
  .ranking-card {
    box-sizing: border-box;
    padding: 10px 15px;
    background-image: linear-gradient(to bottom, #f3f3f3 15px, #fff 100px);
    border-radius: 15px;
    .header {
      display: flex;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      .icon {
        margin-right: 5px;
        font-size: 18px;
        color: white;
        background-color: red;
        padding: 2px;
        border-radius: 50%;
      }
    }
    .container {
      .card-1 {
        display: block;
        width: 100%;
        padding: 8px 10px 15px 5px;
        box-sizing: border-box;
        border-radius: 10px;
        background-color: rgb(252, 225, 229);
        margin-bottom: 10px;
        &:nth-child(2n) {
          background-color: rgb(211, 247, 211);
          .ranking-title {
            color: green !important;
          }
        }
        &:nth-child(3n) {
          background-color: rgb(208, 231, 247);
          .ranking-title {
            color: blue !important;
          }
        }
        &:nth-child(4n) {
          background-color: rgb(252, 239, 215);
          .ranking-title {
            color: orange !important;
          }
        }
        .updata-time {
          text-align: right;
          font-size: 12px;
          color: rgb(153, 153, 153);
        }
        .rangk-item {
          display: flex;
          .left {
            width: 70px;
            padding: 0 10px;
            text-align: center;
            .ranking-title {
              font-size: 20px;
              font-weight: 900;
              text-align: center;
              margin-top: -2px;
              margin-bottom: 5px;
              color: red;
            }
            img {
              width: 95%;
              border-radius: 10px;
            }
          }
          .right {
            display: flex;
            flex: 1;
            margin-top: 5px;
            height: 95px;
            padding: 2px 10px 2px;
            box-sizing: border-box;
            flex-wrap: wrap;
            align-content: space-between;
            overflow: hidden;
            .song-item {
              width: 100%;
              display: flex;
              justify-content: space-between;
              font-size: 15px;
              .song-info {
                width: 85%;
                color: rgb(153, 153, 153);
                align-items: center;
                span {
                  &:first-child {
                    color: black;
                  }
                }
                .iconfont {
                  vertical-align: bottom;
                  padding: 0 2px;
                }
              }
              .song-tag {
                font-size: 12px;
                line-height: 20px;
                color: red;
              }
            }
          }
        }
      }
    }
  }
  .essence {
    margin-top: 15px;
    background-image: none;
    background-color: white;
    .container-card {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
  .artis {
    margin: 10px 13px 15px;
    .artis-item {
      width: 22vw;
      display: inline-block;
      img {
        width: 22vw;
        border-radius: 50%;
      }
      .artis-name {
        width: 22vw;
        margin-top: 5px;
        text-align: center;
      }
    }
  }
}
</style>