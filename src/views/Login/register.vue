<template>
  <div class="login-container">
    <div class="login">
      <div class="title">注册 / 修改密码</div>

      <van-form @submit="onSubmit" ref="Form">
        <van-field
          @click="labelStyle"
          v-model="form.nickname"
          name="nickname"
          label="昵称"
          :rules="[{ message: '昵称码格式不正确' }]"
        />
        <van-field
          @click="labelStyle"
          v-model="form.password"
          type="password"
          name="密码"
          label="密码"
          :rules="[{ pattern: /^[A-Za-z0-9_.-]{6,16}$/, required: true, message: '密码格式不正确' }]"
        />
        <van-field
          @click="labelStyle"
          v-model="password"
          type="password"
          name="testPassword"
          label="确认密码"
          :rules="[{ validator, required: true, message: '密码不一致' }]"
        />
        <van-field
          @click="labelStyle"
          v-model="form.phone"
          name="phone"
          label="手机号码"
          :rules="[{ pattern: /^\d{11}$/, required: true, message: '手机号码格式不正确' }]"
        />
        <div class="container-schema">
          <van-field
            class="phoneSchema"
            @click="labelStyle"
            v-model="form.captcha"
            name="captcha"
            label="验证码"
            :rules="[{ pattern: /^[A-Za-z0-9]+$/, required: true, message: '格式不正确' }]"
          />
          <span @click="getSchema" class="getSchema" :class="{disable: disable}">{{!disable? '获取验证码' : '再次获取('+ time +')'}}</span>
        </div>
        <div>
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
      <router-link replace to="/login" class="register">&lt; 返回登录页面</router-link>
    </div>
  </div>
</template>


<script>
export default {
  name: 'register',
  data() {
    return {
      form: {
        phone: "",
        password: "",
        captcha: "",
        nickname: "",
      },
      password: "",
      disable: false,
      time: 60
    };
  },
  methods: {
    async onSubmit(values) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        overlay: true,
      });
      var res = await this.$http.post("/login/cellphone", this.form);
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
    validator(val) {
      return val == this.form.password;
    },
    getSchema() {
      if(this.disable) return
      this.$refs.Form.validate("phone")
        .catch((err) => err)
        .then((res) => {
          if (!res) {
            this.disableSchema()
            var data = this.$http.get('/captcha/sent', {
              params: {
                phone: this.form.phone
              }
            }).then(res => {
              if(res.data.code == 200) {
                this.$notify({type: 'success', message: '验证码发送成功'});
              }else {
                this.$notify({type: 'danger', message: '验证码发送失败'});
              }
            })
          }
        });
    },
    disableSchema() {
      this.disable = true
      var that = this
      var interval = setInterval(function() {
        --that.time
        if(that.time < 1) {
          that.disable = false
          clearInterval(interval)
        }
      }, 1000)
    }
  },
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
  .container-schema {
    display: flex;
    justify-content: center;
  }
  .phoneSchema {
    flex: 1;
  }
  .getSchema {
    flex: 1;
    height: 45px;
    margin-top: 15px;
    margin-right: 15px;
    background-color: rgb(1, 168, 219);
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-weight: 700;
    color: white;
  }
  .disable {
    background-color: rgb(110, 110, 110);
    color: rgb(199, 199, 199);
    font-weight: 600;
  }
}
</style>