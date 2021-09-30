<template>
  <view class="question-item">
		<view class="question" v-for="(question, index) in questions" :key="index">
			<image class="questionImg" :src="question.thumbnailPath" @click="click_img(question)"></image>
			<button class="questionButton" @click="talk(question)">查看</button>
    </view>
  </view>
</template>

<script>
export default {
	name: 'question-item',
  data() {
    return {
		op
	};
  },
  onLoad() {
    console.log(this.questions);
  },
  methods: {
		
		talk(question) {
			if(question.status === 0){
			let data = JSON.stringify(question)
			uni.navigateTo({url:"../../pages/askQuestion/description?question="+ data});
			}else {
			  uni.navigateTo({
				url:
				  "../../pages/answerQuestions/index?askId=" +
				  question.askId +
				  "&answerId=" +
				  question.answerId +
				  "&questionId=" +
				  question.questionId
			  });
			}
		},
		click_img(question){
			console.log(question)
			uni.previewImage({
			            urls: [question.picturePath],
			            longPressActions: {
			                success: function(data) {
			                 
			                },
			                fail: function(err) {
			                    console.log(err.errMsg);
			                }
			            }
			        });
		}
  },
  props: {
    questions: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style>
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
</style>
