<template>
	<view id="content">
		<wuc-tab id="topBar" textFlex="true" :tab-list="tabList" :tabCur="tabCur" @change="tabChange" :tabClass="tabClass" :selectClass="selectClass"></wuc-tab>
		<view id="questionsContent">
			<QuestionItem :questions="questions"></QuestionItem>
		</view>
		<view id="askOutter" v-if="orientation==0" @click="ask">
			<view id="askButton">
				<image id="askImg" src="../../static/icons/camera.png"></image>
			</view>
			<text id="askText">我要提问</text>
		</view>
	</view>
</template>

<script>
	import WucTab from "@/components/top-tab/wuc-tab/wuc-tab.vue";
	import QuestionItem from "@/components/question-item/question-item.vue";
	export default { 
		data() {
			return {
				tabCur: 0,
				tabList: [],
				tabClass: "tabClass",
				selectClass: "selectClass",
				questions: [],
				orientation: 0, //0提问，1解答， 2游客
				page: 0,
				totalElements: 0
			};
		},
		onReachBottom() {
			let _this = this
			if((_this.page+1)*10 >= _this.totalElements){
				uni.showModal({
					content: "这个已经是最后的啦"
				})
				return;
			}else {
				_this.page = _this.page+1
				let flag = this.getQuestion(_this.orientation == 0 ? _this.tabCur : _this.tabCur+1); 
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			let _this = this
			this.clearQuestions()
				_this.getQuestion(_this.orientation == 1 ?  _this.tabCur+1 : _this.tabCur); 
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 500);
		},
		onLoad() {
			console.log(1)
			let _this = this;
			//清空数据
			this.clearQuestions()
			let user = uni.getStorageSync("wxUser");
			//如果该页未更新
			if (!getApp().globalData.isSecondUpdated) {
				_this.orientation = user.orientation
				//设置选项卡
				_this.tabChangeByOrientation()
			}
			// 几乎是默认加载一次
			this.getQuestion(user.orientation == 1 ? _this.tabCur+1 : _this.tabCur)
		},
		onShow() {
			console.log(2)
			let _this = this
			// 获取问题 ori为0获取0（未解决） ori为1获取1(正在解决) ori为2（目前显示什么也没有）
			if(getApp().globalData.isUpdataQuestion){ //如果有问题修改 重新获取
				_this.clearQuestions()
				_this.getQuestion(_this.orientation == 1 ? _this.tabCur+1 : _this.tabCur)
				getApp().globalData.isUpdataQuestion =false
			}
		},
		components: {
			WucTab,
			QuestionItem
		},
		methods: {
			tabChange: function(index) {
				this.tabCur = index;
				// 获取缓存数据 - 登录user
				let user =  uni.getStorageSync('wxUser');
				this.clearQuestions()
				// 如果是提问方index需要+1
				this.getQuestion(user.orientation == 1 ? index+1 : index)
			},
			tabChangeByOrientation : function(orientation){ //根据orientation切换头边栏的信息
				if(!orientation){
					orientation = this.orientation
				}
				if(orientation == 0){ // 如果是提问方
					this.tabList = [
						{
							name: "未解答"
						},
						{
							name: "正在解答"
						},
						{
							name: "已解答"
						}
					];
					
				}else if(orientation == 1){ // 如果是解答方
					this.tabList = [{
							name: "解答中"
						},
						{
							name: "已解答"
						}
					];
				}
			},
			ask: function() {
				uni.navigateTo({ 
					url: 'photograph/photograph'
				});
			},
			setData : function(status){ //设置获取问题的data status是指要的问题状态
				let _this = this
				let user =  uni.getStorageSync('wxUser');
				let data = {
						// 查询问题 0 未解决， 1 正在解决， 2 未解决
						status: status,
						// 以问题的创建时间排序 目前无法选择正序或是倒叙
						sort : "createTime",
						// 每页的数据
						size : 10,
						// 当前页
						page : _this.page
					}
				if(_this.orientation == 0){
					data.askId = user.id
				}else if(_this.orientation == 1){
					data.answerId = user.id
				}
				console.log(data)
				return data;
			},
			getQuestion : function(status){
				let _this =this
				let user =  uni.getStorageSync('wxUser');
				//两身份都不是的 直接退出
				if(_this.orientation != 1&&_this.orientation !=0){
					return;
				}
				console.log("响应了")
				let data = _this.setData(status);
				// 默认加载问题（未解答）
				uni.request({
					url: getApp().globalData.baseUrl + "api/question",
					method: "GET",
					header: {
						// 身份验证
						Authorization  : getApp().globalData.Authorization
					},
				    data: data,
				    success: (res) => {
				        let questions = res.data.content;
						let baseUrl = getApp().globalData.baseUrl;
						for(let i=0 ;i < questions.length; i++){
							_this.questions.push({
								questionId : questions[i].id ,
								picturePath : getApp().globalData.baseUrl + questions[i].picturePath,
								thumbnailPath : getApp().globalData.baseUrl + questions[i].thumbnailPath,
								askId : questions[i].askId,
								status : questions[i].status,
								createTime : questions[i].createTime
							})
						}
						_this.totalElements = res.data.totalElements 
				    }
				});
			},
			clearQuestions: function(){
				console.log("清理了")
				this.page = 0;
				this.questions.length = 0;
				this.questions=[];
				console.log(this.questions)
			}
		}
	};
</script>


<style>
	page {
		background-color: #efefef;
	}

	wuc-tab {
		border: none;
		padding: 0rpx;
		margin: 0rpx;
		height: 56rpx;
	}
</style>


<style scoped>
	
	
	swiper {
		height: auto;
	}

	

	#questionsContent {
		display: flex;
		margin-top: 40rpx;
		margin-left: 72rpx;
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
