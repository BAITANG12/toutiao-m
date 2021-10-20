<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar class="page-nav-bar">
      <!-- 左侧的插槽 -->
      <template #left>头条新闻 </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" />
      </template>
    </van-nav-bar>

    <!-- 频道列表的标签页 -->
    <van-tabs
      class="channel-tabs"
      v-model="active"
      animated
      swipeable
      sticky
      offset-top="46px"
    >
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">{{
        item.name
      }}</van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" class="plus" size="16"></van-icon>
  </div>
</template>

<script>
import { getUserChannelAPI } from "@/api/homeAPI";
export default {
  name: "Home",
  data() {
    return {
      // 标签页激活项的索引
      active: 0,
      userChannel: [],
    };
  },
  methods: {
    async initUserChannel() {
      // 1. 调用 API 接口
      const { data: res } = await getUserChannelAPI();
      // 2. 判断请求是否成功
      if (res.message === "OK") {
        // 3. 为用户的频道列表赋值
        this.userChannel = res.data.channels;
      }
    },
  },
  created() {
    this.initUserChannel();
  },
};
</script>

<style lang="less" scoped>
/deep/ .channel-tabs {
  .van-tabs__wrap {
    height: 82px;
    padding-right: 72px;
    background-color: white;
  }
  .van-tab {
    color: #777777;
  }
  .van-tab--active {
    color: #333333;
  }
  .van-tabs__line {
    width: 30px !important;
    height: 6px;
    background-color: #3296fa;
  }
}
.plus {
  position: fixed;
  top: 115px;
  right: 20px;
  z-index: 999;
}
</style>