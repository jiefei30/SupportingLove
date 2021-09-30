<template>
  <view>
    <!-- 对话区域 -->
    <scroll-view id="scrollView"
                 scroll-y="true"
                 :scroll-top="scrollTop"
                 class="content"
                 :style="{ height: isShow ? 'calc(100vh - 136.8px)' : 'calc(100vh - 44px)' }">
      <view id="contentView">
        <view v-for="(sentence,index) in talks"
              :key="index"
              class="item-box"
              :style="{ justifyContent: sentence.isRight ? 'flex-end' : 'flex-start' }">
          <view class="head-box"
                :style="{ order: sentence.isRight ? 1 : 0 }">
            <image v-if="sentence.isRight"
                   :src="orientation == 1 ? answerAvatar : askAvatar"></image>
            <image v-else
                   :src="orientation == 1 ? askAvatar : answerAvatar"></image>
          </view>
          <view>
            <text class="sentence"
                  v-if="sentence.chatMessageType === 'text'">{{ sentence.content }}</text>
            <image v-else-if="sentence.chatMessageType === 'image'"
                   :src="sentence.content"
                   mode="aspectFill"
                   class="picture"
                   @click="previewImage(sentence.content)"></image>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 底部的输入框部分以及拓展工具箱 -->
    <view class="tools-wrap">
      <view class="tools-bar">
        <view>
          <image src="/static/icons/voice.png"></image>
        </view>
        <view class="input-box">
          <textarea auto-height
                    fixed
                    id="#textarea"
                    :style="{ bottom: textareaBottom }"
                    @input="emptyState"
                    :value="inputValue" />
          </view>
        <view>
          <image src="/static/icons/expend.png"
                 @tap="changeState"
                 v-if="isEmpty"></image>
          <button v-else
                  type="primary"
                  size="mini"
                  class="sendButton"
                  @click="sendMessage('text', inputValue, orientation == 1 ? answerId : askId, orientation == 1 ? askId : answerId)">发送</button>
        </view>
      </view>
      <view class="tools-case"
            v-if="isShow">
        <view @click="chooseImg('camera')">
          <image src="/static/icons/photograph.png"></image>
          <view><text>拍照照</text></view>
        </view>
        <view @click="chooseImg('album')">
          <image src="/static/icons/album.png"></image>
          <view><text>图库</text></view>
        </view>
        <view v-if="orientation !== 1">
          <image src="/static/icons/call.png"></image>
          <view><text>语音通话</text></view>
        </view>
        <view v-if="orientation !== 1">
          <image src="/static/icons/video.png"></image>
          <view><text>视频通话</text></view>
        </view>
        <view @click="closeTalk">
          <image src="/static/icons/close.png"></image>
          <view><text>结束问答</text></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 0,
      textareaBottom: 0,
      isShow: false,
      isEmpty: true,
      isRight: false,
      inputValue: "",
      orientation: undefined,
      myId: undefined,
      askId: undefined,
      questionId: undefined,
      answerId: undefined,
      askAvatar: "",
      answerAvatar: "",
      answerNickName: "",
      talks: [],
      picturePath: [],
      timeout: 50000,
      timeoutObj: undefined,
      heartCount: 0,
      socketTask: undefined
    };
  },
  onLoad(res) {
    // 获取聊天室双方的身份信息
    this.questionId = res.questionId;
  },
  onReady() {
    // 获取聊天室双方的相关信息
    this.getUserInfo();
  },
  onShow() {
    this.startHeart();
  },
  beforeDestroy() {
    this.closeSocket();
  },
  methods: {
    // 弹窗
    showToast(res) {
      uni.showToast({
        title: res,
        mask: true,
        icon: "none"
      });
    },
    // 点击弹出拓展工具箱
    changeState() {
      this.isShow = !this.isShow;
      if (this.textareaBottom == 0) {
        this.textareaBottom = 94.8 + "px";
      } else {
        this.textareaBottom = 0;
      }
      this.scrollToBottom();
    },
    // 当输入框内有内容时，拓展工具箱图标切换成发送button
    emptyState(event) {
      if (event.target.value === "") {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
        this.inputValue = event.target.value;
      }
    },
    // 滚动至聊天底部
    scrollToBottom() {
      let _this = this;
      let query = uni.createSelectorQuery();
      query.select("#scrollView").boundingClientRect();
      query.select("#contentView").boundingClientRect();
      query.exec(res => {
        if (res[1].height > res[0].height) {
          _this.scrollTop = res[1].height - res[0].height + 71;
        }
      });
    },
    // 获取当前用户为解答方还是提问方
    getUserInfo() {
      uni.getStorage({
        key: "wxUser",
        success: res => {
          this.orientation = res.data.orientation;
          // 获取当前用户的头像
          if (this.orientation == 1) {
            this.answerId = res.data.id;
            this.answerAvatar = res.data.avatar;
          } else {
            this.askId = res.data.id;
            this.askAvatar = res.data.avatar;
          }
          this.getAvatarInfo();
        },
        fail: res => {
          this.showToast(res);
        }
      });
    },
    // 获取聊天室双方的信息
    getAvatarInfo() {
      uni.request({
        url: getApp().globalData.baseUrl + "api/question/getById",
        data: {
          questionId: this.questionId
        },
        success: res => {
          this.answerNickName = res.data.answerNickName;
          // 获取对方用户的头像
          if (this.orientation == 1) {
            this.askId = res.data.askId;
            this.askAvatar = res.data.askAvatar;
          } else {
            this.answerId = res.data.answerId;
            this.answerAvatar = res.data.answerAvatar;
          }
          // 获取聊天记录
          this.getUseTalk();
          // 建立链接
          this.connection();
        },
        fail: res => {
          this.showToast(res);
        }
      });
    },
    // 获取曾经的聊天记录
    getUseTalk() {
      let _this = this;
      uni.request({
        url: getApp().globalData.baseUrl + "api/question/getChatContent",
        data: {
          questionId: this.questionId,
          askId: this.askId,
          answerId: this.answerId
        },
        success: res => {
          // 将所有聊天记录中的图片放入数组
          _this.picturePath = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].fromUserId == _this.myId) {
              res.data[i].isRight = true;
            } else {
              res.data[i].isRight = false;
            }
            if (res.data[i].chatMessageType === "image") {
              res.data[i].content =
                getApp().globalData.baseUrl + res.data[i].content;
              _this.picturePath.push(res.data[i].content);
            }
            _this.talks.push(res.data[i]);
          }
          // 滚动到最底部
          _this.scrollToBottom();
        },
        fail: res => {
          _this.showToast(res);
        }
      });
    },
    // 点击结束问答
    closeTalk() {
      let _this = this;
      let user = uni.getStorageSync("wxUser");
      if (user.orientation != 0) {
        uni.showModal({
          content: "你没有权限结束问题"
        });
        return;
      }
      uni.showModal({
        content: "您确定要结束回答吗",
        success(res) {
          if (res.confirm) {
            let information = {
              questionId: "" + _this.questionId,
              askId: "" + _this.askId,
              answerId: "" + _this.answerId,
              answerNickName: "" + _this.answerNickName
            };
            information = JSON.stringify(information);
            // 修改问题状态为 2 已经解决
            uni.request({
              url: getApp().globalData.baseUrl + "api/question",
              method: "PUT",
              header: {
                Authorization: getApp().globalData.Authorization
              },
              data: {
                id: _this.questionId,
                status: 2
              },
              success: function(res) {
                uni.navigateTo({
                  url: "../evaluation/evaluation?information=" + information
                });
              },
              fail: function(res) {
                this.showToast(res);
              }
            });
          }
        }
      });
    },
    // 点击拍照或者选择图片
    chooseImg(method) {
      let _this = this;
      let methods = [];
      methods.push(method);
      uni.chooseImage({
        sourceType: methods,
        success: res => {
          uni.uploadFile({
            url: getApp().globalData.baseUrl + "api/file/upload-file",
            filePath: res.tempFilePaths[0],
            name: "file",
            success: res => {
              _this.sendMessage(
                "image",
                res.data,
                _this.orientation == 1 ? _this.answerId : _this.askId,
                _this.orientation == 1 ? _this.askId : _this.answerId
              );
            },
            fail: res => {
              _this.showToast(res);
            }
          });
        },
        fail: res => {
          _this.showToast(res);
        }
      });
    },
    // 预览图片
    previewImage(content) {
      let _this = this;
      uni.previewImage({
        current: content,
        urls: this.picturePath,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          fail: err => {
            _this.showToast(err);
          }
        }
      });
    },
    // 建立 websocket 链接，并监听服务器返回过来的消息
    connection() {
      let _this = this;
      this.myId = this.orientation == 1 ? this.answerId : this.askId;
      this.socketTask = uni.connectSocket({
        url: "wss://www.churuitao.top/ws/" + _this.myId,
        success: res => {
          console.log("建立socket链接成功");
          _this.startHeart();
        },
        fail: res => {
          console.log("建立socket链接失败");
          _this.showToast(res);
        }
      });
      this.socketTask.onOpen(res => {
        // 监听服务器返回过来的消息
        _this.socketTask.onMessage(res => {
          let msg = JSON.parse(res.data);
          console.log("发送过来的消息");
          console.log(msg);
          if (msg.chatMessageType === "heart") {
            _this.timeout = 50000;
            _this.resetHeart();
          } else if (msg.chatMessageType === "text") {
            msg.isRight = false;
            _this.talks.push(msg);
            // 将聊天窗口移到最底下
            _this.scrollToBottom();
          } else if (msg.chatMessageType === "image") {
            msg.isRight = false;
            msg.content = getApp().globalData.baseUrl + msg.content;
            _this.picturePath.push(msg.content);
            _this.talks.push(msg);
            // 将聊天窗口移到最底下
            _this.scrollToBottom();
          } else {
            _this.timeout = 5000;
            _this.heartCount++;
            _this.resetHeart();
            if (_this.heartCount >= 3) {
              _this.connection();
            }
          }
          // 将聊天窗口移到最底下
          _this.scrollToBottom();
        });
      });
    },
    // 发送信息并监听服务器返回过来的消息
    sendMessage(method, content, fromUserId, toUserId) {
      let _this = this;
      if (method === "heart") {
        let heartMsg = {
          chatMessageType: method,
          toUserId: toUserId
        };
        _this.socketTask.send({
          data: JSON.stringify(heartMsg),
          success: res => {
            console.log("心跳包发送成功");
            console.log(heartMsg);
          },
          fail: res => {
            _this.showToast(res);
          }
        });
      }
      let msg = {
        chatMessageType: method,
        content: content,
        questionId: _this.questionId,
        fromUserId: fromUserId,
        toUserId: toUserId,
        dateTime: _this.timestampToDate(Date.now())
      };
      // 发送消息
      _this.socketTask.send({
        data: JSON.stringify(msg),
        success() {
          if (
            msg.chatMessageType === "text" ||
            msg.chatMessageType === "image"
          ) {
            console.log("发送的消息");
            console.log(msg);
            msg.isRight = true;
            if (msg.chatMessageType === "image") {
              msg.content = getApp().globalData.baseUrl + msg.content;
              _this.picturePath.push(msg.content);
            }
            _this.talks.push(msg);
            _this.inputValue = "";
            _this.isEmpty = true;
          }
        },
        fail: res => {
          _this.showToast(res);
        }
      });
      // 将聊天窗口移到最底下
      _this.scrollToBottom();
    },
    // 断开 websocket 连接
    closeSocket() {
      this.socketTask.close({
        success(res) {
          console.log("已断开websocket连接");
        },
        fail(err) {
          console.log("关闭websocket失败");
        }
      });
    },
    // 发送心跳
    startHeart() {
      let _this = this;
      let toUserId = this.orientation == 1 ? this.askId : this.answerId;
      this.timeoutObj = setTimeout(() => {
        _this.sendMessage("heart", "", "", toUserId);
      }, _this.timeout);
    },
    // 重置心跳
    resetHeart() {
      clearTimeout(this.timeoutObj);
      this.startHeart();
    }
  }
};
</script>

