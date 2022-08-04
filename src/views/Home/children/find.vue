<template>
  <div class="find">
    <nav-bar>
      <router-link to="/search/list" slot="center" class="search">
        <span class="iconfont icon-sousuo"></span>
        <span class="search-title">感受音乐的力量</span>
      </router-link>
    </nav-bar>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished.sync="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <div class="header-container" v-if="show">
          <!-- 轮播图 -->
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="item in bannerList" :key="item.bannerId">
              <img @click="updataMuic(item.song)" :src="item.pic" alt />
            </van-swipe-item>
          </van-swipe>

          <!-- 德芙般丝滑 -->
          <!-- <drogan class="drogan-01" :width="200 * 8 / 11">
            <li>
              <div>
                <img src="@/assets/img/日历.png" alt />
              </div>
              <p>每日推荐</p>
            </li>
            <li>
              <div>
                <img src="@/assets/img/收音机.png" alt />
              </div>
              <p>私人FM</p>
            </li>
            <li>
              <div>
                <img src="@/assets/img/列表.png" alt />
              </div>
              <p>歌单</p>
            </li>
            <li>
              <div>
                <img src="@/assets/img/排行.png" alt />
              </div>
              <p>排行</p>
            </li>
            <li>
              <div>
                <img src="@/assets/img/直播回放.png" alt />
              </div>
              <p>直播回放</p>
            </li>
            <li>
              <div>
                <img src="@/assets/img/圆线.png" alt />
              </div>
              <p>数字专辑</p>
            </li>
            <li>
              <div>
                <img src="@/assets/img/星球.png" alt />
              </div>
              <p>畅聊</p>
            </li>
            <li>
              <div>
                <img src="@/assets/img/游戏.png" alt />
              </div>
              <p>游戏专区</p>
            </li>
          </drogan>-->
          <ul class="drogan-01">
            <li>
              <router-link to="/suggest">
                <div>
                <img src="@/assets/img/日历.png" alt />
              </div>
              <p>每日推荐</p>
              </router-link>
            </li>
            <li>
              <router-link to="/playlist">
                <div>
                  <img src="@/assets/img/列表.png" alt />
                </div>
                <p>歌单</p>
              </router-link>
            </li>
            <li>
              <router-link to="/ranking">
                <div>
                  <img src="@/assets/img/排行.png" alt />
                </div>
                <p>排行</p>
              </router-link>
            </li>
          </ul>
          <!-- 推荐歌单 -->
          <card class="suggest">
            <template slot="title">{{suggestList.uiElement.subTitle.title}}</template>
            <span @click="goPlaylist" slot="sub">{{suggestList.uiElement.button.text}}</span>
            <div class="card-container" slot="card-container">
              <list-item
                :to="`/playlistDetails?id=${item.creativeId}`"
                :count="item.resources[0].resourceExtInfo.playCount"
                slot="list"
                v-for="item in suggestList.creatives"
                :key="item.creativeId"
              >
                <img slot="img" v-lazy="item.uiElement.image.imageUrl" alt />
                <p slot="title" class="one-title">{{item.uiElement.mainTitle.title}}</p>
              </list-item>
            </div>
          </card>
        </div>

        <!-- 私人定制 -->
        <div v-if="show">
          <card>
            <template slot="top-title">猜你喜欢</template>
            <template slot="title">
              <span class="iconfont icon-icon_refresh"></span>
              {{selfList.uiElement.subTitle.title}}
            </template>
            <span @click="playSelf" slot="sub">{{selfList.uiElement.button.text}}</span>

            <card-swiper
              :maxNum="selfList.creatives.length"
              slot="card-container"
              :width="90 * selfList.creatives.length"
            >
              <div
                class="music-container"
                v-for="item in selfList.creatives"
                :key="item.resourceId"
              >
                <card-swiper-item
                  v-for="item2 in item.resources"
                  :key="item2.resourceId"
                  :item="item2.uiElement"
                  @playMuic="playMuic(item2)"
                >
                  <img slot="img" v-lazy="item2.uiElement.image.imageUrl" alt />
                  <template slot="music-name">{{item2.uiElement.mainTitle.title}}</template>
                  <template
                    slot="music-author"
                  >{{item2.resourceExtInfo.songData.album.artists[0].name}}</template>
                </card-swiper-item>
              </div>
            </card-swiper>
          </card>

          <!-- 音乐日历 -->
          <!-- <card>
            <template slot="title">{{calendarList.uiElement.subTitle.title}}</template>
            <template slot="sub">{{calendarList.uiElement.button.text}}</template>
            <div slot="card-container">
              <calendar-item
                v-for="item in calendarList.creatives"
                :key="item.creativeId"
                :data="item.resources[0]"
              >
                <template slot="context">{{item.resources[0].uiElement.mainTitle.title}}</template>
                <img slot="img" v-lazy="item.resources[0].uiElement.image.imageUrl" alt />
              </calendar-item>
            </div>
          </card> -->

          <!-- 专属场景 -->
          <!-- <card class="exclusive" v-if="this.exclusiveList.blockCode">
            <template slot="title">{{exclusiveList.uiElement.subTitle.title}}</template>
            <template slot="sub">{{exclusiveList.uiElement.button.text}}</template>
            <drogan slot="card-container" :width="31 * exclusiveList.creatives.length">
              <list-item
                v-for="item in exclusiveList.creatives"
                :key="item.creativeId"
                :count="item.resources[0].resourceExtInfo.playCount"
              >
                <img slot="img" v-lazy="item.uiElement.image.imageUrl" alt />
                <template slot="title">
                  <p class="more-title">{{item.uiElement.mainTitle.title}}</p>
                </template>
              </list-item>
            </drogan>
          </card>-->

          <!-- 心音乐 -->
          <!-- <card class="new-music exclusive" v-if="musicList.blockCode">
          <div slot="title" class="tab">
            <div v-for="(item, index) in musicTitle" @click="handleIndex(index)" :key="index" :class="{active: index == musicFlag}">{{item}}</div>
          </div>
          <template slot="sub">更多</template>
          <card-swiper
            v-for="(item, index) in musicList"
            :key="index"
            :maxNum="item.length"
            slot="card-container"
            :width="90 * item.length"
            v-show="index == musicFlag"
          >
            <div class="music-container" v-for="(item1, index1) in item" :key="index1">
              <card-swiper-item
                v-for="item2 in item1"
                :key="item2.resourceId"
                :item="item2.uiElement"
              >
                <img slot="img" v-lazy="item2.uiElement.image.imageUrl" alt />
                <template slot="music-name">{{item2.uiElement.mainTitle.title}}</template>
                <template
                    slot="music-author"
                  >{{item2.resourceExtInfo.artists[0].name}}</template>
              </card-swiper-item>
            </div>
          </card-swiper>
          </card>-->

          <!-- 双倍云呗 -->
          <!-- <div class="double" v-if="doubleList.uiElement">
            <div class="title">{{doubleList.uiElement.subTitle.title}}</div>
            <div class="container">
              <list-item
              :background="true"
                v-for="item in doubleList.creatives"
                :key="item.creativeId"
              >

              <img slot="img" :src="item.resources[0].uiElement.image.imageUrl" alt="">
              <p slot="title" class="more-title">
                {{item.resources[0].uiElement.subTitle.title}}
              </p>
              </list-item>
            </div>
          </div>-->

          <!-- 24小时播客 -->
          <!-- <card class="exclusive podcast" v-if="podcastList.uiElement" :isIcon="false">
            <template slot="title">{{podcastList.uiElement.subTitle.title}}</template>
            <drogan slot="card-container" :width="31 * podcastList.creatives.length">
              <list-item
                :background="true"
                v-for="item in podcastList.creatives"
                :key="item.creativeId"
              >
                <img slot="img" v-lazy="item.uiElement.image.imageUrl" alt />
                <template slot="title">
                  <p class="more-title">{{item.uiElement.mainTitle.title}}</p>
                </template>
              </list-item>
            </drogan>
          </card>-->

          <!-- 播客合辑 -->
          <!-- <card v-if="CollectionList.uiElement">
            <template slot="title">{{CollectionList.uiElement.subTitle.title}}</template>
            <template slot="sub">{{CollectionList.uiElement.button.text}}</template>
            <drogan slot="card-container" :width="31 * CollectionList.creatives.length">
              <list-item
                v-for="item in CollectionList.creatives"
                :key="item.creativeId"
                :count="item.creativeExtInfoVO.playCount"
              >
                <img slot="img" v-lazy="item.uiElement.image.imageUrl" alt />
                <template slot="title">
                  <p class="more-title">{{item.uiElement.mainTitle.title}}</p>
                </template>
              </list-item>
            </drogan>
          </card>-->

          <!-- <card v-if="videoList.uiElement">
            <template slot="title">{{videoList.uiElement.subTitle.title}}</template>
            <template slot="sub">{{videoList.uiElement.button.text}}</template>
            <drogan slot="card-container" :width="31 * videoList.creatives.length">
              <list-item
                v-for="item in videoList.creatives"
                :key="item.creativeId"
                :count="item.resources[0].resourceExtInfo.playCount"
              >
                <img slot="img" v-lazy="item.uiElement.image.imageUrl" alt />
                <template slot="title">
                  <p class="more-title">{{item.uiElement.mainTitle.title}}</p>
                </template>
              </list-item>
            </drogan>
          </card>-->
        </div>

      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import navBar from "@/components/navBar";
