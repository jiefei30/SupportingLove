<template>
  <view class="content">
    <QuestionItem :questions="questions"></QuestionItem>
    <view id="askOutter"
          v-if="orientation==0">
      <view id="askButton"
            @click="ask">
        <image id="askImg"
               src="../../static/icons/camera.png"></image>
      </view>
      <text id="askText">我要提问</text>
    </view>
  </view>
</template>

<script>
import QuestionItem from "@/components/question-item/question-item.vue";
export default {
  data() {
    return {
      updated: false,
      orientation: 0, //0提问，1解答，2游客
      questions: [],
      page: 0,
      totalElements: 0
    };
  },
  components: {
    QuestionItem
  },
  created() {
    //如果没有登录先跳到登录授权界面
    if (!getApp().globalData.isLogin) {
      this.unito("/pages/me/select");
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    let _this = this;
    this.clearQuestion();
    _this.getQuestion(_this.orientation == 1 ? 0 : 2);
    setTimeout(function() {
      uni.stopPullDownRefresh();
    }, 500);
  },
  onReachBottom() {
    let _this = this;
    if ((_this.page + 1) * 10 >= _this.totalElements) {
      uni.showModal({
        content: "这个已经是最后的啦"
      });
      return;
    } else {
      _this.page = _this.page + 1;
      let flag = this.getQuestion(_this.orientation == 1 ? 0 : 2);
    }
  },
  onLoad() {
    let _this = this;
    let user = uni.getStorageSync("wxUser");
    _this.orientation = user.orientation;
    this.clearQuestion();
    this.getQuestion(_this.orientation == 0 ? 2 : 0);
  },
  onShow() {
    let _this = this;
    //如果tabBar和home的内容没有更新
    if (
      !getApp().globalData.isTabBarUpdated ||
      !getApp().globalData.isfirstUpdated
    ) {
      //取缓存，失败说明未登录
      uni.getStorage({
        key: "wxUser",
        success: function(res) {
          _this.orientation = res.data.orientation;
          if (_this.orientation) {
            uni.setTabBarItem({
              index: 1,
              text: "答疑",
              iconPath: "static/icons/solve.png",
              selectedIconPath: "static/icons/solve-active.png",
              success: function() {
                getApp().globalData.isTabBarUpdated = true;
                getApp().globalData.isfirstUpdated = true;
              },
              fail: function(data) {}
            });
          }
        },
        fail: function() {}
      });
    }

    if (getApp().globalData.isUpdataHome) {
      this.clearQuestion();
      this.getQuestion(_this.orientation == 0 ? 2 : 0);
      getApp().globalData.isUpdataHome = false;
    }
  },
  methods: {
    ask: function() {
      uni.navigateTo({
        url: "../askQuestion/photograph/photograph"
      });
    },
    setData: function(status) {
      //设置获取问题的data status是指要的问题状态
      let _this = this;
      let data = {
        // 查询问题 0 未解决， 1 正在解决， 2 未解决
        status: status,
        // 以问题的创建时间排序 目前无法选择正序或是倒叙
        sort: "createTime",
        // 每页的数据
        size: 10,
        // 当前页
        page: _this.page
      };
      return data;
    },
    getQuestion: function(status) {
      let _this = this;
      let user = uni.getStorageSync("wxUser");
      // 解答方看所有未解决的问题 status 0
      // 提问方 多添加一个askId
      let data = _this.setData(status);
      // 默认加载问题（未解答）
      uni.request({
        url: getApp().globalData.baseUrl + "api/question",
        method: "GET",
        header: {
          // 身份验证
          Authorization: getApp().globalData.Authorization
        },
        data: data,
        success: res => {
          let questions = res.data.content;
          let baseUrl = getApp().globalData.baseUrl;
          for (let i = 0; i < questions.length; i++) {
            _this.questions.push({
              questionId: questions[i].id,
              picturePath:
                getApp().globalData.baseUrl + questions[i].picturePath,
              thumbnailPath:
                getApp().globalData.baseUrl + questions[i].thumbnailPath,
              askId: questions[i].askId,
              status: questions[i].status,
              createTime: questions[i].createTime
            });
          }
          _this.totalElements = res.data.totalElements;
        }
      });
    },
    clearQuestion: function() {
      this.page = 0;
      this.questions.length = 0;
      this.questions = [];
    }
  }
};
</script>
<style>
page {
  background-color: #f7f7f7;
}
</style>
<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 56rpx;
  height: 100%;
}

.question {
  display: flex;
  flex-direction: column;

  width: 600rpx;
  margin-bottom: 52rpx;
}

.questionImg {
  display: flex;
  width: 600rpx;
  height: 300rpx;
}

.questionButton {
  margin-right: 0rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 28rpx;
  border-radius: 10rpx;
  background-color: #ffa000;
  color: #f0f0f0;
  width: 124rpx;
  height: 36rpx;
  font-size: 24rpx;
  align-self: flex-end;
}

#askOutter {
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: fixed;
  bottom: 24rpx;
  right: 32rpx;
  width: 96rpx;
  display: flex;
}

#askButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #ffffff;
  margin-bottom: 26rpx;
}

#askImg {
  width: 48rpx;
  height: 48rpx;
}

#askText {
  font-size: 24rpx;
  color: #767676;
}
</style>
