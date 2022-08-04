<template>
  <div class="playlist">
    <nav-bar>
      <div slot="left" @click="back" class="iconfont icon1 icon-fanhuishangyibufangxianghuituichukouxiangzuo"></div>
      <div slot="center" class="nav-bar-title">歌单广场</div>
    </nav-bar>
    <div class="select">
      <div class="menu">
        <van-dropdown-menu>
          <van-dropdown-item title="筛选" ref="item" @open="open" @close="close">
            <ul class="menu-item selected">
              <li class="title">
                <span class="context">已选择的分类 :</span>
                <span class="delete button" @click="delAll">删除全部</span>
                <span class="cancel button" @click="cancel">取消</span>
                <span class="confirm button" @click="handle">确认</span>
              </li>
              <li
                class="play-item"
                @click="delItem(item.id, index)"
                v-for="(item, index) in selection"
                :key="item.id"
              >
                {{item.name}}
                <span class="iconfont icon-cha"></span>
              </li>
              <li class="empty" v-if="!selection[0]">
                <van-empty image-size="100px" description="你还没又选择分类哦~" />
              </li>
            </ul>
            <ul class="menu-item">
              <li class="title">
                <span class="context">可选择的分类 :</span>
              </li>
              <li
                class="play-item"
                :class="{active: item.selected}"
                @click="select(item.id)"
                v-for="(item) in menu"
                :key="item.id"
              >{{item.name}}</li>
            </ul>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <div class="item">
        <ul ref="selected" class="clearfix">
          <li
            class="play-item"
            @click="del(item.id, index)"
            v-for="(item, index) in selected"
            :key="item.id"
          >
            {{item.name}}
            <span class="iconfont icon-cha"></span>
          </li>
          <li v-if="!selected[0]" class="placehloder">你还没有筛选歌单，快来筛选看看吧~</li>
        </ul>
      </div>
    </div>

    <div class="ranking-card essence" v-if="selected[0]">
      <div class="header">搜索结果</div>
      <div class="playlistCount">共为你找到：“
        <span class="count">
          {{playlistCount}}
        </span>
        ”条数据</div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="container-card">
          <ranking-item v-for="item in list" :key="item.id" :id="item.id">
            <img slot="img" v-lazy="item.coverImgUrl" alt />
            <template slot="count">{{item.playCount | count}}</template>
            <template slot="title">{{item.name}}</template>
          </ranking-item>
        </div>
      </van-list>
    </div>
    <div class="ranking-card essence" v-if="!selected[0]">
      <div class="header">为你推荐</div>
        <div class="container-card">
          <ranking-item v-for="item in suggest" :key="item.id" :id="item.id">
            <img slot="img" v-lazy="item.picUrl" alt />
            <template slot="count">{{item.playCount | count}}</template>
            <template slot="title">{{item.name}}</template>
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
      menu: [],
      selection: [],
      selected: [],
      confirm: false,
      phyTouch: null,
      list: [],
      loading: false,
      finished: false,
      offset: 0,
      suggest: [],
      playlistCount: 0
    };
  },
  methods: {
    select(index) {
      if (!this.menu[index].selected) {
        this.selection.unshift(this.menu[index]);
        this.menu[index].selected = true;
      } else {
        this.menu[index].selected = false;
        var x = this.selection.findIndex((e) => e.id == index);
        this.selection.splice(x, 1);
      }
    },
    delItem(id, index) {
      this.selection.splice(index, 1);
      this.menu[id].selected = false;
    },
    del(id, index) {
      this.selected.splice(index, 1);
    },
    open() {
      if (!this.confirm) {
        this.confirm = true;
        this.selection = [...this.selected];
        this.selection.forEach((e) => {
          this.menu[e.id].selected = true;
        });
      }
    },
    close() {
      this.confirm && this.$refs.item.toggle(true);
    },
    handle() {
      this.selected = this.selection;
      this.selection = [];
      this.confirm = false;
      this.$refs.item.toggle(false);
    },
    async getPlaylist() {
      var str = "";
      this.selected.forEach((e) => {
        str += " " + e.name;
        this.menu[e.id].selected = false;
      });
      var res = await this.$http.get(`/cloudsearch`, {
        params: {
          type: 1000,
          keywords: str,
          offset: this.offset * 30
        }
      });
      this.offset++
      console.log(res);
      if (res.data.code == 200) {
        this.playlistCount = res.data.result.playlistCount
        this.list = [...this.list, ...res.data.result.playlists];
      }
    },
    async onLoad() {
      await this.getPlaylist();
      this.loading = false;
      if(this.list.length >= this.playlistCount) {
        this.finished = true
      }
    },
    cancel() {
      this.confirm = false;
      this.$refs.item.toggle(false);
      this.selection.forEach(e => {
        this.menu[e.id].selected = false
      })
    },
    delAll() {
      this.selection.forEach(e => {
        this.menu[e.id].selected = false
      })
      this.selection = []
    },
    back() {
      this.$router.go(-1)
    }
  },
  filters: {
    count(count) {
      if (count >= 100000000) {
        count = Math.ceil(count / 10000000) / 10 + "亿";
      } else if (count >= 10000) {
        count = Math.ceil(count / 1000) / 10 + "万";
      }else {
        count += '次'
      }
      return count;
    },
  },
  watch: {
    selected() {
      this.list = []
      this.offset = 0
      this.loading = true
      this.finished = false
      this.onLoad()
    },
  },
  components: {
    navBar,
    rankingItem,
  },
  async created() {
    var res = await this.$http.get("/playlist/catlist");
    res.data.sub.forEach((e, i) => {
      this.menu.push({
        id: i,
        name: e.name,
        selected: false,
      });
    });
    var suggest = await this.$http.get("/personalized");
    this.suggest = suggest.data.result
  },
  mounted() {
    var selected = this.$refs.selected;
    var item = document.querySelector(".item");
    this.Transfrom(selected);
    this.phyTouch = new this.PhyTouch({
      touch: item, //反馈触摸的dom
      vertical: false, //不必需，默认是true代表监听竖直方向touch
      target: selected, //运动的对象
      property: "translateX", //被运动的属性
      min: 0,
      max: 0, //不必需,滚动属性的最大值
      touchStart: function (evt, value) {
        var min = item.clientWidth - selected.clientWidth;
        this.min = min < 0 ? min : 0;
      },
    });
  },
};
</script>

