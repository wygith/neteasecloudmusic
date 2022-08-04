<template>
  <div class="mine">
    <div class="container">
      <div class="user">
        <div class="user-img">
          <img v-if="isLogin" :src="user.profile.avatarUrl" alt />
          <img v-else src="@/assets/img/unLogin.png" alt />
        </div>
        <div class="user-info" v-if="isLogin">
          <div class="user-name one-title">{{user.profile.nickname}}</div>
          <div class="power">
            <div class="vip">开通VIP</div>
            <div class="level">Lv.{{user.profile.userType}}</div>
          </div>
        </div>
        <router-link to="/login" class="login" v-else>立即登录</router-link>
        <div class="icon iconfont icon-icon-"></div>
      </div>
      <div class="history">
        <div class="title">
          <div class="context">
            历史记录
            <span class="count">({{length}})</span>
          </div>
          <div class="button" @click="updataList(list)">
            <span class="iconfont icon-jilu"></span>全部
          </div>
        </div>
        <div class="history-container">
          <div
            class="play-item"
            v-for="(item, index) in history"
            :key="index"
            @click="updataMuic(item)"
          >
            <div class="index">
              <img :src="item.al.picUrl" />
            </div>
            <div class="play-info">
              <div class="name one-title">{{item.name}}</div>
              <div class="author-name one-title">{{item | authorName}}</div>
            </div>
            <div class="iconfont icon-cha" @click.stop="del(item.id)"></div>
          </div>
          <div @click="historyList" v-if="length > 3" class="history-all">查看全部...</div>
          <van-empty v-if="!history[0]" image-size="70px" description="这里面空空如也" />
        </div>
      </div>
      <div class="like">
        <div class="love-box">
          <span class="iconfont icon-love"></span>
        </div>
        <div class="like-contianer">
          <div class="title">我喜欢的音乐</div>
          <div class="like-music-count">0首</div>
        </div>
        <div class="like-mode">
          <span class="iconfont icon-xindong"></span>心动模式
        </div>
      </div>

      <div class="new-music-list">
        <div class="header">
          <div class="list-count">收藏歌单</div>
          <div class="iconfont icon-shenglve"></div>
        </div>
        <van-empty image-size="70px" image="error" description="这个作者太懒了，未实现该功能！！！" />
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/navBar";