<style scoped>
.content {
  width: 100vw;
}
#contentView {
  box-sizing: border-box;
}
.tools-wrap {
  position: fixed;
  bottom: 0;
  z-index: 1;
  background-color: #f0f0f0;
}
.tools-bar,
.tools-case {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.tools-bar {
  width: 100vw;
  height: 44px;
}
.tools-bar > view > image {
  margin-bottom: 6px;
}
.tools-bar > view > image,
.tools-case > view > image {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
.input-box {
  width: calc(80vw - 64px);
}
.input-box > textarea {
  border-radius: 30px;
  border: 1px solid #333;
  padding: 7px 0;
  padding-left: 20rpx;
  position: absolute;
  box-sizing: border-box;
  margin-bottom: 6px;
  width: calc(80vw - 64px);
  height: 34px;
  min-height: 34px !important;
}
.tools-case {
  margin: 20px;
  box-sizing: border-box;
}
.tools-case > view {
  text-align: center;
}
.tools-case > view > view > text {
  font-size: 12px;
  color: #808080;
}
.item-box {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.head-box {
  margin: auto 15px;
}
.head-box > image {
  width: 36px;
  height: 36px;
}
.picture {
  max-width: 50vw;
  max-height: 25vw;
}
.sentence {
  max-width: 50vw;
  margin: 0 15px;
  padding: 30rpx;
  word-break: break-all;
  border-radius: 10px;
  display: inline-block;
  background-color: #ffc8c8;
}
.sendButton {
  padding: 1.2px 10px;
}
</style>
