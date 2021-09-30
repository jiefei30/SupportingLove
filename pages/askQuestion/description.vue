<template>
	<view id="description">
		<image id="question_img" :src="thumbnailPath" mode="aspectFit" @click="check"></image>
		<view id="time">{{time}}</view>
		<view id="cancel_button">
			<button @click="cancel_question" v-if="userId === askId">取消问题</button>
			<button @click="solve_question" v-else>解决问题</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId : null,  //登录人的id 如果和askId一致 出现取消问题不一致出现解决问题
				questionId : null,
				askId : null,
				state : null,
				questionPath : "",
				thumbnailPath : "",
				time : " ",
			}
		},
		onLoad(option){
			let _this = this
			// JSON反序列化参数
			let question = JSON.parse(option.question)
			// 获取缓存数据 - 登录的user
			let user =  uni.getStorageSync('wxUser');
			
			this.userId = user.id;
			this.questionId = question.questionId;
			this.askId = question.askId;
			this.questionPath = question.picturePath;
			this.thumbnailPath = question.thumbnailPath;
			this.state = question.status ;
			let second;
			let minute;
			let hour;
			let time;
			setInterval(function(){
				 time = (Date.parse(new Date()) - question.createTime)/1000 
				 hour = parseInt(time / 3600)
				 minute = parseInt((time-hour*3600) / 60)
				 second = parseInt((time-hour*3600-minute*60))
				_this.time = hour+"时"+minute+"分"+second+"秒"
				console.log(_this.time)
			}, 500)
		},
		methods: {
			check : function(){
				let _this = this
				uni.previewImage({
				            urls: [_this.questionPath],
				            longPressActions: {
				                success: function(data) {
				                 
				                },
				                fail: function(err) {
				                    console.log(err.errMsg);
				                }
				            }
				        });
			},
			cancel_question : function(){
				let _this = this
				// 修改问题状态为3
				uni.request({
					url: getApp().globalData.baseUrl + "api/question",
					method: "PUT",
					header:{
						Authorization : getApp().globalData.Authorization
					},
					data:{
						id : _this.questionId,
						status : 3,
					},
					success : function(res){
						uni.showModal({
							title: "成功",
							content: "问题取消成功",
							success : function(data){
								if(!data.cancel){
									uni.switchTab({
										url: "../home/home",
										success:function(){
											getApp().globalData.isUpdataHome = true
											getApp().globalData.isUpdataQuestion = true
										}
									})
								}
							}
						})
					},
					fail : function(res){
						console.log(res)
					}
				})
			},
			solve_question : function(){
				let _this = this
				// 修改问题状态为1 解决中
				uni.request({
					url: getApp().globalData.baseUrl + "api/question",
					method: "PUT",
					header:{
						Authorization : getApp().globalData.Authorization
					},
					data:{
						id : _this.questionId,
						status : 1,
						answerId : _this.userId
					},
					success : function(res){
						getApp().globalData.isUpdataHome = true
						uni.redirectTo({
							url:"../../pages/answerQuestions/index?askId=" +
								_this.askId +
								"&answerId=" +
								_this.userId +
								"&questionId=" +
								_this.questionId
						});
					},
					fail : function(res){
						console.log(res)
					}
				})
				
			}
		}
	}
</script>

<style scoped>

	#description{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 160rpx;
	}

	#question_img { 
		display: flex;
		justify-content: center;
		width: 600rpx;
		min-height: 300rpx;
	}

	#time {
		display: flex;
		font-size: 80rpx;
		justify-content: center;
		color: #FFC107;
		padding-bottom: 40rpx;
	}

</style>