import { mapMutations, mapState } from "vuex";
export default {
  name: "mine",
  data() {
    return {
      uid: "",
      isLogin: false,
      uesr: {},
      history: [],
      list: []
    };
  },
  methods: {
    ...mapMutations(["updataMuic", "updataList"]),
    // changEemphasize(event) {
    //   this.$refs.emphasize.style.left =
    //     event.path[0].offsetLeft + event.path[0].clientWidth / 2 + "px";
    // },
    getHistory() {
      this.history = JSON.parse(localStorage.getItem("history")) || [];
      this.list = [...this.history]
      this.length = this.history.length;
      if (this.history.length > 3) {
        this.history = this.history.splice(this.history.length-4, 3);
      }
    },
    historyList() {
      this.$router.push('/history')
    },
    del(id) {
      var list = JSON.parse(localStorage.getItem("history")) || [];
      var index = list.findIndex(e => e.id == id)
      list.splice(index, 1)
      localStorage.setItem('history', JSON.stringify(list))
      this.getHistory()
    },
  },
  async created() {
    // this.$refs.emphasize.style.left =
    //   document.querySelector(".select-list>div").clientWidth / 2 + "px";
    this.uid = sessionStorage.getItem("uid");
    if (this.uid) {
      var res = await this.$http.get("/user/detail", {
        params: {
          uid: this.uid,
        },
      });
      if (res.data.code != 200) {
        this.$notify({ type: "danger", message: "登录失败" });
      } else {
        this.user = res.data;
        this.isLogin = true;
      }
    }
    this.getHistory()
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
  computed: {
    ...mapState(["music"]),
  },
  watch: {
    music() {
      this.getHistory()
    },
  },
  components: {
    navBar,
  },
};
</script>

<style lang="less" scoped>
.mine {
  padding: 10px 0;
  min-height: 100vh;
  .container {
    width: 92%;
    margin: auto;
    .user {
      display: flex;
      align-items: center;
      .user-img {
        width: 12vw;
        height: 12vw;
        border-radius: 50%;
        border: 3px solid white;
        overflow: hidden;
        margin-right: 10px;
        img {
          width: 100%;
        }
      }
      .login {
        font-size: 16px;
        font-weight: 600;
      }
      .user-info {
        flex: 1;
        .user-name {
          width: 60%;
          font-weight: 600;
        }
        .power {
          display: flex;
          margin-top: 5px;
          font-size: 10px;
          div {
            padding: 2px 5px;
            margin-right: 8px;
            border-radius: 10px;
            background-color: red;
            line-height: 12px;
          }
          .vip {
            color: white;
            background-color: rgb(189, 189, 189);
          }
          .level {
            background-color: white;
          }
        }
      }
      .icon {
        font-weight: 700;
        font-size: 25px;
      }
    }
  }
  .history {
    padding: 15px;
    margin-top: 25px;
    background-color: white;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      .context {
        font-size: 14px;
        .count {
          color: rgb(168, 168, 168);
        }
      }
      .button {
        font-size: 14px;
        padding: 3px 10px 0px;
        border: 1px solid rgb(221, 221, 221);
        border-radius: 10px;
        color: rgb(122, 122, 122);
        .iconfont {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
    .history-container {
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
            border-radius: 7px;
          }
        }
        .play-info {
          flex: 1;
          box-sizing: border-box;
          padding: 0 10px 0 0;
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
          font-size: 14px;
          padding: 10px;
          color: rgb(179, 179, 179);
          font-weight: 300;
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
  .like {
    display: flex;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 15px;
    background-color: white;
    margin-top: 25px;
    align-items: center;
    .love-box {
      width: 55px;
      height: 55px;
      margin-right: 10px;
      background-color: rgb(160, 160, 160);
      text-align: center;
      border-radius: 10px;
      .iconfont {
        font-size: 40px;
        line-height: 55px;
        color: white;
      }
    }
    .like-contianer {
      flex: 1;
      .title {
        font-size: 14px;
      }
      .like-music-count {
        margin-top: 1px;
        font-size: 12px;
        color: rgb(197, 197, 197);
      }
    }
    .like-mode {
      padding: 3px 10px;
      border: 1px solid #d1d1d1;
      border-radius: 20px;
      font-size: 12px;
      .iconfont {
        font-size: 14px;
        color: red;
        margin-right: 3px;
      }
    }
  }
  .select {
    position: relative;
    margin: 30px 0 17px;
    .select-list {
      display: flex;
      div {
        flex: 1;
        text-align: center;
        font-weight: 600;
      }
    }
    .emphasize {
      position: absolute;
      width: 70px;
      height: 4px;
      margin-top: 3px;
      background-color: red;
      border-radius: 10px;
      transition: all 0.3s;
      transform: translate(-50%, -50%);
    }
  }
  .new-music-list {
    padding: 15px;
    margin-top: 25px;
    background-color: white;
    border-radius: 10px;
    color: rgb(172, 169, 169);
    .header {
      display: flex;
      align-items: center;
      .list-count {
        flex: 1;
        font-size: 14px;
      }
      .iconfont {
        font-weight: 600;
        margin-left: 20px;
        font-size: 14px;
      }
      .icon-shenglve {
        font-size: 18px;
      }
    }
    .create-item {
      margin-top: 7px;
      display: flex;
      align-items: center;
      .item-box {
        width: 55px;
        height: 55px;
        margin-right: 10px;
        background-color: rgb(218, 218, 218);
        border-radius: 10px;
        color: white;
        font-size: 40px;
        text-align: center;
        line-height: 55px;
      }
      .item-content {
        flex: 1;
        .title {
          font-size: 14px;
          color: black;
        }
        .count {
          font-size: 10px;
        }
      }
    }
  }
  .history-all {
    border: 1px solid rgb(214, 214, 214);
    text-align: center;
    border-radius: 20px;
    padding: 5px 0px;
    color: rgb(192, 192, 192);
  }
  .van-empty {
    padding: 0;
  }
}
</style>