<style lang='less'>
.playlist {
  .icon1 {
    font-size: 25px;
  }
  .nav-bar-title {
    font-size: 18px;
  }
  .select {
    z-index: 1;
    display: flex;
    .van-dropdown-item__content {
      padding: 10px 0;
      max-height: 100%;
    }
    .van-dropdown-menu {
      position: relative;
      z-index: 11;
    }
    .menu {
      flex: 1;
    }
    .item {
      flex: 5;
      overflow: hidden;
      background-color: rgb(238, 238, 238);
    }

    .menu-item {
      display: flex;
      padding: 5px 0;
      justify-content: space-between;
      flex-wrap: wrap;
      .title {
        display: flex;
        width: 100%;
        margin-bottom: 15px;
        padding: 0 10px;
        justify-content: space-between;
        .button {
          padding: 2px 10px;
          height: 20px;
        }
        .delete {
          background-color: rgb(255, 88, 88);
          box-shadow: 0 0 5px rgb(255, 3, 3);
          padding: 2px 7px;
        }
        .cancel {
          background-color: white;
          box-shadow: 0 0 5px rgb(212, 212, 212);
        }
        .confirm {
          background-color: rgb(116, 162, 248);
          box-shadow: 0 0 5px rgb(32, 91, 218);
        }
      }

      .active {
        background-color: rgb(76, 139, 255);
      }
    }
    .play-item {
      padding: 2px 10px;
      height: 22px;
      background-color: white;
      margin: 0 10px;
      margin-bottom: 20px;
      box-shadow: 0 0 5px rgb(211, 210, 210);
    }
    .selected {
      min-height: 150px;
      .play-item {
        background-color: rgb(76, 139, 255);
        color: white;
        padding: 2px 7px;
        box-shadow: 0 0 5px rgb(5, 12, 107);
        .iconfont {
          font-size: 12px;
          margin-left: 5px;
          vertical-align: middle;
          color: rgb(197, 197, 197);
        }
      }
      .empty {
        margin: auto;
      }
      .van-empty {
        padding: 0;
      }
    }
    .item {
      display: flex;
      z-index: 0;
      overflow: hidden;
      align-items: center;
      ul {
        white-space: nowrap;
        display: flex;
        height: 22px;
        .play-item {
          background-color: rgb(76, 139, 255);
          color: white;
          padding: 2px 7px;
          box-shadow: 0 0 5px rgb(5, 12, 107);
          .iconfont {
            font-size: 12px;
            margin-left: 5px;
            vertical-align: middle;
            color: rgb(197, 197, 197);
          }
        }
        .placehloder {
          color: rgb(138, 137, 136);
          margin-left: 10px;
        }
      }
    }
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
    .playlistCount {
        margin-bottom: 15px;
        color: rgb(158, 158, 158);
        .count {
          color: black;
        }
      }
  }
}
</style>