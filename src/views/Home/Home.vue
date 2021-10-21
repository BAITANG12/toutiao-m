<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar class="page-nav-bar" fixed>
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
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <!-- 在每一个用户频道下，渲染出对应的“文章列表组件” -->
        <art-list :channel-id="item.id"></art-list>
      </van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon
      name="plus"
      class="plus"
      size="16"
      @click="show = true"
    ></van-icon>

    <!-- 频道管理的弹出层 -->
    <van-popup
      v-model="show"
      :close-on-click-overlay="false"
      @closed="isDel = false"
    >
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon
              name="cross"
              size="14"
              color="white"
              @click="show = false"
            />
          </template>
        </van-nav-bar>

        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <span class="title-gray">{{
                  isDel ? "点击移除频道" : "点击进入频道"
                }}</span>
              </div>
              <span class="btn-edit" @click="isDel = !isDel">{{
                isDel ? "完成" : "编辑"
              }}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col
                span="6"
                v-for="(item, index) in userChannel"
                :key="item.id"
              >
                <!-- 用户的频道 Item 项 -->
                <div
                  class="channel-item van-hairline--surround"
                  @click="onUserChannelClick(item, index)"
                >
                  {{ item.name }}
                  <!-- 删除的图标 -->
                  <van-badge
                    color="transparent"
                    class="cross-badge"
                    v-if="
                      isDel && item.name !== '推荐' && userChannel.length > 2
                    "
                  >
                    <template #content>
                      <van-icon
                        name="cross"
                        class="badge-icon"
                        color="#cfcfcf"
                        size="12"
                      />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>

          <!-- 分隔线 -->
          <div class="van-hairline--top sp-line"></div>

          <!-- 更多频道 -->
          <div class="more-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">可添加频道：</span>
                <span class="title-gray">点击添加频道</span>
              </div>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in moreChannels" :key="item.id">
                <div
                  class="channel-item van-hairline--surround"
                  @click="addChannel(item)"
                >
                  {{ item.name }}
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  getUserChannelAPI,
  getAllChannelAPI,
  updateUserChannelAPI,
} from "@/api/homeAPI";
import ArtList from "@/components/ArtList/ArtList.vue";

export default {
  name: "Home",
  data() {
    return {
      // 标签页激活项的索引
      active: 0,
      userChannel: [],

      // 控制频道管理弹出层的展示与隐藏
      show: false,

      // 所有的频道列表数据
      allChannel: [],

      // 频道数据是否处于删除的状态
      isDel: false,
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
    //获取所有频道的列表数据
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI();
      if (res.message === "OK") {
        this.allChannel = res.data.channels;
      }
    },
    // 新增频道（形参 item 就是当前用户点击的频道信息对象）
    // 格式：{ id, name }
    addChannel(item) {
      // 将用户点击的频道，添加到“用户频道”列表中
      this.userChannel.push(item);

      // 调用 API 接口，将最新的用户频道，存储到后台数据库中
      this.updateChannel();
    },
    // 把用户的频道列表数据提交到后端保存
    async updateChannel(item) {
      // 1. 准备要提交到服务器的数据
      const channels = this.userChannel // 将“推荐”从频道列表中过滤出去
        .filter((item) => item.name !== "推荐") // 调用数组的 map 循环，最终返回一个处理好的新数组
        .map((item, index) => {
          return {
            id: item.id,
            sep: index + 1,
          };
        });
      // 2. 调用 API 接口
      const { data: res } = await updateUserChannelAPI(channels);
      if (res.message === "OK") {
        // 3. 通过 notify 弹框提示用户更新成功
        this.$notify({ type: "success", message: "更新成功", duration: 1000 });
      }
    },
    // 从用户频道列表中，移除指定 id 的频道
    onUserChannelClick(channel, index) {
      if (this.isDel) {
        // 处于删除状态
        // 从 userChannel 中移除指定的频道
        if (channel.name === "推荐" || this.userChannel.length === 2) return;
        this.userChannel = this.userChannel.filter(
          (item) => item.id !== channel.id
        );
        // 将更改过后的用户频道数据，提交到服务器保存
        this.updateChannel();
      } else {
        // 1. 修改 Tabs 的激活项的索引值
        this.active = index;
        // 2. 关闭 popup 弹出层
        this.show = false;
      }
    },
  },
  created() {
    this.initUserChannel();

    // 请求所有的频道列表数据
    this.initAllChannel();
  },
  components: {
    ArtList,
  },
  computed: {
    //更多的列表数据
    moreChannels() {
      // 1. 对数组进行 filter 过滤，返回的是符合条件的新数组
      return this.allChannel.filter((item) => {
        // 判断当前循环项，是否在 “我的频道” 列表之中
        const index = this.userChannel.findIndex((x) => x.id === item.id);
        // 如果不在，则 return true，表示需要把这一项存储到返回的新数组之中
        if (index === -1) return true;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 92px;
  padding-bottom: 50px;
}

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

.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 16px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    line-height: 56px;
    padding: 0 12px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 24px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 20px;
  line-height: 40px;
  height: 40px;
  border-radius: 12px;
  font-size: 24px;
}

.channel-item {
  font-size: 24px;
  text-align: center;
  line-height: 72px;
  background-color: #fafafa;
  margin: 12px;
}

.cross-badge {
  position: absolute;
  right: -6px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 20px 0 40px 0;
}
</style>