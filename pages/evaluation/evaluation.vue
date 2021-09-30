<template>
  <view id="content">
    <view id="solverView">
      <image id="solverHeadImg"
             :src="solver.headImg"></image>
      <text id="solverName">{{solver.name}}</text>
    </view>
    <view id="formView">
      <form>
        <textarea id="comment"
                  v-model="comment.textValue"
                  name="comment"
                  type="text"
                  :placeholder="comment.textPlaceholder"
                  placeholder-class="" />
        <view id="starts">
					<view class="start" v-for="(item , i) in comment.starts" :key = "i" @click="setCurrnetStart(i)">
						<text class="startName">{{item.name}}</text>
						<uni-rate value="3" size="18" max="5" margin="9" isfill="false"  @change="setStar()"></uni-rate>
					</view>
				</view>
				<button id="submit" @click="submit">提交</button>
			</form>
		</view>
	</view>
</template>

<script>
import uniRate from "@/components/start/uni-rate/uni-rate.vue";

export default {
  data() {
    return {
	  questionId : null,
	  askId : null,
      solver: {
		id : "",
        name: "张三",
        headImg: "../../static/solver.png"
      },
      isChange: false,
      currentStart: 0,
      comment: {
        textPlaceholder: "对ta的解答说一下你的感受：",
        textValue: "",
        starts: [
          {
            name: "解答评价",
            value: 3
          },
          {
            name: "条理清楚",
            value: 3
          },
          {
            name: "回答快速",
            value: 3
          },
          {
            name: "态度友好",
            value: 3
          }
        ]
      }
    };
  },
  onLoad: function(option) {
	  let information = JSON.parse(option.information)
	  console.log(information)
	  this.questionId = information.questionId
	  this.askId = information.askId
	  this.solver.id = information.answerId
	  this.comment.textPlaceholder =
	    "对" + this.solver.name + "的解答说一下你的感受：";
  },
  components: {
    uniRate
  },
  methods: {
    setStar: function(e) {
      this.currentStart = e.value;
      this.isChange = true;
    },
    setCurrnetStart: function(i) {
      if (this.isChange) {
        this.comment.starts[i].value = this.currentStart;
      }
      this.isChange = false;
    },
	submit:function(){
		let _this = this
				
				if(_this.comment.textValue === ""){
					uni.showModal({
						title: "错误",
						content: "评论内部不能为空"
					})
					return;
				}
				
				let currentDate = new Date();
				
				// post请求实体
				let resources   = {
					// 评价id
					id : null,
					
					// 问题 提问人 解答人 id
					questionId : _this.questionId,
					fromId : _this.askId,
					toId :  _this.solver.id,
					
					// 星级评价
					answerLevel : _this.comment.starts[0].value,
					regulationLevel : _this.comment.starts[1].value,
					speedLevel : _this.comment.starts[2].value,
					attitudeLevel : _this.comment.starts[3].value,
					
					// 评价内容
					context : _this.comment.textValue
				};
				uni.request({
				    url: getApp().globalData.baseUrl+"api/evaluate", //新增评价
					method: "POST",					  
				    data: resources, // POST实体
				    header: {
						Authorization : getApp().globalData.Authorization // 验证
				    },
				    success: (res) => {
				        uni.showModal({
				        	title: "成功",
				        	content: "评价提交成功",
							success() {
							
								uni.switchTab({
									url:"../home/home"
								})
							}
				        })

				        return;
				    },
					fail: (data) => {
						uni.showModal({
							title: "失败",
							content: "评价提交失败"
						})
						return;
					}
				});
	}
  }
};
</script>

<style scoped>
#content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 36rpx 30rpx 0rpx 28rpx;
}

#solverView {
  margin-bottom: 18rpx;
}

#solverHeadImg {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
}

#solverName {
  font-size: 28rpx;
  margin-left: 32rpx;
}

#formView {
  width: 676rpx;
}

#comment {
  height: 210rpx;
  width: 676rpx;
  border: 1px #999999 solid;
  padding-top: 26rpx;
  padding-left: 24rpx;
}

#starts {
  padding-top: 60rpx;
}

.start {
  display: flex;
  align-items: center;
  margin-bottom: 28rpx;
}

.startName {
  font-size: 28rpx;
  margin-right: 10rpx;
}

uni-rate {
  position: relative;
  top: 4rpx;
  margin-left: 0rpx;
}
#submit {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 52rpx;
  margin-top: 60rpx;
  height: 56rpx;
  width: 160rpx;
  color: #ffffff;
  font-size: 26rpx;
  background-color: #ffa000;
}
</style>
