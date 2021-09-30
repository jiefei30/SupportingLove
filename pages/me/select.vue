<template>
	<view class="me-body">
		<view class="me-select-body">
			<view class="select-frame">
				<view :class="['select',{'select-active':(orientation==1)}]" @click="select(1)">
					<view>
						<image src="../../static/icons/default-avatar.png"></image>
					</view>
					<view class="select-text">
						<text>我是提问者</text>
					</view>
				</view>
			</view>
			<view class="select-frame">
				<view :class="['select',{'select-active':(orientation==2)}]" @click="select(2)">
					<view>
						<image src="../../static/icons/solver.png"></image>
					</view>
					<view class="select-text">
						<text>我是解答者</text>
					</view>
				</view>
			</view>
			<view class="select-foot">
				<button type="primary" class="weixinBtn" open-type="getUserInfo" @getuserinfo="startAuthorization" withCredentials="true"
				 :disabled="!orientation">微信登陆
				</button>
				<button @click="this.uniback(1)">取消</button>
			</view>

		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				orientation: 0
			}
		},
		methods: {
			//切换身份
			select: function(res) {
				this.orientation = res;
			},
			//微信授权登录
			startAuthorization: function(infoRes) {
				_self = this;
				if (!infoRes.detail.iv) {
					_self.commonToast("您取消了授权","none",1500);
				} else {
					//授权成功
					uni.showLoading({
						mask: true,
						title: "正在授权中",
						complete: function() {
							//调用登录，获取code
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									//得到用户信息 
									uni.request({
										url: getApp().globalData.baseUrl + 'wxAuth/login',
										method: 'POST',
										data: {
											"encryptedData": infoRes.detail.encryptedData,
											"iv": infoRes.detail.iv,
											'code': loginRes.code,
											'orientation': _self.orientation - 1
										},
										success: (res) => {
											if (res.data.id) {
												//写入缓存
												uni.setStorage({
													key: 'wxUser',
													data: res.data,
													success: function() {
														//修改登录状态
														getApp().globalData.isLogin = true;
														//修改上一页的数据
														var pages = getCurrentPages();
														var prevPage = pages[pages.length - 2].setData({
															nickName: infoRes.detail.userInfo.nickName,
															avatar: infoRes.detail.userInfo.avatarUrl,
															isLogin: true
														})
														uni.hideLoading()
														//返回
														_self.uniback(1)
													}
												});
											} else {
												uni.hideLoading()
												_self.errorToast(res)
											}
										},
										fail: function(res) {
											uni.hideLoading()
											_self.errorToast(res)
										}
									});
								},
								fail: function(res) {
									uni.hideLoading()
									_self.errorToast(res)
								}
							});
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
	.select {
		width: 450rpx;
		height: 380rpx;
		background-color: #fff;
		margin: 40rpx auto;
		padding: 40rpx;
		border-radius: 30rpx;
		transition: all 0.2s ease-out;
	}

	.select-active {
		box-shadow: 10px 10px 5px #dbdbdb;
		border: 2px solid #FFC107;
	}

	.select-foot {
		display: flex;
		justify-content: space-between;
		position: absolute;
		bottom: 40rpx;
		width: 100%;
	}

	.select-foot button {
		font-size: 40rpx;
		width: 100%;
		border-radius: 30rpx;
		margin: 0 40rpx 0 40rpx;
		border: 1px solid #dbdbdb;
	}

	.me-select-body image {
		display: block;
		margin: 0 auto;
		width: 250rpx;
		height: 250rpx;
	}

	.select-text {
		margin-top: 20rpx;
		font-size: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.select-frame {
		overflow: hidden;
		height: 470rpx;
	}
</style>
