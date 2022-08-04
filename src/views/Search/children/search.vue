<template>
   <div class="container">
       <div class="history">
      <div class="header clearfix">
        <div class="record-title">历史记录</div>
        <div class="delete iconfont icon-shanchu"
        @click="clearRecrod"
        ></div>
      </div>
      <div class="record-list" v-if="recordList[0]">
        <div class="item"
        @click="searchMusic(item)"
        v-for="(item, index) in recordList"
        :key="index">
          {{item}}
        </div>
      </div>
      <div class="nothing" v-if="!recordList[0]">无搜索记录</div>
    </div>
    <div class="hot">
      <div class="clearfix">
        <div class="header-title">热搜榜</div>
      </div>
      <div class="hot-list clearfix" ref="hotList">
        <div class="item" 
        @click="searchMusic(item.searchWord)"
        v-for="(item, index) in hotList" 
        :key="index">
          <span class="index" :class="{color: index < 3}">{{index + 1 }}</span>
          <span class="name one-title" :class="{color1: index < 3}">{{item.searchWord}}</span>
          <div class="img">
            <img :src="item.iconUrl" alt />
          </div>
        </div>
      </div>
      <div @click="showHot" class="show-all-list" ref="showHot">
        <span>展开更多热搜</span>
        <span class="iconfont icon-sanjiao-copy"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
 export default {
  data() {
    return {
      hotList: [],
    };
  },
  methods: {
    showHot(event) {
      this.$refs.hotList.style.height = "auto";
      this.$refs.showHot.style.display = "none";
    },
    async searchMusic(keyword) {
      this.updateRecord(keyword)
      this.$router.push(`/search/details`)
    },
    ...mapMutations(['updateRecord', 'clearRecrod'])
  },
  computed: {
      ...mapState(['recordList'])
  },
  async created() {
    var res1 = await this.$http.get("/search/hot/detail");
    if (res1.data.code == 200) {
      this.hotList = res1.data.data;
    }
  },
};

</script>

<style lang='less' scoped>
 .history {
    margin-top: 5px;
    .header {
      margin-bottom: 5px;
      .record-title {
        float: left;
        font-size: 12px;
      }
      .delete {
        float: right;
        font-size: 17px;
      }
    }
    .record-list {
      display: flex;
      flex-wrap: wrap;
      .item {
        padding: 1px 7px;
        line-height: 20px;
        font-size: 14px;
        margin: 8px 15px 8px 0;
        background-color: rgb(223, 223, 223);
        color: rgb(112, 112, 112);
        border-radius: 10px;
      }
    }
    .nothing {
      font-size: 13px;
      color: rgb(202, 202, 202);
      text-align: center;
    }
  }
  .hot {
    margin-top: 35px;
    .header-title {
      float: left;
      font-size: 18px;
      font-weight: 800;
    }
    .hot-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      height: 210px;
      overflow: hidden;
      border-top: 1px solid rgb(235, 235, 235);
      transition: all 0.5s;
      .item {
        display: flex;
        align-items: center;
        width: 50%;
        padding: 12px 0;
        color: rgb(34, 34, 34);
        overflow: hidden;
        .index {
          margin-right: 12px;
          font-size: 16px;
          color: rgb(167, 167, 167);
        }
        .color {
          color: red;
        }
        .color1 {
          color: black;
          font-weight: 600;
        }
        .name {
          max-width: 120px;
          font-size: 15px;
        }
        .img {
          height: 13px;
          margin-left: 8px;
          img {
            height: 100%;
            vertical-align: top;
          }
        }
      }
    }
    .show-all-list {
      text-align: center;
      line-height: 30px;
      span {
        font-size: 12px;
        color: rgb(150, 150, 150);
      }
    }
  }
</style>