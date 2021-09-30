<template>
	<view class="me-body">
		<!-- 我的：头部 -->
		<view class="head">
			<!-- 我的：头部：头像 -->
			<view class="avatar" @click="toSelect">
				<image :src="avatar" mode="aspectFit" @error="avatarError"></image>
			</view>
			<!-- 我的：头部：信息 -->
			<view>
				<view style="margin-bottom: 10rpx;"><text>{{nickName}}</text></view>
				<view><text>{{id}}</text></view>
			</view>
		</view>
		<!-- 我的：主要信息 -->
		<view>
			<view class="cu-form-group margin-top me-padding" @click="toDetail(1)">
				<view class="title">个人信息</view>
				<image src="../../static/icons/right.png" class="me-right me-right-rpx"></image>
			</view>
			<view class="cu-form-group me-padding" @click="toDetail()">
				<view class="title" v-if="isLogin && (status==0)">认证资料（未认证）</view>
				<view class="title" v-if="isLogin && (status==1)">认证资料（已认证）</view>
				<view class="title" v-if="isLogin && (status==2)">认证资料（认证失败）</view>
				<view class="title" v-if="isLogin && (status==3)">认证资料</view>
				<image src="../../static/icons/right.png" class="me-right me-right-rpx"></image>
			</view>
			<view class="cu-form-group me-padding">
				<view class="title" v-if="(orientation==0) || (orientation==2)">我的提问：{{answerCount}}条</view>
				<view class="title" v-if="(orientation==1)">我的解答：{{answerCount}}条</view>
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">已解答：&nbsp;&nbsp;   {{solveCount}}条</view>
			</view>
		</view>
		<!-- <view class="me-content">
			<view class="me-content-item" @click="toDetail(1)">
				<text>个人信息</text>
				<image src="../../static/icons/right.png" class="me-right"></image>
			</view>
			<view class="me-content-item" @click="toDetail()">
				<text>认证资料</text>
				<text v-if="isLogin && (status==0)">（未认证）</text>
				<text v-if="isLogin && (status==1)">（已认证）</text>
				<text v-if="isLogin && (status==2)">（认证失败）</text>
				<image src="../../static/icons/right.png" class="me-right"></image>
			</view>
			<view class="me-content-item">
				<text v-if="(orientation==0) || (orientation==2)">我的提问</text>
				<text v-if="(orientation==1)">我的解答</text>
				<text>：{{answerCount}}条</text>
			</view>
			<view class="me-content-item me-no-border">
				<text>已解答：{{solveCount}}条</text>
			</view>
		</view> -->
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				isLogin: getApp().globalData.isLogin,
				//基本信息
				avatar: "../../static/icons/default-avatar.png",
				nickName: "点击头像登录",
				id: "",
				orientation: 2,
				orientationText: "提问",
				//认证状态
				status: 3,
				message: "",
				certificationText: '未认证',
				//个数请求
				answerCount: 0,
				solveCount: 0
			};
		},
		onLoad() {
			_self = this;
			//如果已经登录
			if (getApp().globalData.isLogin) {
				//取本地缓存
				uni.getStorage({
					key: 'wxUser',
					success: function(res) {
						//修改当前页面信息
						_self.nickName = res.data.nickName;
						_self.id = res.data.id;
						_self.avatar = res.data.avatar
						_self.orientation = res.data.orientation
						// if (res.data.orientation) _self.orientationText = '解答';
						//如果已经提交过认证
						if (res.data.authData) {
							//修改状态信息
							_self.status = res.data.authData.status
							_self.message = res.data.authData.message
							// if (res.data.authData.status == 0) {
							// 	_self.certificationText = '认证中';
							// } else 
							if (res.data.authData.status == 1) {
								// _self.certificationText = '已认证';
								//如果认证成功，请求提问和解答个数
								uni.showLoading({
									title: '正在加载数据',
									mask: true,
									success: function() {
										_self.updateInfo()
									}
								})
							} 
							// else {
							// 	_self.certificationText = '认证失败'
							// }
						}
					},
					fail: function(res) {
						console.log(res)
					}
				})
			}
		},
		onShow() {
			_self = this;
			if(!_self.isLogin) _self.isLogin = getApp().globalData.isLogin
			//身份切换后，更新tabBar
			if (!getApp().globalData.isTabBarUpdated) {
				uni.getStorage({
					key: 'wxUser',
					success: function(res) {
						_self.nickName = res.data.nickName
						_self.avatar = res.data.avatar
						_self.orientation = res.data.orientation
						_self.id  = res.data.id
						if(res.data.authData)_self.status = res.data.authData.status
						//如果为解答方
						if (res.data.orientation) {
							uni.setTabBarItem({
								index: 1,
								text: "答疑",
								iconPath: "static/icons/solve.png",
								selectedIconPath: "static/icons/solve-active.png",
								success: function() {
									getApp().globalData.isTabBarUpdated = true
								},
								fail: function(data) {}
							})
						}
					},
					fail: function() {

					}
				});
			}
		},
		onPullDownRefresh() {
			//当提交过认证资料后，下拉刷新更新数据
			if (getApp().globalData.isLogin) this.updateInfo()
			else uni.stopPullDownRefresh()
		},
		methods: {
			//头像错误
			avatarError: function() {
				this.avatar = "../../static/icons/default-avatar.png"
			},
			//去授权页面
			toSelect: function() {
				if (!getApp().globalData.isLogin) {
					this.unito('./select')
				}else this.unito('./avater')
			},
			//去个人信息或者认证资料页面
			toDetail: function(page) {
				if (!getApp().globalData.isLogin) {
					uni.showToast({
						icon: 'none',
						title: '请先登录'
					})
				} else {
					if (page) {
						this.unito('./detailInfo')
					} else this.unito('./certification')
				}
			},
			//onLoad和下拉刷新时更新
			updateInfo: function() {
				//如果已经认证过
				if (_self.status == 1) {
					//请求个数
					uni.request({
						url: getApp().globalData.baseUrl + 'api/question/getCount',
						data: {
							id: _self.id,
							type: _self.orientation
						},
						// header: {
						//     'custom-header': 'hello' //自定义请求头信息
						// },
						success: (res) => {
							_self.answerCount = res.data.answerCount
							_self.solveCount = res.data.solveCount
							uni.hideLoading()
							uni.stopPullDownRefresh()
						},
						fail: function(res) {
							uni.hideLoading()
							uni.stopPullDownRefresh()
						},
						complete: function() {}
					})
				} else { //如果没有认证通过，请求新的认证状态
					uni.request({
						url: getApp().globalData.baseUrl + 'api/authData/inquiry',
						data: {
							id: _self.id
						},
						method: 'GET',
						success: function(res) {
							console.log(res)
							_self.status = res.data.status;
							_self.message = res.data.message;
							//如果认证状态发生改变
							if (!res.data.status==400 && _self.status != res.data.status) {
								uni.getStorage({
									key: 'wxUser',
									success: function(res2) {
										//更新缓存中的认证状态
										res2.data.authData.status = res.data.status;
										res2.data.authData.message = res.data.message;
										//写入缓存
										uni.setStorage({
											key: 'wxUser',
											data: res2.data,
											success: function() {
												//更改该页的信息
												// if (res.data.status == 0) {
												// 	_self.certificationText = '认证中'
												// } else if (res.data.status == 1) {
												// 	_self.certificationText = '已认证'
												// } else _self.certificationText = '认证失败'
												uni.hideLoading()
												uni.stopPullDownRefresh()
											}
										})
									}
								})
							}else{
								uni.hideLoading()
								uni.stopPullDownRefresh()
							}
						},
						fail:function(res){
							uni.hideLoading()
							uni.stopPullDownRefresh()
						}
					})
				}
			}
		}
	};
</script>

<style>
	.head {
		width: 100%;
		height: 172rpx;
		background-color: #fff;
		display: flex;
		justify-content: start;
		margin: 20rpx 0 20rpx 0;
		align-items: center;
	}

	.avatar {
		height: 135rpx;
		width: 135rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 43rpx 0 43rpx;
	}

	.avatar image {
		height: 135rpx;
		width: 135rpx;
	}
	
	.cu-form-group .title {
	min-width: calc(4em + 10px);
	}
</style>
