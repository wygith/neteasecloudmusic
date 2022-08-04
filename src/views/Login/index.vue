<template>
  <div class="login-container">
    <div class="login">
      <div class="title">用户登录</div>

      <van-form @submit="onSubmit">
        <van-field
          @click="labelStyle"
          v-model="phone"
          name="手机号码"
          label="手机号码"
          :rules="[{ required: true, message: '手机号码格式不正确' }]"
        />
        <van-field
          @click="labelStyle"
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          :rules="[{ required: true, message: '密码格式不正确' }]"
        />
        <div>
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
      <router-link to="/register" class="register">注册/修改密码？</router-link>
    </div>
  </div>
</template>


<script>
export default {
  name: 'login',
  data() {
    return {
      phone: "",
      password: "",
    };
  },
  methods: {
    async onSubmit(values) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        overlay: true,
      });
      var res = await this.$http.post("/login/cellphone", {
        phone: this.phone,
        password: this.password,
      });
      this.$toast.clear()
      if (res.data.code != 200) {
        this.$notify({ type: "danger", message: "密码有误登录失败" });
        this.password = "";
      } else {
        sessionStorage.setItem("uid", res.data.profile.userId);
        this.$router.replace("/home/mine");
      }
    },
    labelStyle(event) {
      event.path[3].children[0].classList.add("label");
    },
  },
  beforeRouteLeave(to, from, next) {
    if(to.name == 'mine') {
      to.meta.keepAlive = false
    }
    next()
  }
};
</script>

<style lang='less'>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(-0deg, #253450, #263d58);
  .login {
    position: absolute;
    width: 300px;
    padding: 10px 0;
    background-image: rgba(20, 20, 20, 0.3);
    box-shadow: 0 0px 25px rgba(0, 0, 0, 0.4);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    .title {
      text-align: center;
      font-size: 16px;
      color: white;
    }
    div,
    button {
      background-color: transparent;
      border: 0;
    }
    .van-cell__value,
    .van-cell {
      height: 60px;
      margin-bottom: 3px;
      position: relative;
      .van-field__label {
        position: absolute;
        top: 33px;
        color: white;
        transition: all 0.5s;
      }
      .label {
        top: 10px;
        font-size: 12px;
        color: rgb(214, 214, 214);
      }
      .van-field__body {
        width: 100%;
        position: absolute;
        top: 25px;
        input {
          color: rgb(255, 255, 255);
        }
      }
    }
    .van-field__error-message {
      position: absolute !important;
      top: 0;
      right: 0;
    }
    .van-button {
      width: 270px;
      margin: auto;
      margin-top: 20px;
      background-color: rgb(30, 6, 95);
      border-radius: 0;
    }
    .register {
      color: white;
      font-size: 12px;
      float: right;
      margin-top: 20px;
      margin-right: 10px;
    }
  }
}
</style>