<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录" />

    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        left-icon="phone-o"
        name="mobile"
        placeholder="请输入手机号"
        :rules="rules.mobile"
        maxlength="11"
      />
      <van-field
        v-model="user.code"
        left-icon="envelop-o"
        name="code"
        placeholder="请输入验证码"
        :rules="rules.code"
      >
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            :time="1000 * 5"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            class="send-sms-btn"
            round
            size="small"
            type="default"
            @click="onSendSms"
            native-type="button"
            v-else
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from "@/api/user.js";
export default {
  name: "loginIndex",
  data() {
    return {
      user: {
        mobile: "17756225565",
        code: "246810",
      },
      rules: {
        // 手机号的校验规则
        mobile: [
          { required: true, message: "请填写您的手机号", trigger: "onBlur" },
          {
            pattern: /^1\d{10}$/,
            message: "请填写正确的手机号",
            trigger: "onBlur",
          },
        ],
        // 密码的校验规则
        code: [
          { required: true, message: "请填写您的密码", trigger: "onBlur" },
        ],
      },
      isCountDownShow: false,
    };
  },
  methods: {
    async onSubmit() {
      const user = this.user;

      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0,
      });

      try {
        const { data } = await login(this.user);
        this.$store.commit("updateTokenInfo", data.data);
        this.$toast.success("登录成功");
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("手机号或验证码错误");
        } else {
          this.$toast.fail("登录失败，请稍后再试");
        }
      }
    },
    async onSendSms() {
      try {
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        return;
      }
      this.isCountDownShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
}
.send-sms-btn {
  background-color: #ededed;
  width: 152px;
  height: 46px;
  line-height: 46px;
  font-size: 22px;
  color: #666;
}
.van-button--info {
  background-color: #6db4fb;
  border: none;
}
</style>