import Drogan from "@/components/drogan";
import Card from "@/components/card";
import ListItem from "@/components/listItem";
import CardSwiper from "@/components/cardSwiper";
import CardSwiperItem from "@/components/cardSwiperItem";
import calendarItem from "@/components/calendarItem";

import { mapMutations } from "vuex";
export default {
  data() {
    return {
      show: false,
      list: [],
      error: false,
      loading: false,
      finished: false,
      refreshing: false,
      code: 0,
      bannerList: [],
      suggestList: {},
      selfList: {},
      calendarList: {},
      exclusiveList: {},
      musicList: {},
      musicTitle: {},
      doubleList: {},
      podcastList: {},
      CollectionList: {},
      videoList: {},
      width: window.innerWidth,
      active: 0,
      musicFlag: 0,
    };
  },
  methods: {
    ...mapMutations(["updataMuic", "updataList"]),
    async playMuic(item) {
      var res = await this.$http.get(`/song/detail?ids=${item.resourceId}`);
      this.updataMuic(res.data.songs[0]);
    },
    goPlaylist() {
      this.$router.push('/playlist')
    },
    async onLoad() {
      var res = await this.$http.get("/homepage/block/page?refresh=false");
      res.data.data.blocks.forEach((e) => {
        if (e.blockCode == "HOMEPAGE_BANNER") {
          e.extInfo.banners.forEach(e => {
            if(e.song) {
              this.bannerList.push(e)
            }
          })
        } else if (e.blockCode == "HOMEPAGE_BLOCK_PLAYLIST_RCMD") {
          this.suggestList = e;
        } else if (e.blockCode == "HOMEPAGE_BLOCK_STYLE_RCMD") {
          this.selfList = e;
        } else if (e.blockCode == "HOMEPAGE_MUSIC_CALENDAR") {
          this.calendarList = e;
        } else if (e.blockCode == "HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST") {
          this.exclusiveList = e;
        } else if (e.blockCode == "HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG") {
          var arr = this.musicHandle(e.creatives);
          this.musicTitle = arr.newarr;
          this.musicList = arr.arr1;
        } else if (e.blockCode == "HOMEPAGE_PODCAST24") {
          this.podcastList = e;
        } else if (e.blockCode == "HOMEPAGE_VOICELIST_RCMD") {
          this.CollectionList = e;
        } else if (e.blockCode == "HOMEPAGE_BLOCK_VIDEO_PLAYLIST") {
          this.videoList = e;
        } else if (e.blockCode == "HOMEPAGE_YUNBEI_NEW_SONG") {
          this.doubleList = e;
          console.log(e);
        }
      });

      if (res.status == 200) {
        this.finished = true;
      } else {
        this.error = true;
      }
      this.show = true;
      this.refreshing = false;
      this.loading = false;
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    musicHandle(arr) {
      var newarr = new Set();
      var arr1 = [];
      arr.forEach((e) => {
        newarr.add(e.uiElement.mainTitle.title);
      });
      newarr = [...newarr];
      newarr.forEach((e, index) => {
        arr1[index] = [];
        arr.forEach((item) => {
          if (e == item.uiElement.mainTitle.title) {
            arr1[index].push(item.resources);
          }
        });
      });
      return { newarr, arr1 };
    },
    handleIndex(i) {
      this.musicFlag = i;
    },
    beforeRouteLeave(to, from, next) {
    if(to.name == 'mine') {
      to.meta.keepAlive = true
    }
    next()
  },
  async playSelf() {
    console.log(this.selfList.creatives);
    var arr = []
    this.selfList.creatives.forEach(e => {
      e.resources.forEach(item =>  {
        arr.push(item.resourceId)
      })
    })
    var res = await this.$http.get('/song/detail', {
        params: {
          ids: arr.join(',')
        }
      })
    this.updataList(res.data.songs)
  }
  },
  components: {
    navBar,
    Drogan,
    Card,
    ListItem,
    CardSwiper,
    CardSwiperItem,
    calendarItem,
  },
};
</script>

<style lang="less" scope>
.find {
  div {
    color: rgb(104, 104, 104);
  }
  .container {
    transform: translateX(0);
  }
  .nav-bar-center {
      padding: 0 !important;
    }
  .search {
    width: 100%;
    height: 25px;
    border: 1px solid black;
    border-radius: 20px;
    line-height: 25px;
    padding: 0 10px;
    .search-title {
      margin-left: 10px;
      vertical-align: top;
      line-height: 27px;
      color: rgb(148, 147, 146);
      font-size: 13px;
    }
    .icon-sousuo {
      font-size: 12px;
    }
  }
  .header-container {
    background-image: linear-gradient(#f3f3f3, #fff);
    .card {
      background-color: transparent;
    }
  }
  .my-swipe .van-swipe-item {
    background-color: transparent;
  }
  .my-swipe {
    margin-top: 10px;
    background-color: transparent;
    img {
      width: 100%;
      vertical-align: middle;
      box-sizing: border-box;
      padding: 0 10px;
      border-radius: 20px;
    }
  }
  .drogan-01 {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    border-bottom: 1px solid rgb(228, 228, 228);
    padding-bottom: 10px;
    padding: 0 15px;
    padding-bottom: 10px;
    li {
      width: 100 / 5.5vw;
      div {
        width: 12vw;
        height: 12vw;
        margin: auto;
        box-sizing: border-box;
        padding: 12px;
        border-radius: 50%;
        background-color: rgb(252, 232, 235);
        img {
          width: 100%;
        }
      }
      p {
        text-align: center;
        overflow: hidden;
        font-size: 10px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .van-swipe__indicator {
    width: 15px;
    height: 3px;
    border-radius: 0;
  }
  .music-container {
    box-sizing: border-box;
    padding-left: 4vw;
    width: 90vw;
  }
  .suggest {
    padding: 5px 0 10px;
    .list-item {
      margin-bottom: 20px;
    }
  }
  .exclusive {
    padding: 10px 0 0 !important;
    .drogan {
      border: 0px;
      padding-bottom: 15px;
    }
  }
  .exclusive {
    .van-tabs__line {
      display: none;
    }
    .van-tab {
      padding: 0 5px;
    }
  }
  .new-music {
    padding-bottom: 10px !important;
    .tab {
      display: flex;
      font-size: 12px;
      div {
        margin-right: 10px;
        color: rgb(206, 206, 206);
      }
    }
    .active {
      color: black !important;
    }
  }
  .podcast {
    .img {
      border-radius: 50%;
      overflow: hidden;
    }
    p {
      text-align: center;
    }
  }
  .double {
    margin-top: 10px;
    padding: 20px 0;
    background-color: white;
    border-radius: 10px;
    .title {
      margin-bottom: 15px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: black;
    }
  }
  .container {
    display: flex;
    img {
      height: 150% !important;
    }
    .list-item {
      width: 33.33vw !important;
    }
  }
}
</style>