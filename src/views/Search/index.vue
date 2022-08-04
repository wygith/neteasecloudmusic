<template>
  <div class="search">
    <div class="container-top">
      <div @click="back" class="iconfont icon-fanhuishangyibufangxianghuituichukouxiangzuo icon-back"></div>
      <div class="search-container">
        <input type="text" ref="searchInput" class="search-input" @keydown.enter="searchMusic(searchKey)"
          @blur="inputBlur = true" @focus="focus" v-model="searchKey" :placeholder="placeholder" />
        <div class="iconfont icon-cha" @click="empty" v-show="searchKey.trim() != ''"></div>
        <div class="suggest" v-show="suggestFlag">
          <div class="item" @click="searchMusic(searchKey)">
            <span>搜索 "{{ searchKey }}"</span>
          </div>
          <div class="item" @click="searchMusic(item.keyword)" v-for="(item, index) in suggestList" :key="index">
            <span class="iconfont icon-sousuo"></span>
            <span>{{ item.keyword }}</span>
          </div>
        </div>
      </div>
    </div>
    <router-view v-if="isRouteAlive"></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      placeholder: "",
      defaultSearchKey: "",
      searchKey: "",
      suggestList: [],
      suggestFlag: false,
      inputBlur: true,
      isRouteAlive: true,
      active: 0,
    };
  },
  methods: {
    async searchMusic(keyword) {
      if (keyword.trim() == "") {
        keyword = this.defaultSearchKey;
      }
      this.updateRecord(keyword);
      this.reload();
      if (this.$route.path != "/search/details") {
        this.$router.replace(`/search/details`);
      }
      this.$refs.searchInput.blur();
      this.inputBlur = true;
      this.suggestFlag = false;
    },
    back() {
      this.$router.go(-1);
      this.searchKey = "";
    },
    focus() {
      this.inputBlur = false;
      if (this.searchKey != "") this.getSuggest();
    },
    empty() {
      this.searchKey = "";
      if (this.$route.path != "/search/list") {
        this.$router.push("/search/list");
      }
    },
    async getSuggest() {
      var res = await this.$http.get("/search/suggest", {
        params: {
          keywords: this.searchKey,
          type: "mobile",
        },
      });
      if (res.data.code == 200) {
        this.suggestList = res.data.result.allMatch;
        if (!this.inputBlur) {
          this.suggestFlag = true;
        }
      } else {
        this.suggestList = [];
        this.suggestFlag = false;
      }
    },
    reload() {
      this.isRouteAlive = false;
      this.$nextTick(() => {
        this.isRouteAlive = true;
      });
    },
    ...mapMutations(["updateRecord"]),
  },
  async created() {
    var res2 = await this.$http.get("/search/default");
    if (res2.data.code == 200) {
      this.placeholder = res2.data.data.showKeyword;
      this.defaultSearchKey = res2.data.data.realkeyword;
    }
  },
  computed: {
    ...mapState(["searchName"]),
  },
  mounted() {
    var that = this;
    document.addEventListener("click", function () {
      if (that.inputBlur) {
        that.suggestFlag = false;
      }
    });
  },
  watch: {
    searchKey: _.debounce(function () {
      if (this.inputBlur == false) {
        this.getSuggest();
      }
    }, 300),
    searchName() {
      this.searchKey = this.searchName;
    },
  },
};
</script>

<style lang='less'>
.search {
  padding: 0px 15px 20px;

  .container-top {
    position: sticky;
    display: flex;
    width: 100vw;
    align-items: center;
    height: 55px;
    z-index: 2;
    top: 0;
    box-sizing: border-box;
    padding: 0px 10px 0 15px;
    transform: translateX(-15px);
    background-color: white;

    .icon-back {
      font-size: 21px;
    }
  }

  .search-container {
    position: relative;
    width: 100%;
    padding: 0 15px;

    .icon-cha {
      top: 5px;
      right: 15px;
      color: rgb(128, 128, 128);
      position: absolute;
    }
  }

  .search-input {
    width: 102%;
    outline: none;
    border: 0px;
    height: 30px;
    font-size: 16px;
    padding: 0 4px;
    box-sizing: border-box;
    background-color: transparent;
    border-bottom: 1px solid rgb(179, 179, 179);
  }

  .suggest {
    position: absolute;
    width: 94.5%;
    z-index: 5;
    background-color: white;
    margin: auto;
    transform: translate(-2px, 10px);
    box-shadow: 0 0 15px rgb(216, 216, 216);

    .item {
      padding: 15px;
      font-size: 14px;
      border-bottom: 1px solid rgb(245, 245, 245);
      color: rgb(158, 158, 158);

      &:first-child {
        color: rgb(141, 141, 253);
      }

      .iconfont {
        font-size: 14px;
        margin-right: 15px;
      }
    }
  }
}
</style>